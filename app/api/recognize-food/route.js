import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const maxImageDataLength = 28_000_000;

function extractText(response) {
  if (typeof response === 'string') {
    return response;
  }

  if (!response || typeof response !== 'object') {
    return '';
  }

  for (const key of ['answer', 'caption', 'response', 'result', 'description', 'text']) {
    const text = extractText(response[key]);
    if (text) {
      return text;
    }
  }

  return '';
}

function cleanFoodName(value) {
  return value
    ?.split('\n')[0]
    .split(',')[0]
    .replace(/[^a-zA-Z -]/g, '')
    .trim()
    .toLowerCase();
}

function decodeImage(image) {
  const base64 = image.slice(image.indexOf(',') + 1);
  const binary = atob(base64);
  return Array.from(binary, (character) => character.charCodeAt(0));
}

async function recognizeWithMoondream(ai, image) {
  const response = await ai.run(
    '@cf/moondream/moondream3.1-9B-A2B',
    {
      task: 'query',
      image,
      question: 'Identify the primary food in this image. Reply with only its common English food name in lowercase, using no punctuation or explanation. If no food is visible, reply exactly: unknown',
      reasoning: false,
      stream: false,
      max_tokens: 30,
    },
  );

  return cleanFoodName(extractText(response));
}

async function recognizeWithClassifier(ai, image) {
  const response = await ai.run('@cf/microsoft/resnet-50', {
    image: decodeImage(image),
  });
  const candidatePredictions = Array.isArray(response)
    ? response
    : response?.result || response?.output || [];
  const predictions = Array.isArray(candidatePredictions) ? candidatePredictions : [];
  const topPrediction = [...predictions].sort(
    (left, right) => (right.score || 0) - (left.score || 0),
  )[0];

  return cleanFoodName(topPrediction?.label);
}

export async function POST(request) {
  let image;

  try {
    ({ image } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const imageType = typeof image === 'string'
    ? image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/)?.[1]
    : null;

  if (!imageType || !allowedImageTypes.includes(imageType) || image.length > maxImageDataLength) {
    return NextResponse.json(
      { error: 'Please use a JPEG, PNG, WebP, or GIF image smaller than 20 MB.' },
      { status: 400 },
    );
  }

  try {
    const { env } = getCloudflareContext();
    let food;

    try {
      food = await recognizeWithMoondream(env.AI, image);
    } catch (error) {
      console.error('Moondream food recognition failed; using classifier fallback:', error);
    }

    if (!food || food === 'unknown') {
      food = await recognizeWithClassifier(env.AI, image);
    }

    if (!food || food === 'unknown') {
      return NextResponse.json(
        { error: 'No food could be identified. Try a clearer photo or enter the name manually.' },
        { status: 422 },
      );
    }

    return NextResponse.json({ food });
  } catch (error) {
    console.error('Cloudflare image recognition request failed:', error);
    const errorText = error instanceof Error ? error.message.toLowerCase() : '';
    const publicMessage = errorText.includes('binding') || errorText.includes('undefined')
      ? 'Image recognition is not configured on this deployment. Redeploy with the Cloudflare AI binding enabled.'
      : errorText.includes('limit') || errorText.includes('quota') || errorText.includes('429')
        ? 'The daily image recognition allowance has been used. Please try again after 00:00 UTC.'
        : 'The image recognition service is temporarily unavailable. Please try again.';

    return NextResponse.json(
      { error: publicMessage },
      { status: 502 },
    );
  }
}

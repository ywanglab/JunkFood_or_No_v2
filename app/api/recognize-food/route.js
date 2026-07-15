import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const maxImageDataLength = 28_000_000;

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
    const imageBase64 = image.slice(image.indexOf(',') + 1);
    const response = await env.AI.run(
      '@cf/meta/llama-3.2-11b-vision-instruct',
      {
        messages: [
          {
            role: 'user',
            content: 'Identify the primary food in this image. Reply with only its common English food name in lowercase, using no punctuation or explanation. If no food is visible, reply exactly: unknown',
          },
        ],
        image: imageBase64,
        max_tokens: 30,
      },
    );
    const responseText = typeof response === 'string'
      ? response
      : response.response || response.result || response.description;
    const food = responseText?.split('\n')[0].replace(/[^a-zA-Z -]/g, '').trim();

    if (!food || food.toLowerCase() === 'unknown') {
      return NextResponse.json(
        { error: 'No food could be identified. Try a clearer photo or enter the name manually.' },
        { status: 422 },
      );
    }

    return NextResponse.json({ food });
  } catch (error) {
    console.error('Cloudflare image recognition request failed:', error);
    return NextResponse.json(
      { error: 'The image recognition service is unavailable. Please try again.' },
      { status: 502 },
    );
  }
}

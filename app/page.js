'use client';

import { useMemo, useRef, useState } from 'react';

const junkFoods = [
  'burger',
  'cheeseburger',
  'pizza',
  'fries',
  'french fries',
  'chips',
  'potato chips',
  'candy',
  'chocolate bar',
  'donut',
  'doughnut',
  'cake',
  'cookie',
  'cookies',
  'ice cream',
  'soda',
  'cola',
  'hot dog',
  'nachos',
  'fried chicken',
  'bacon',
  'brownie',
  'brownies',
  'buffalo wings',
  'candy bar',
  'cheese puffs',
  'chicken nuggets',
  'churro',
  'churros',
  'corn dog',
  'cupcake',
  'cupcakes',
  'energy drink',
  'funnel cake',
  'gummy bears',
  'instant noodles',
  'milkshake',
  'mozzarella sticks',
  'onion rings',
  'pancakes',
  'pastry',
  'popcorn chicken',
  'processed cheese',
  'ramen noodles',
  'sausage',
  'soft drink',
  'sweet cereal',
  'tater tots',
  'waffles',
  'white bread',
];

const healthyFoods = [
  'apple',
  'banana',
  'orange',
  'berries',
  'broccoli',
  'carrot',
  'salad',
  'spinach',
  'rice',
  'brown rice',
  'oatmeal',
  'eggs',
  'fish',
  'chicken breast',
  'yogurt',
  'beans',
  'lentils',
  'avocado',
  'nuts',
  'water',
  'almonds',
  'asparagus',
  'blueberries',
  'cabbage',
  'cauliflower',
  'celery',
  'chickpeas',
  'cottage cheese',
  'cucumber',
  'edamame',
  'grapes',
  'green beans',
  'kale',
  'kiwi',
  'mango',
  'oats',
  'olive oil',
  'peach',
  'pear',
  'peas',
  'pineapple',
  'plain yogurt',
  'pumpkin',
  'quinoa',
  'salmon',
  'strawberries',
  'sweet potato',
  'tofu',
  'tomato',
  'whole wheat bread',
];

function cleanFoodName(food) {
  return food.trim().toLowerCase();
}

function pluralizeFoodName(food) {
  const words = food.split(' ');
  const lastWord = words.pop();
  let pluralLastWord;

  if (/[^aeiou]y$/.test(lastWord)) {
    pluralLastWord = `${lastWord.slice(0, -1)}ies`;
  } else if (/(s|x|z|ch|sh)$/.test(lastWord)) {
    pluralLastWord = `${lastWord}es`;
  } else {
    pluralLastWord = `${lastWord}s`;
  }

  return [...words, pluralLastWord].join(' ');
}

function isListedFood(food, foodList) {
  return foodList.some((listedFood) => (
    food === listedFood || food === pluralizeFoodName(listedFood)
  ));
}

function getFoodResult(food, description = '', preparation = '') {
  const cleanedFood = cleanFoodName(food);
  const details = `${description} ${preparation}`.toLowerCase();
  const hasJunkPreparation = ['fried', 'deep fried', 'sugary', 'candy-coated', 'covered in sugar'].some((term) => details.includes(term));
  const hasHealthyPreparation = ['baked', 'grilled', 'steamed', 'roasted', 'fresh'].some((term) => details.includes(term));

  if (!cleanedFood) {
    return null;
  }

  if (isListedFood(cleanedFood, junkFoods) || hasJunkPreparation) {
    return {
      title: 'Junk food',
      emoji: '🍟',
      message: `${food.trim()} is usually considered junk food. Enjoy it sometimes, but not every day!`,
      styles: 'border-red-200 bg-red-50 text-red-800',
    };
  }

  if (isListedFood(cleanedFood, healthyFoods) || hasHealthyPreparation) {
    return {
      title: 'Not junk food',
      emoji: '🥗',
      message: `${food.trim()} is usually a healthier choice. Nice pick!`,
      styles: 'border-green-200 bg-green-50 text-green-800',
    };
  }

  return {
    title: 'Not sure yet',
    emoji: '🤔',
    message: `I do not know ${food.trim()} yet. Try a common food like pizza, apple, soda, or broccoli.`,
    styles: 'border-yellow-200 bg-yellow-50 text-yellow-800',
  };
}

function VoiceInputButton({ field, label, listeningField, onStart }) {
  const isListening = listeningField === field;

  return (
    <button
      type="button"
      onClick={() => onStart(field)}
      aria-label={isListening ? `Stop voice input for ${label}` : `Use voice input for ${label}`}
      aria-pressed={isListening}
      className={`absolute right-3 grid size-10 place-items-center rounded-xl outline-none motion-safe:transition focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${field === 'food' ? 'top-1' : 'top-3'} ${
        isListening
          ? 'animate-pulse bg-red-100 text-red-700 motion-reduce:animate-none'
          : 'bg-orange-50 text-orange-800 hover:bg-orange-100'
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8" />
      </svg>
    </button>
  );
}

function TipCalculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [cost, setCost] = useState('');
  const [tipPercent, setTipPercent] = useState('15');
  const numericCost = Number.parseFloat(cost);
  const numericPercent = Number.parseFloat(tipPercent);
  const hasValidCost = Number.isFinite(numericCost) && numericCost > 0;
  const hasValidPercent = Number.isFinite(numericPercent) && numericPercent >= 0;
  const hasValidCalculation = hasValidCost && hasValidPercent;
  const calculatedTip = hasValidCalculation ? numericCost * numericPercent / 100 : 0;
  const totalAmount = hasValidCalculation ? numericCost + calculatedTip : 0;
  const presetPercents = [10, 15, 18, 20];
  const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className="mx-auto mt-6 w-full max-w-2xl text-left">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="tip-calculator"
        className="mx-auto flex min-h-10 items-center gap-2 rounded-full border border-lime-300 bg-lime-50 px-4 py-2 text-sm font-bold text-lime-900 outline-none motion-safe:transition hover:bg-lime-100 focus-visible:ring-2 focus-visible:ring-lime-600 focus-visible:ring-offset-2"
      >
        <span aria-hidden="true">$</span>
        Tip calculator
      </button>

      {isOpen ? (
        <section id="tip-calculator" className="mt-4 rounded-3xl border border-lime-200 bg-white p-5 shadow-lg sm:p-6">
          <h2 className="text-xl font-black text-slate-900">Calculate a tip</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="meal-cost" className="block text-sm font-bold text-slate-700">Food cost</label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true">$</span>
                <input
                  id="meal-cost"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={cost}
                  onChange={(event) => setCost(event.target.value)}
                  placeholder="0.00"
                  className="min-h-12 w-full rounded-2xl border border-slate-300 py-3 pl-8 pr-4 outline-none focus-visible:border-lime-600 focus-visible:ring-4 focus-visible:ring-lime-100"
                />
              </div>
            </div>
            <div>
              <label htmlFor="tip-percent" className="block text-sm font-bold text-slate-700">Tip percent</label>
              <div className="relative mt-2">
                <input
                  id="tip-percent"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.1"
                  value={tipPercent}
                  onChange={(event) => setTipPercent(event.target.value)}
                  className="min-h-12 w-full rounded-2xl border border-slate-300 px-4 py-3 pr-9 outline-none focus-visible:border-lime-600 focus-visible:ring-4 focus-visible:ring-lime-100"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true">%</span>
              </div>
            </div>

            {hasValidCost ? (
              <div className="sm:col-span-2">
                <p className="text-sm font-bold text-slate-700">Common tip amounts</p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {presetPercents.map((percent) => (
                    <button
                      key={percent}
                      type="button"
                      onClick={() => setTipPercent(String(percent))}
                      className="rounded-xl border border-lime-200 bg-lime-50 px-3 py-2 text-center outline-none hover:bg-lime-100 focus-visible:ring-2 focus-visible:ring-lime-600"
                    >
                      <span className="block text-xs font-bold text-lime-800">{percent}%</span>
                      <span className="font-black text-slate-900">{currency.format(numericCost * percent / 100)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div>
              <label htmlFor="tip-amount" className="block text-sm font-bold text-slate-700">Tip amount</label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true">$</span>
                <input
                  id="tip-amount"
                  type="text"
                  value={hasValidCalculation ? calculatedTip.toFixed(2) : ''}
                  placeholder="0.00"
                  readOnly
                  className="min-h-12 w-full rounded-2xl border border-lime-200 bg-lime-50 py-3 pl-8 pr-4 font-black text-lime-950 outline-none"
                />
              </div>
            </div>
            <div>
              <label htmlFor="total-amount" className="block text-sm font-bold text-slate-700">Total amount</label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true">$</span>
                <input
                  id="total-amount"
                  type="text"
                  value={hasValidCalculation ? totalAmount.toFixed(2) : ''}
                  placeholder="0.00"
                  readOnly
                  className="min-h-12 w-full rounded-2xl border border-lime-200 bg-lime-50 py-3 pl-8 pr-4 font-black text-lime-950 outline-none"
                />
              </div>
            </div>
            <p className="sr-only" role="status" aria-live="polite">
              {hasValidCalculation
                ? `Tip ${currency.format(calculatedTip)}. Total ${currency.format(totalAmount)}.`
                : ''}
            </p>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default function Home() {
  const [food, setFood] = useState('');
  const [description, setDescription] = useState('');
  const [preparation, setPreparation] = useState('');
  const [submittedFood, setSubmittedFood] = useState('');
  const [submittedDescription, setSubmittedDescription] = useState('');
  const [submittedPreparation, setSubmittedPreparation] = useState('');
  const [checkedFoods, setCheckedFoods] = useState([]);
  const [listeningField, setListeningField] = useState('');
  const [speechMessage, setSpeechMessage] = useState('');
  const [foodImage, setFoodImage] = useState(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const recognitionRef = useRef(null);
  const imageInputRef = useRef(null);
  const result = useMemo(
    () => getFoodResult(submittedFood, submittedDescription, submittedPreparation),
    [submittedFood, submittedDescription, submittedPreparation],
  );

  function handleSubmit(event) {
    event.preventDefault();
    setSubmittedFood(food);
    setSubmittedDescription(description);
    setSubmittedPreparation(preparation);
    addCheckedFood(food, description, preparation);
  }

  function tryExample(example) {
    setFood(example);
    setSubmittedFood(example);
    setDescription('');
    setPreparation('');
    setSubmittedDescription('');
    setSubmittedPreparation('');
    addCheckedFood(example);
  }

  function addCheckedFood(foodName, foodDescription = '', foodPreparation = '') {
    const checkedResult = getFoodResult(foodName, foodDescription, foodPreparation);

    if (!checkedResult) {
      return;
    }

    setCheckedFoods((currentFoods) => [
      {
        food: foodName.trim(),
        title: checkedResult.title,
        emoji: checkedResult.emoji,
        styles: checkedResult.styles,
      },
      ...currentFoods,
    ].slice(0, 10));
  }

  function startVoiceInput(field) {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;

      if (listeningField === field) {
        setListeningField('');
        setSpeechMessage('Voice input stopped.');
        return;
      }
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechMessage('Voice input is not supported by this browser. Try a current version of Chrome or Edge.');
      return;
    }

    const fieldConfig = {
      food: { label: 'food item', setValue: setFood, append: false },
      description: { label: 'short description', setValue: setDescription, append: true },
      preparation: { label: 'how it is made', setValue: setPreparation, append: true },
    }[field];
    const recognition = new SpeechRecognition();

    recognition.lang = navigator.language || 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListeningField(field);
      setSpeechMessage(`Listening for ${fieldConfig.label}…`);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      fieldConfig.setValue((currentValue) => (
        fieldConfig.append && currentValue.trim()
          ? `${currentValue.trim()} ${transcript}`
          : transcript
      ));
      setSpeechMessage(`Added voice input to ${fieldConfig.label}.`);
    };

    recognition.onerror = (event) => {
      const message = event.error === 'not-allowed'
        ? 'Microphone access was denied. Allow microphone access and try again.'
        : event.error === 'no-speech'
          ? 'No speech was detected. Please try again.'
          : 'Voice input could not be completed. Please try again.';
      setSpeechMessage(message);
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setListeningField('');
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setListeningField('');
      setSpeechMessage('Voice input could not be started. Please try again.');
    }
  }

  async function recognizeFood(image) {
    setIsRecognizing(true);
    setSpeechMessage('Identifying the food in your photo…');

    try {
      const response = await fetch('/api/recognize-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Food recognition failed.');
      }

      setFood(data.food);
      setSpeechMessage(`Recognized “${data.food}.” You can correct the name before checking it.`);
    } catch (error) {
      setSpeechMessage(error.message || 'Food recognition failed. Enter the food name manually.');
    } finally {
      setIsRecognizing(false);
    }
  }

  function handleFoodImage(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setSpeechMessage('Please choose an image file.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setFoodImage({
        name: file.name,
        src: reader.result,
      });
      recognizeFood(reader.result);
    };
    reader.onerror = () => {
      setSpeechMessage('The food photo could not be loaded. Please try another image.');
    };
    reader.readAsDataURL(file);
  }

  function removeFoodImage() {
    setFoodImage(null);
    setIsRecognizing(false);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    setSpeechMessage('Food photo removed.');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-lime-100 px-4 py-10">
      <section className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h1 className="beveled-title" aria-label="Junk or No?">
          JUNK OR NO?
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
          Type a food item below and this simple app will tell you if it is commonly thought of as junk food or a healthier choice.
        </p>
        <TipCalculator />
      </section>

      <section className="mx-auto mt-10 max-w-2xl rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="food" className="block text-left text-sm font-bold uppercase tracking-wide text-slate-600">
              Food item
            </label>
            <div className="relative mt-2">
              <input
                id="food"
                type="text"
                value={food}
                onChange={(event) => setFood(event.target.value)}
                placeholder="Try pizza, apple, soda, or broccoli"
                className="min-h-12 w-full rounded-2xl border border-slate-300 py-3 pl-4 pr-16 text-lg outline-none motion-safe:transition focus-visible:border-orange-500 focus-visible:ring-4 focus-visible:ring-orange-100"
              />
              <VoiceInputButton field="food" label="food item" listeningField={listeningField} onStart={startVoiceInput} />
            </div>

            <div className="mt-3">
              <input
                id="food-image"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFoodImage}
                ref={imageInputRef}
                className="peer sr-only"
              />
              <label
                htmlFor="food-image"
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-900 outline-none motion-safe:transition hover:bg-orange-100 peer-focus-visible:ring-2 peer-focus-visible:ring-orange-500 peer-focus-visible:ring-offset-2"
              >
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M14.5 4 16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3l1.5-3h5Z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
                Take or choose a food photo
              </label>
            </div>

            {foodImage ? (
              <div className="mt-3 flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <img
                  src={foodImage.src}
                  alt="Selected food preview"
                  className="size-20 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-700">{foodImage.name}</p>
                  {isRecognizing ? (
                    <p className="mt-2 text-sm font-bold text-orange-800" role="status">
                      Identifying food automatically…
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={removeFoodImage}
                    className="mt-2 rounded-lg px-2 py-1.5 text-sm font-bold text-red-700 outline-none hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    Remove photo
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div>
            <label htmlFor="description" className="block text-left text-sm font-bold uppercase tracking-wide text-slate-600">
              Short description <span className="font-semibold normal-case tracking-normal text-slate-400">(optional)</span>
            </label>
            <div className="relative mt-2">
              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Example: sweet, salty, fresh, or packaged"
                rows={3}
                className="w-full rounded-2xl border border-slate-300 py-3 pl-4 pr-16 text-base outline-none motion-safe:transition focus-visible:border-orange-500 focus-visible:ring-4 focus-visible:ring-orange-100"
              />
              <VoiceInputButton field="description" label="short description" listeningField={listeningField} onStart={startVoiceInput} />
            </div>
          </div>

          <div>
            <label htmlFor="preparation" className="block text-left text-sm font-bold uppercase tracking-wide text-slate-600">
              How it is made <span className="font-semibold normal-case tracking-normal text-slate-400">(optional)</span>
            </label>
            <div className="relative mt-2">
              <textarea
                id="preparation"
                value={preparation}
                onChange={(event) => setPreparation(event.target.value)}
                placeholder="Example: deep fried, grilled, baked, or steamed"
                rows={3}
                className="w-full rounded-2xl border border-slate-300 py-3 pl-4 pr-16 text-base outline-none motion-safe:transition focus-visible:border-orange-500 focus-visible:ring-4 focus-visible:ring-orange-100"
              />
              <VoiceInputButton field="preparation" label="how it is made" listeningField={listeningField} onStart={startVoiceInput} />
            </div>
          </div>

          <p className="min-h-6 text-sm text-slate-600" role="status" aria-live="polite">
            {speechMessage}
          </p>

          <button
            type="submit"
            className="min-h-12 w-full rounded-2xl bg-slate-900 px-6 font-bold text-white outline-none motion-safe:transition hover:bg-orange-600 focus-visible:ring-4 focus-visible:ring-orange-300 sm:w-auto"
          >
            Check food
          </button>
        </form>

        {result ? (
          <div className={`mt-6 rounded-2xl border p-5 text-left ${result.styles}`}>
            <div className="flex items-start gap-4">
              <span className="text-4xl" aria-hidden="true">{result.emoji}</span>
              <div>
                <h2 className="text-2xl font-black">{result.title}</h2>
                <p className="mt-2 text-base leading-7">{result.message}</p>
                {(submittedDescription.trim() || submittedPreparation.trim()) ? (
                  <dl className="mt-4 space-y-2 text-sm leading-6">
                    {submittedDescription.trim() ? (
                      <div>
                        <dt className="font-bold">Description</dt>
                        <dd>{submittedDescription.trim()}</dd>
                      </div>
                    ) : null}
                    {submittedPreparation.trim() ? (
                      <div>
                        <dt className="font-bold">How it is made</dt>
                        <dd>{submittedPreparation.trim()}</dd>
                      </div>
                    ) : null}
                  </dl>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left text-slate-600">
            Enter a food and press <strong>Check food</strong> to see the answer.
          </div>
        )}

        <div className="mt-8 text-left">
          <h2 className="text-lg font-black text-slate-900">Quick examples</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Pizza', 'Apple', 'Soda', 'Broccoli'].map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => tryExample(example)}
                className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-900 outline-none motion-safe:transition hover:bg-orange-100 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <section className="mt-8 border-t border-slate-200 pt-8 text-left" aria-labelledby="checked-foods-heading">
          <h2 id="checked-foods-heading" className="text-lg font-black text-slate-900">
            Latest 10 food items
          </h2>
          {checkedFoods.length ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {checkedFoods.map((checkedFood, index) => (
              <div
                key={`${checkedFood.food}-${index}`}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${checkedFood.styles}`}
              >
                <span className="text-2xl" aria-hidden="true">{checkedFood.emoji}</span>
                <div className="min-w-0">
                  <p className="truncate font-bold capitalize">{checkedFood.food}</p>
                  <p>{checkedFood.title}</p>
                </div>
              </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              Checked foods will appear here.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}

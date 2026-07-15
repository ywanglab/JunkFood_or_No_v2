'use client';

import { useMemo, useState } from 'react';

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

const foodPairs = junkFoods.map((junkFood, index) => ({
  junkFood,
  healthyFood: healthyFoods[index],
}));

function cleanFoodName(food) {
  return food.trim().toLowerCase();
}

function getFoodResult(food, description = '', preparation = '') {
  const cleanedFood = cleanFoodName(food);
  const details = `${description} ${preparation}`.toLowerCase();
  const hasJunkPreparation = ['fried', 'deep fried', 'sugary', 'candy-coated', 'covered in sugar'].some((term) => details.includes(term));
  const hasHealthyPreparation = ['baked', 'grilled', 'steamed', 'roasted', 'fresh'].some((term) => details.includes(term));

  if (!cleanedFood) {
    return null;
  }

  if (junkFoods.includes(cleanedFood) || hasJunkPreparation) {
    return {
      title: 'Junk food',
      emoji: '🍟',
      message: `${food.trim()} is usually considered junk food. Enjoy it sometimes, but not every day!`,
      styles: 'border-red-200 bg-red-50 text-red-800',
    };
  }

  if (healthyFoods.includes(cleanedFood) || hasHealthyPreparation) {
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

export default function Home() {
  const [food, setFood] = useState('');
  const [description, setDescription] = useState('');
  const [preparation, setPreparation] = useState('');
  const [submittedFood, setSubmittedFood] = useState('');
  const [submittedDescription, setSubmittedDescription] = useState('');
  const [submittedPreparation, setSubmittedPreparation] = useState('');
  const result = useMemo(
    () => getFoodResult(submittedFood, submittedDescription, submittedPreparation),
    [submittedFood, submittedDescription, submittedPreparation],
  );

  function handleSubmit(event) {
    event.preventDefault();
    setSubmittedFood(food);
    setSubmittedDescription(description);
    setSubmittedPreparation(preparation);
  }

  function tryExample(example) {
    setFood(example);
    setSubmittedFood(example);
    setDescription('');
    setPreparation('');
    setSubmittedDescription('');
    setSubmittedPreparation('');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-lime-100 px-4 py-10">
      <section className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="mb-3 rounded-full bg-orange-200 px-4 py-2 text-sm font-semibold text-orange-900">
          Beginner-friendly food checker
        </p>
        <h1 className="beveled-title" aria-label="Junk or No?">
          JUNK OR NO?
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
          Type a food item below and this simple app will tell you if it is commonly thought of as junk food or a healthier choice.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-2xl rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="food" className="block text-left text-sm font-bold uppercase tracking-wide text-slate-600">
              Food item
            </label>
            <input
              id="food"
              type="text"
              value={food}
              onChange={(event) => setFood(event.target.value)}
              placeholder="Try pizza, apple, soda, or broccoli"
              className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 px-4 text-lg outline-none motion-safe:transition focus-visible:border-orange-500 focus-visible:ring-4 focus-visible:ring-orange-100"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-left text-sm font-bold uppercase tracking-wide text-slate-600">
              Short description <span className="font-semibold normal-case tracking-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Example: sweet, salty, fresh, or packaged"
              rows={3}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none motion-safe:transition focus-visible:border-orange-500 focus-visible:ring-4 focus-visible:ring-orange-100"
            />
          </div>

          <div>
            <label htmlFor="preparation" className="block text-left text-sm font-bold uppercase tracking-wide text-slate-600">
              How it is made <span className="font-semibold normal-case tracking-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="preparation"
              value={preparation}
              onChange={(event) => setPreparation(event.target.value)}
              placeholder="Example: deep fried, grilled, baked, or steamed"
              rows={3}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none motion-safe:transition focus-visible:border-orange-500 focus-visible:ring-4 focus-visible:ring-orange-100"
            />
          </div>

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

        <section className="mt-8 border-t border-slate-200 pt-8 text-left" aria-labelledby="food-pairs-heading">
          <h2 id="food-pairs-heading" className="text-lg font-black text-slate-900">
            Previously added food pairs
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {foodPairs.map(({ junkFood, healthyFood }) => (
              <div
                key={`${junkFood}-${healthyFood}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              >
                <span className="font-semibold capitalize text-red-700">{junkFood}</span>
                <span className="text-slate-400" aria-hidden="true">→</span>
                <span className="text-right font-semibold capitalize text-green-700">{healthyFood}</span>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

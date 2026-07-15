# Repository Guidelines

## Project Structure & Module Organization

This repository is a small Next.js application using the App Router. Application code lives in `app/`: `page.js` contains the interactive food checker, `layout.js` defines shared page metadata and layout, and `globals.css` contains Tailwind directives and global styles. Root-level files configure Next.js, PostCSS, and Tailwind. Generated content in `.next/` and installed dependencies in `node_modules/` must not be edited or committed. There is currently no dedicated `public/` asset directory or test suite; add those directories when needed.

## Build, Test, and Development Commands

- `npm install` installs dependencies from `package-lock.json`.
- `npm run dev` starts the local development server, normally at `http://localhost:3000`.
- `npm run build` creates an optimized production build and catches compilation errors.
- `npm start` serves the completed production build.
- `npm run lint` runs the configured Next.js lint command.

Run `npm run build` before opening a pull request. Do not commit generated `.next/` output.

## Coding Style & Naming Conventions

Use JavaScript and React functional components. Follow the existing style: two-space indentation, single quotes, semicolons, and trailing commas in multiline calls or collections. Name components with PascalCase (`FoodResult`), functions and variables with camelCase (`cleanFoodName`), and constants descriptively. Keep UI behavior in `app/page.js` or extract reusable components into clearly named files under `app/`. Prefer Tailwind utility classes for component styling and reserve `globals.css` for truly global rules.

## Testing Guidelines

No automated testing framework or coverage requirement is currently configured. For every change, manually verify empty input, known junk and healthy foods, unknown foods, optional descriptions, preparation-based classification, and quick-example buttons. If adding tests, use `*.test.js` filenames and place them beside the module or in a top-level `tests/` directory. Add the corresponding `npm test` script to `package.json`.

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries such as `Add optional food details to checker` and `Refactor code structure for improved readability and maintainability`. Keep each commit focused and use the same style. Pull requests should explain the user-visible change, list verification performed, and link related issues. Include before-and-after screenshots for visual changes and call out any new dependencies or configuration changes.

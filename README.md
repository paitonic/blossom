<div align="center">

<img src="public/blossom-128x128.png" alt="Blossom Extension Logo" width="100" height="100">

# Blossom

**A Chromium-based browser extension for self-reflection to help software engineers track their growth by rating their pull requests.**

[Link to Chrome Web Store] • [Website]

</div>

---

## Why
I started to build it because I wanted to see what kind of work I spent my time on, how many tasks are challenging, how impactful they are, and how I feel about them.

## How
Injects a button directly into the GitHub Pull Request page. Clicking it opens a form to rate the PR based on specific metrics:
* **Tags:** Categorize work by skills learned, code areas touched, etc.
* **Challenge:** Technical difficulty.
* **Size:** Distinguish between minor config changes and large-scale changes.
* **Impact:** Measure the impact (e.g., unnoticed maintenance vs. deal-closing features).
* **Reaction:** Record your sentiment (positive, neutral, negative). Did you enjoy it? Did you learn something?
* **Notes:** Free-text field for context or reminders.

### Dashboard
Clicking the extension icon in the browser toolbar opens a dedicated dashboard in a new tab.

## Permissions
- contentSettings ???
- storage
- downloads -- TODO: should be optional

## Technology Stack
* **Core:** Svelte 5
* **Build Tooling:** Vite, CRXJS
* **Target:** Chromium-based browsers (Chrome, Edge, Brave, etc.)

## Project structure
```text
├── manifest.config.ts    # Extension manifest configuration
├── src/
│   ├── background/       # Service worker (responsible for opening the dashboard)
│   ├── content/          # Content scripts (GitHub DOM injection)
│   │   └── views/        # Popover, button and injection logic
│   ├── dashboard/        # Dashboard
│   └── shared/           # Shared utilities (Storage module, Icons)
```

## Development Guide
### Setup
1. Install dependencies
```bash
npm install
```

2. Start the development server (HMR enabled):
```bash
npm run dev
```

3. Load the extension in your browser:
- Open chrome://extensions.
- Enable Developer mode (toggle in the top right).
- Click Load unpacked.
- Select the dist folder created by the build process.
- Run development server


### Build
```bash
npm run build
```
This will generate the final assets in the dist folder and also a zipped build in `release/` directory.

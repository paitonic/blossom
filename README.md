# About
Extension for self reflection on your work as software engineer thru rating your pull requests.
In addition to this, it is an opportunity to fix some annoyences with GitHub, make the experience a little bit better.

It is built for Chromium based browsers (Chrome, Edge etc.) with Svelte 5, Vite and CRXJS.

# Why
I started to build it because I wanted to see if I can get overall sense of which type of tasks I work on, where the time went into and, look at some pretty metrics.

# How
This extension injects a button into GitHub's Pull Requests page that opens a form to let you fill details such as: 
- tags - tag your PR with the skills you have learned, areas of code you worked on, or find any other use of tags
- challenge - how challenging it was?
- size - simple configuration change is a small change, search and replace across entire codebase is large
- impact - business impact, while some changes go unnoticed others can help close deals 
- reaction - overall experience (neutral, positive or negative), would you want more of this work? Did you enjoy? Have you learned something?
- notes - general notes you would want to keep

Clicking on the extension icon in the browser toolbar will open a dashboard in a new tab where you can see all your rated PRs, metrics and settings.

# Permissions
- contentSettings ???
- storage
- downloads -- TODO: should be optional

# Project structure
- manifest.config.ts - extension configuration
- src/
  - background/index.ts - responsible for opening the dashboard when the extension icon is clicked in the browser toolbar
  - dashboard/ - the dashboard
  - content/views/ - extension injection logic (aka content script), includes popover code with the form itself and the button that is reponsible for opening the popover
  - shared/ - shared code like icons, storage module


# Commands

Install dependencies
```bash
npm install
```

Run development server
```bash
npm run dev
```

Build
```bash
npm run build
```

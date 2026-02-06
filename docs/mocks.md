# Mocks

Mocks provide minimal HTML page for local development and documentation purposes that resemble pages on GitHub:
- Pull Requests - docs/pull-requests-list.html
- View Pull Request - docs/pull-request-detail.html

If extension breaks because GitHub page structure have changed, this might help to understand which assumptions are no longer true (e.g: extension expects element with class name "xyz" to be on page).

I was lazy to document the structure manually myself so I let Gemini CLI do it with a 2-3 prompts until it worked:
> Analyze code in src/content, figure out which DOM elements, IDs, classes and attributes the extension depends on to be present on page and provide a two minimal HTML mock files (one for "Pull Requests List" and one for "Pull Request Detail") that can be used to test the extension

To make the browser run the exension on mock HTMLs, we have to add `file:///` to the manifest `matches` section:

```
content_scripts: [
  {
    ...
    matches: [..., "file:///*"],
  },
],
```
This is removed from build (after `npm run build`).

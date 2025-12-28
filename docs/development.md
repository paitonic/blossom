# Development

General notes on development.

#### Mocks
Mocks provide minimal HTML page for local development and documentation purposes that resemble real pages on GitHub. If extension breaks because GitHub page structure have changed, this might help to understand which assumptions are no longer true (e.g: extension expects element with class name "xyz" to be on page).

I was lazy to document the structure manually myself so I let gemini-cli do it with a 2-3 prompts until it worked:
> Analyze code in src/content, figure out which DOM elements, IDs, classes and attributes the extension depends on to be present on page and provide a minimal mock .HTML
  file that can be used to test the extension

Note: to run the exension on mock HTMLs (as if they are a website), we have to add `file:///` to the manifest `matches` section:

```
content_scripts: [
  {
    ...
    matches: [..., "file:///*"],
  },
],
```
This is removed from production build.

#### SingleFile
[SingleFile](https://github.com/gildas-lormeau/SingleFile) extension can be used to save entire page in a single HTML file (all assets included).

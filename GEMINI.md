This is the project's README.md file
@./README.md

## Svelte
- Use Svelte 5 runes when you need to work with state

## CSS
- Follow the projects overall style when generating CSS styles for components
- Use plain modern CSS over libraries

## Data format
- Breaking changes to the data format should increase the major version and non-breaking changes should increase the minor version.
  - breaking changes are: 
    - removing field
    - renaming field
    - changing field type
    - renaming the values (options) field accepts
    - deleting the values (options) field accepts 
    - other changes that you consider as breaking that I missed here
- Update docs/data-format.md, PRIVACY.md, README.md and generate-data.js (VERSION variable) if data format was changed.
- Update Dashboard's Export / Import functionality (Settings tab)

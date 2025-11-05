# Assets Folder

This folder contains reusable assets for the prototype.

## Icons

### SVG Icons
- `icons/history.svg` - History/clock icon from Figma

### Icon Component
Use the `icon.njk` component to display icons:

```njk
{% include "components/icon.njk", name: "history", size: "20" %}
```

### Available Icons
- `history` - Clock/history icon
- `radar` - Radar/auto-detect icon  
- `camera` - Camera/capture icon
- `search` - Search/magnifying glass icon
- `mic` - Microphone icon

### Icon Styling
Icons use `currentColor` for fill, so they inherit the text color of their parent element. Use CSS color properties to control icon colors:

```css
.icon {
  color: var(--color-action-primary); /* Red for WoW theme */
}
```

## Adding New Icons

1. Download SVG from Figma
2. Save to `src/assets/icons/`
3. Add icon definition to `src/_includes/components/icon.njk`
4. Use the icon component in templates

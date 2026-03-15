# King Property Auction - Color Theme System

## Overview

The King Property Auction platform now includes a dynamic color theme system that allows users to customize the appearance of the website with 6 beautiful color schemes.

## Available Themes

1. **Ocean Blue** (Default) - Blue → Indigo → Purple
2. **Emerald Green** - Emerald → Teal → Cyan
3. **Royal Purple** - Purple → Violet → Fuchsia
4. **Rose Red** - Rose → Pink → Red
5. **Golden Amber** - Amber → Orange → Yellow
6. **Cyan Sky** - Cyan → Sky → Blue

## How to Use

### For Users

1. Click the floating **Palette icon** in the bottom-left corner of any page
2. Select your preferred color theme from the panel
3. The theme will be applied instantly across all pages
4. Your selection is saved in localStorage and persists across sessions

### For Developers

#### Using the Theme Hook

Import and use the `useTheme` hook in any component:

```tsx
import { useTheme } from "../hooks/useTheme";

export default function MyComponent() {
  const theme = useTheme();

  return (
    <div className={`bg-gradient-to-r ${theme.primary}`}>
      <h1>This gradient changes with the theme!</h1>
    </div>
  );
}
```

#### Theme Properties

Each theme object contains:

- `id`: Unique identifier (e.g., "blue", "emerald")
- `name`: Display name (e.g., "Ocean Blue")
- `primary`: Main gradient classes (from-X via-Y to-Z)
- `secondary`: Secondary gradient (from-X to-Y)
- `gradient`: Full gradient with bg-gradient-to-r prefix
- `lightGradient`: Light background gradient
- `hover`: Hover state gradient classes
- `border`: Border color class

#### Example Usage in Components

```tsx
import { useTheme } from "../hooks/useTheme";

export default function Hero() {
  const theme = useTheme();

  return (
    <div className={`${theme.lightGradient} min-h-screen`}>
      <div className={`bg-gradient-to-r ${theme.primary} p-8 text-white`}>
        <h1>Welcome to King Property Auction</h1>
        <button className={`px-6 py-3 bg-gradient-to-r ${theme.secondary} rounded-xl ${theme.hover}`}>
          Get Started
        </button>
      </div>
    </div>
  );
}
```

## Components

### ColorThemeSelector

Location: `/src/app/components/ColorThemeSelector.tsx`

Features:
- Floating palette button (bottom-left corner)
- Beautiful theme selection panel
- Visual preview of each color scheme
- Active theme indicator
- Smooth animations
- LocalStorage persistence

### useTheme Hook

Location: `/src/app/hooks/useTheme.ts`

Features:
- Returns current active theme
- Automatically updates when theme changes
- Listens to custom "themeChange" events
- Provides access to all theme properties

## Integration

The ColorThemeSelector is integrated globally in `App.tsx`:

```tsx
import ColorThemeSelector from './components/ColorThemeSelector';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ColorThemeSelector />
    </>
  );
}
```

## Customization

To add new themes, edit `/src/app/hooks/useTheme.ts` and add to the themes array:

```tsx
{
  id: "custom",
  name: "Custom Theme",
  primary: "from-color1-600 via-color2-600 to-color3-600",
  secondary: "from-color1-500 to-color2-600",
  gradient: "bg-gradient-to-r from-color1-600 via-color2-600 to-color3-600",
  lightGradient: "bg-gradient-to-br from-color1-50 via-color2-50/30 to-color3-50/30",
  hover: "hover:from-color1-700 hover:via-color2-700 hover:to-color3-700",
  border: "border-color1-500",
}
```

## Best Practices

1. **Use theme classes for major UI elements**: Headers, hero sections, buttons, cards
2. **Keep neutral colors for text**: Use slate-900 for text, slate-600 for secondary text
3. **Apply themes to gradients**: Use `theme.primary`, `theme.secondary`, etc.
4. **Test all themes**: Ensure your component looks good with all 6 color schemes
5. **Use semantic naming**: Theme-based components should adapt, not hardcode colors

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires localStorage support
- Requires CSS custom properties support

## Performance

- Theme changes are instant (no page reload)
- LocalStorage caching prevents unnecessary re-renders
- Event-based system for efficient updates
- Minimal bundle size impact (~5KB)

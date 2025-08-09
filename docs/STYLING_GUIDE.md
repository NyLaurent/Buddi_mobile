# Global Styling Guide

## Overview

This app uses a comprehensive global styling system to ensure text visibility across all devices and platforms. This prevents invisible text issues that can occur on different Android devices with various system themes.

## How It Works

### 1. Automatic Global Defaults

All `Text` and `TextInput` components automatically receive default colors through global configuration in `app/_layout.tsx`:

- **Text Color**: `#23272F` (dark gray for visibility)
- **Placeholder Color**: `#8B8B8B` (medium gray for placeholders)

### 2. Global CSS Styles

The `global.css` file provides additional fallback styling for web compatibility.

### 3. Color Constants

Use the centralized color system from `constants/Colors.ts`:

```typescript
import { GlobalColors } from "../constants/Colors";

// Available colors:
GlobalColors.defaultText; // #23272F - Default text color
GlobalColors.placeholder; // #8B8B8B - Placeholder color
GlobalColors.primary; // #FF932E - App primary color
GlobalColors.error; // #EF4444 - Error color
GlobalColors.success; // #22C55E - Success color
// ... and more
```

## Usage Examples

### Option 1: Automatic (Recommended)

Just use regular `Text` and `TextInput` components - they automatically get safe colors:

```tsx
// This will automatically have the default text color
<Text>This text is always visible</Text>

// This will automatically have safe input and placeholder colors
<TextInput
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
/>
```

### Option 2: Global Styles

Import and use pre-defined global styles:

```tsx
import { globalStyles } from '../utils/globalStyles';

<Text style={globalStyles.heading1}>Main Title</Text>
<Text style={globalStyles.bodyText}>Body text</Text>
<Text style={globalStyles.errorText}>Error message</Text>
<TextInput style={globalStyles.safeTextInput} />
```

### Option 3: Safe Components

Use the guaranteed safe components:

```tsx
import { SafeText, SafeTextInput } from '../components/SafeText';

<SafeText>This text is guaranteed to be visible</SafeText>
<SafeTextInput placeholder="Safe input" />
```

### Option 4: Utility Functions

Use helper functions for dynamic styling:

```tsx
import { getTextStyle, getInputStyle } from "../utils/globalStyles";

<Text style={getTextStyle(18, undefined, "bold")}>
  Custom styled text with safe color
</Text>;
```

### Option 5: Tailwind Classes

Use Tailwind classes with the defined colors:

```tsx
<Text className="text-defaultText text-lg font-bold">Tailwind styled text</Text>
```

## Best Practices

1. **Don't override without fallbacks**: If you need custom colors, always provide a fallback:

   ```tsx
   // Good
   <Text style={{ color: customColor || GlobalColors.defaultText }}>

   // Avoid
   <Text style={{ color: customColor }}>
   ```

2. **Use semantic color names**: Instead of hardcoded colors, use semantic names:

   ```tsx
   // Good
   <Text style={{ color: GlobalColors.error }}>

   // Avoid
   <Text style={{ color: '#FF0000' }}>
   ```

3. **Test on multiple devices**: Always test on different Android devices to ensure visibility.

4. **Placeholder colors**: Always specify placeholder colors for TextInput:
   ```tsx
   <TextInput
     placeholderTextColor={GlobalColors.placeholder}
     placeholder="Enter text"
   />
   ```

## Troubleshooting

### Text Still Invisible?

1. Check if you're overriding the color with a transparent or white value
2. Ensure your custom styles don't conflict with global defaults
3. Use the Safe components as a fallback

### Placeholder Not Visible?

1. Use `placeholderTextColor={GlobalColors.placeholder}` explicitly
2. Or use the `SafeTextInput` component

### Custom Themes?

The global system automatically handles both light and dark themes while maintaining visibility.

## Migration Guide

If you have existing components with styling issues:

1. **Quick fix**: Remove any `color` styles that might be causing invisibility
2. **Better fix**: Use the global styles or Safe components
3. **Best fix**: Adopt the color constants system throughout your app

```tsx
// Before (might be invisible)
<Text style={{ fontSize: 16 }}>Text</Text>

// After (always visible)
<Text style={[globalStyles.bodyText, { fontSize: 16 }]}>Text</Text>
```

# BusinessOne Color Theme Guide

This document outlines the vibrant and engaging color system used throughout the BusinessOne application. The theme is designed to be both professional and visually appealing, with clear visual hierarchy and excellent readability across both light and dark modes.

## Core Brand Colors & Gradients

This theme heavily utilizes gradients for key UI elements to create a vibrant and modern look.

| Element         | Light Mode Gradient / Color                                     | Dark Mode Gradient / Color                                       | CSS Variables (Conceptual) | Usage                                                                 |
|-----------------|-----------------------------------------------------------------|------------------------------------------------------------------|----------------------------|-----------------------------------------------------------------------|
| **Primary Gradient** | `linear-gradient(to right, hsl(270, 80%, 60%), hsl(220, 90%, 65%))` (Purple to Blue) | `linear-gradient(to right, hsl(270, 80%, 65%), hsl(220, 90%, 70%))` | `--gradient-primary`       | Primary buttons ("Get Started"), active indicators, hero sections       |
| **Heading Gradient** | `linear-gradient(to right, hsl(300, 90%, 70%), hsl(200, 90%, 70%))` (Pink to Light Blue) | `linear-gradient(to right, hsl(300, 90%, 75%), hsl(200, 90%, 75%))` | `--gradient-heading`     | Main page titles ("Make Smarter Business Decisions")                  |
| **Service Title Blue**| `hsl(210, 100%, 50%)` (Bright Blue)                             | `hsl(210, 100%, 60%)` (Brighter Blue)                            | `--service-title-blue`     | Section titles like "Our Services"                                    |
| **App Name Color**  | `hsl(224, 30%, 20%)` (Dark Gray/Black)                          | `hsl(0, 0%, 95%)` (Light Gray)                                   | `--app-name-color`       | "BusinessOne" in the header                                           |

### Service Card Gradients

| Service Card        | Light Mode Gradient                                                    | Dark Mode Gradient                                                      | CSS Variables (Conceptual) |
|---------------------|------------------------------------------------------------------------|-------------------------------------------------------------------------|----------------------------|
| **Blue Gradient**   | `linear-gradient(to bottom right, hsl(205, 90%, 60%), hsl(225, 95%, 75%))` | `linear-gradient(to bottom right, hsl(205, 90%, 65%), hsl(225, 95%, 80%))` | `--gradient-card-blue`     |
| **Orange Gradient** | `linear-gradient(to bottom right, hsl(30, 100%, 60%), hsl(50, 100%, 70%))` | `linear-gradient(to bottom right, hsl(30, 100%, 65%), hsl(50, 100%, 75%))` | `--gradient-card-orange`   |
| **Pink/Purple Gradient**| `linear-gradient(to bottom right, hsl(300, 90%, 70%), hsl(270, 85%, 75%))` | `linear-gradient(to bottom right, hsl(300, 90%, 75%), hsl(270, 85%, 80%))` | `--gradient-card-pink`     |
| **Green Gradient**  | `linear-gradient(to bottom right, hsl(140, 70%, 55%), hsl(160, 75%, 65%))` | `linear-gradient(to bottom right, hsl(140, 70%, 60%), hsl(160, 75%, 70%))` | `--gradient-card-green`    |

## Table of Contents
- [Color System Overview](#color-system-overview)
- [Color Palette](#color-palette)
- [Component Colors](#component-colors)
- [Dark Mode](#dark-mode)
- [Usage Guidelines](#usage-guidelines)

## Color System Overview

The application uses a simple, clean color system with a primary accent color and semantic colors for UI elements. Colors are defined as CSS variables in `index.css` and automatically adjust based on the user's system preference or theme selection.

## UI Components

### App Header
- **Background**: `bg-background/95` with backdrop blur
- **Border**: `border-b border-border/50`
- **App Name ("BusinessOne")**: `text-[var(--app-name-color)] font-bold text-xl` (e.g., `text-gray-800 dark:text-gray-100`)
- **Navigation Links**: `text-gray-700 dark:text-gray-300 hover:text-[var(--service-title-blue)] dark:hover:text-[var(--service-title-blue)]` (Using the bright blue for hover)
- **Header Background**: `bg-white dark:bg-gray-900 shadow-sm` (A more solid background for the header as seen in screenshot)

### Page Headers
- **Title**: `text-3xl font-bold bg-gradient-to-r from-[var(--gradient-heading-start)] to-[var(--gradient-heading-end)] bg-clip-text text-transparent`
- **Subtitle**: `text-muted-foreground`

### Service Cards (Homepage Style)
- **Background**: Apply respective gradient: `bg-[var(--gradient-card-blue)]`, `bg-[var(--gradient-card-orange)]`, etc.
- **Text Color**: `text-white` (or a very light color for contrast on gradients)
- **Border**: `rounded-xl` (or similar for rounded corners as in screenshot)
- **Shadow**: `shadow-lg`
- **Hover State**: `transform hover:scale-105 transition-transform duration-300`

### Content Cards (e.g., DocsPage Sections)
- **Design Goal**: To align with the vibrant, gradient-rich "Service Cards" found on the homepage, enhancing visual appeal and consistency.
- **Background**: Utilize the "Service Card Gradients" defined above. Sections on the DocsPage will cycle through these gradients (e.g., Blue, Orange, Pink, Green).
  - Example: `className="bg-[var(--gradient-card-blue)]"`
- **Text Color (Titles, Descriptions, List Items within card)**: `text-white` or `text-gray-100` to ensure high contrast and readability against the vibrant gradient backgrounds.
- **Border**: `rounded-xl` (Consistent with Service Cards)
- **Shadow**: `shadow-lg` (Consistent with Service Cards)
- **Hover State**: `transform hover:scale-105 transition-transform duration-300` (Consistent with Service Cards)
- **Section Icon (e.g., BookOpen next to "Calculator Guides" title)**:
  - **Icon Color**: `text-white`.
  - **Icon Background**: `bg-white/20` (a semi-transparent white circle) or `bg-black/10` (a semi-transparent dark circle for contrast, depending on the gradient) `p-2 rounded-full`. The goal is to make the icon stand out clearly but harmoniously.
- **List Item Links (within card)**:
  - **Text Color**: `text-white hover:text-gray-200` or `text-gray-100 hover:text-gray-300`.
  - **Underline**: Consider `hover:underline` for better affordance.

### Buttons
- **Primary Gradient Button ("Get Started")**: `bg-[var(--gradient-primary)] text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:opacity-90 transition-opacity`
- **Secondary Button ("Learn More")**: `bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-6 rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors`
- **Standard Primary (Solid)**: `bg-[var(--service-title-blue)] text-white ...` (If a solid primary is needed elsewhere)
- **Standard Outline**: `border border-[var(--service-title-blue)] text-[var(--service-title-blue)] hover:bg-[var(--service-title-blue)]/10 ...`

## CSS Variables Definition (Conceptual - in `index.css`)

**Note:** For gradients, Tailwind CSS doesn't directly support `background: linear-gradient(...)` via `bg-*` utilities with dynamic HSL values from CSS variables in the same way solid colors are handled. You would typically define these gradients as utility classes or apply them via inline styles / `style` attributes if the gradient values are dynamic from CSS vars. For simplicity in `tailwind.config.js`, you might define static gradient classes or use plugins.

The HSL values below are for the *solid* colors mentioned. Gradients would be constructed using these or similar HSL values.

```css
:root {
  /* Solid Colors from Screenshot Palette */
  --app-name-color: 224 30% 20%; /* Dark Gray for App Name */
  --service-title-blue: 210 100% 50%; /* Bright Blue for 'Our Services' */
  
  /* Base UI Colors (can be adjusted) */
  --background: 0 0% 100%; /* White for page background */
  --foreground: 224 30% 20%; /* Default text */
  --card: 0 0% 100%; /* Card background */
  --border: 214 32% 91%; /* Default border */
  --input: 214 32% 91%;
  --ring: 210 100% 50%; /* Using service blue for focus rings */

  /* Primary/Secondary for Gradients (example start/end points) */
  --gradient-primary-start: 270 80% 60%; /* Purple */
  --gradient-primary-end: 220 90% 65%;   /* Blue */
  --gradient-heading-start: 300 90% 70%; /* Pink */
  --gradient-heading-end: 200 90% 70%;   /* Light Blue */
  
  /* Other semantic colors can remain or be adjusted */
  --destructive: 0 84% 60%;
  --success: 142 76% 36%;
}

.dark {
  --app-name-color: 0 0% 95%;
  --service-title-blue: 210 100% 60%;
  
  --background: 220 15% 15%; /* Darker page background */
  --foreground: 0 0% 95%;
  --card: 220 15% 20%; /* Darker card background */
  --border: 215 20% 35%;
  --input: 215 20% 35%;
  --ring: 210 100% 60%;

  --gradient-primary-start: 270 80% 65%;
  --gradient-primary-end: 220 90% 70%;
  --gradient-heading-start: 300 90% 75%;
  --gradient-heading-end: 200 90% 75%;
  
  --destructive: 0 84% 70%;
  --success: 142 76% 45%;
}
```

```css
:root {
  --background: 0 0% 98%;
  --foreground: 224 30% 20%;
  --card: 0 0% 100%;
  --card-foreground: 224 30% 20%;
  --popover: 0 0% 100%;
  --popover-foreground: 224 30% 20%;
  --primary: 221 83% 53%;
  --primary-foreground: 0 0% 100%;
  --secondary: 262 83% 58%;
  --secondary-foreground: 0 0% 100%;
  --muted: 220 10% 85%; /* Adjusted for better contrast from muted-foreground */
  --muted-foreground: 220 10% 46%;
  --accent: 27 96% 61%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 221 83% 53%;
  --radius: 0.5rem;
}

.dark {
  --background: 224 30% 8%;
  --foreground: 0 0% 95%;
  --card: 224 30% 12%;
  --card-foreground: 0 0% 95%;
  --popover: 224 30% 12%;
  --popover-foreground: 0 0% 95%;
  --primary: 217 91% 60%;
  --primary-foreground: 0 0% 100%;
  --secondary: 262 89% 65%;
  --secondary-foreground: 0 0% 100%;
  --muted: 220 10% 25%; /* Adjusted for better contrast from muted-foreground */
  --muted-foreground: 220 10% 75%;
  --accent: 27 96% 70%;
  --accent-foreground: 224 30% 15%; /* Dark text on light accent for dark mode */
  --destructive: 0 84% 70%;
  --destructive-foreground: 0 0% 100%;
  --success: 142 76% 45%;
  --warning: 38 92% 60%;
  --info: 199 89% 58%;
  --border: 215 25% 22%;
  --input: 215 25% 22%;
  --ring: 217 91% 60%;
}
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        <BookOpen className="h-5 w-5" />
      </div>
      <CardTitle className="text-foreground">Section Title</CardTitle>
    </div>
    <CardDescription>Section description</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-1.5">
      <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent/30 transition-colors">
        Document Item
      </button>
    </div>
  </CardContent>
</Card>
```

### Navigation Links
```tsx
<nav className="flex items-center space-x-6">
  <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
    Home
  </a>
  <a href="#" className="text-sm font-medium text-foreground relative">
    Documentation
    <span className="absolute -bottom-6 left-0 right-0 h-0.5 bg-primary" />
  </a>
</nav>
```

## Best Practices

1. **Consistency**: Always use the defined CSS variables and utility classes for colors
2. **Accessibility**: 
   - Ensure text contrast ratio of at least 4.5:1 for normal text
   - Use semantic colors for different states (success, warning, error)
3. **Visual Hierarchy**: 
   - Use primary color for the most important actions
   - Use muted colors for secondary information
   - Add hover/focus states for interactive elements
4. **Dark Mode**: 
   - Test all components in both light and dark modes
   - Adjust colors for better contrast in dark mode
5. **Performance**: 
   - Use CSS variables for theming
   - Minimize the number of different colors used
   - Use opacity modifiers for hover states instead of separate colors

---

*Last Updated: June 2, 2025*

### Secondary Colors

| Variable | Light Mode | Dark Mode | Description |
|----------|------------|-----------|-------------|
| `--secondary` | `0 0% 96.1%` (very light gray) | `0 0% 14.9%` (dark gray) | Secondary brand color |
| `--secondary-foreground` | `0 0% 9%` (very dark gray) | `0 0% 98%` (off-white) | Text on secondary color |

### Muted Colors

| Variable | Light Mode | Dark Mode | Description |
|----------|------------|-----------|-------------|
| `--muted` | `0 0% 96.1%` (very light gray) | `0 0% 14.9%` (dark gray) | Muted backgrounds |
| `--muted-foreground` | `0 0% 45.1%` (gray) | `0 0% 63.9%` (light gray) | Muted text |

### Accent Colors

| Variable | Light Mode | Dark Mode | Description |
|----------|------------|-----------|-------------|
| `--accent` | `0 0% 96.1%` (very light gray) | `0 0% 14.9%` (dark gray) | Accent backgrounds |
| `--accent-foreground` | `0 0% 9%` (very dark gray) | `0 0% 98%` (off-white) | Text on accent |

### Semantic Colors

| Variable | Light Mode | Dark Mode | Description |
|----------|------------|-----------|-------------|
| `--destructive` | `0 84.2% 60.2%` (red) | `0 62.8% 30.6%` (dark red) | Destructive actions |
| `--destructive-foreground` | `0 0% 98%` (off-white) | `0 0% 98%` (off-white) | Text on destructive |

## Chart Colors

The application uses a set of 5 distinct colors for charts and data visualization:

| Variable | Light Mode | Dark Mode | Description |
|----------|------------|-----------|-------------|
| `--chart-1` | `12 76% 61%` (coral) | `220 70% 50%` (blue) | Primary chart color |
| `--chart-2` | `173 58% 39%` (teal) | `160 60% 45%` (green) | Secondary chart color |
| `--chart-3` | `197 37% 24%` (dark blue) | `30 80% 55%` (orange) | Tertiary chart color |
| `--chart-4` | `43 74% 66%` (yellow) | `280 65% 60%` (purple) | Quaternary chart color |
| `--chart-5` | `27 87% 67%` (orange) | `340 75% 55%` (pink) | Quinary chart color |

## Component-Specific Colors

### Cards
```css
.card {
  @apply rounded-2xl shadow-md bg-card text-card-foreground;
}
```

### Form Elements
- **Labels**: Use `text-foreground` for primary labels
- **Inputs**: Use `bg-background` with `border` for borders
- **Disabled States**: Use `text-muted-foreground` with `opacity-70`

### Buttons
- **Primary**: `bg-primary text-primary-foreground`
- **Secondary**: `bg-secondary text-secondary-foreground`
- **Outline**: `border border-input bg-transparent hover:bg-accent hover:text-accent-foreground`

### Alerts & Feedback
- **Success**: Use `--chart-2` (teal/green)
- **Warning**: Use `--chart-5` (orange/pink)
- **Error**: Use `--destructive` (red)
- **Info**: Use `--chart-1` (coral/blue)

## Dark Mode

The application supports both light and dark modes. The color variables automatically adjust based on the user's system preference or manual selection. The dark theme is defined within the `.dark` class in the CSS.

## Usage Guidelines

1. **Consistency**: Always use the defined color variables rather than hardcoded values
2. **Accessibility**: Ensure sufficient contrast between text and background colors
3. **Theming**: Test components in both light and dark modes
4. **Customization**: To add new colors, extend the theme in `tailwind.config.js`
5. **Overrides**: Use utility classes for one-off color needs (e.g., `bg-blue-500`)

## Tailwind Integration

The color system is fully integrated with Tailwind CSS. You can use utility classes like:
- `bg-primary`, `text-primary-foreground`
- `bg-destructive`, `text-destructive-foreground`
- `bg-muted`, `text-muted-foreground`
- `border-border` for borders
- `bg-chart-1` through `bg-chart-5` for chart colors

## Adding New Colors

To add a new color to the system:

1. Add the new CSS variable to both `:root` and `.dark` in `index.css`
2. Extend the theme in `tailwind.config.js` if needed
3. Document the new color in this guide

## Best Practices

1. **Text**: Always use `text-foreground` for primary text
2. **Backgrounds**: Use `bg-background` for main content areas
3. **Cards & Panels**: Use the `.card` component class for consistent styling
4. **Hover/Focus States**: Use the appropriate `hover:` and `focus:` variants
5. **Transitions**: Add smooth transitions for theme changes

---

*Last Updated: June 2, 2025*

# BuzzTrip Brand & Style Guide

A comprehensive guide to colors, typography, spacing, and design patterns used across the BuzzTrip platform.

## Color System

### Brand Colors

**Primary Brand Color**
- `--primary: hsl(176, 46%, 32%)` - Teal/Aqua
- **RGB**: #349d8b
- **Usage**: Primary actions, links, highlights, brand elements
- **When to use**: Call-to-action buttons, navigation active states, important links, brand accents

**Primary Foreground**
- Light Mode: `hsl(355.7 100% 97.3%)` - Off-white
- Dark Mode: `hsl(144.9 80.4% 10%)` - Dark green
- **Usage**: Text on primary backgrounds

### Semantic Colors

**Destructive/Error**
- Light: `hsl(0 84.2% 60.2%)` - Red
- Dark: `hsl(0 62.8% 30.6%)` - Dark red
- **Usage**: Error states, delete actions, warnings
- **Examples**: Delete buttons, error messages, validation errors

**Success/Positive**
- **Ring color**: `hsl(142.1 76.2% 36.3%)` - Green
- **Usage**: Success states, confirmations, positive actions
- **Examples**: Success messages, completion indicators

### Surface Colors

**Background**
- Light: `hsl(0 0% 100%)` - Pure white
- Dark: `hsl(20 14.3% 4.1%)` - Dark brown
- **Usage**: Main page background

**Card/Surface**
- Light: `hsl(0 0% 100%)` - White
- Dark: `hsl(24 9.8% 10%)` - Dark surface
- **Usage**: Card backgrounds, elevated surfaces, modals

**Secondary**
- Light: `hsl(240 4.8% 95.9%)` - Light gray
- Dark: `hsl(240 3.7% 15.9%)` - Dark gray
- **Usage**: Secondary buttons, subtle backgrounds

**Muted**
- Light: `hsl(240 4.8% 95.9%)` - Light gray
- Dark: `hsl(0 0% 15%)` - Dark gray
- **Usage**: Disabled states, subtle backgrounds, dividers

**Accent**
- Light: `hsl(240 4.8% 95.9%)` - Light gray
- Dark: `hsl(12 6.5% 15.1%)` - Dark accent
- **Usage**: Hover states, subtle highlights

### Text Colors

**Foreground (Primary Text)**
- Light: `hsl(240 10% 3.9%)` - Dark gray
- Dark: `hsl(0 0% 95%)` - Light gray
- **Usage**: Primary text content, headings

**Muted Foreground**
- Light: `hsl(240 3.8% 46.1%)` - Medium gray
- Dark: `hsl(240 5% 64.9%)` - Light gray
- **Usage**: Secondary text, captions, metadata

### Border & Input Colors

**Border**
- Light: `hsl(240 5.9% 90%)` - Light gray
- Dark: `hsl(240 3.7% 15.9%)` - Dark gray
- **Usage**: Component borders, dividers

**Input**
- Light: `hsl(240 5.9% 90%)` - Light gray
- Dark: `hsl(240 3.7% 15.9%)` - Dark gray
- **Usage**: Input field borders and backgrounds

**Ring/Focus**
- Light: `hsl(142.1 76.2% 36.3%)` - Green
- Dark: `hsl(142.4 71.8% 29.2%)` - Dark green
- **Usage**: Focus states, active elements

### Chart Colors

**Chart Palette**
- Chart 1: `hsl(12 76% 61%)` - Orange/red
- Chart 2: `hsl(173 58% 39%)` - Teal
- Chart 3: `hsl(197 37% 24%)` - Dark blue
- Chart 4: `hsl(43 74% 66%)` - Yellow
- Chart 5: `hsl(27 87% 67%)` - Orange
- **Usage**: Data visualization, charts, graphs

### Sidebar Colors (Admin)

**Sidebar Background**
- Light: `hsl(0 0% 98%)` - Off-white
- Dark: `hsl(240 5.9% 10%)` - Dark
- **Usage**: Admin sidebar background

**Sidebar Primary**
- Light: `hsl(240 5.9% 10%)` - Dark
- Dark: `hsl(224.3 76.3% 48%)` - Blue
- **Usage**: Active sidebar items

## Typography

### Font Families
- **Primary**: System font stack (default)
- **Mono**: System monospace for code

### Font Sizes
- **Text XS**: 12px - Small labels, captions
- **Text SM**: 14px - Secondary text, metadata
- **Text Base**: 16px - Primary body text
- **Text LG**: 18px - Large body text
- **Text XL**: 20px - Subheadings
- **Text 2XL**: 24px - Section headings
- **Text 3XL**: 30px - Page headings
- **Text 4XL**: 36px - Hero text
- **Text 5XL**: 48px - Display text
- **Text 6XL**: 60px - Large hero text
- **Text 7XL**: 72px - Extra large hero text

### Font Weights
- **Font Normal**: 400 - Body text
- **Font Medium**: 500 - Emphasized text
- **Font Semibold**: 600 - Subheadings
- **Font Bold**: 700 - Headings, important text

## Component Colors

### Button Variants

**Default Button**
- Background: `bg-primary` - Brand teal
- Text: `text-primary-foreground` - Off-white
- Hover: `hover:bg-primary/90` - Slightly transparent
- **Usage**: Primary actions, main CTAs

**Destructive Button**
- Background: `bg-destructive` - Red
- Text: `text-white`
- Hover: `hover:bg-destructive/90`
- **Usage**: Delete actions, dangerous operations

**Outline Button**
- Background: `bg-background` - Transparent
- Border: `border` - Light gray
- Text: `text-foreground`
- Hover: `hover:bg-accent`
- **Usage**: Secondary actions, cancel buttons

**Secondary Button**
- Background: `bg-secondary` - Light gray
- Text: `text-secondary-foreground`
- Hover: `hover:bg-secondary/80`
- **Usage**: Less important actions

**Ghost Button**
- Background: Transparent
- Text: `text-foreground`
- Hover: `hover:bg-accent`
- **Usage**: Minimal actions, navigation

**Link Button**
- Background: Transparent
- Text: `text-primary`
- Decoration: `underline-offset-4 hover:underline`
- **Usage**: Text links that look like buttons

### Badge Variants

**Default Badge**
- Background: `bg-primary` - Brand teal
- Text: `text-primary-foreground`
- **Usage**: Status indicators, labels

**Secondary Badge**
- Background: `bg-secondary` - Light gray
- Text: `text-secondary-foreground`
- **Usage**: Less important labels

**Destructive Badge**
- Background: `bg-destructive` - Red
- Text: `text-white`
- **Usage**: Error states, warnings

**Outline Badge**
- Background: Transparent
- Border: `border`
- Text: `text-foreground`
- **Usage**: Subtle labels

### Status Colors

**Available/Active**
- Background: `bg-green-100` - Light green
- Text: `text-green-700`
- Border: `border-green-200`
- **Usage**: Available features, active states

**Coming Soon/Warning**
- Background: `bg-amber-100` - Light amber
- Text: `text-amber-700`
- Border: `border-amber-200`
- **Usage**: Upcoming features, warnings

**Emerald (Live Data)**
- Text: `text-emerald-600`
- Border: `border-emerald-200`
- **Usage**: Live data indicators

## Spacing & Layout

### Border Radius
- **Radius**: 8px (0.5rem) - Default
- **Radius LG**: 8px - Large radius
- **Radius MD**: 6px - Medium radius
- **Radius SM**: 4px - Small radius

### Shadows
- **Shadow XS**: Subtle elevation
- **Shadow LG**: Card elevation
- **Shadow XL**: Modal elevation
- **Shadow 2XL**: High elevation

## Usage Guidelines

### When to Use Primary Color
- Main call-to-action buttons
- Active navigation states
- Important links
- Brand elements and logos
- Focus states for form elements

### When to Use Destructive Color
- Delete buttons and actions
- Error messages and alerts
- Validation error states
- Dangerous action confirmations

### When to Use Success Colors
- Success messages
- Completion states
- Positive feedback
- Confirmation indicators

### When to Use Muted Colors
- Secondary text and metadata
- Disabled states
- Subtle backgrounds
- Placeholder text

### Text Color Hierarchy
1. **Foreground**: Primary content, headings
2. **Muted Foreground**: Secondary text, captions
3. **Primary**: Interactive text, links
4. **Destructive**: Error text
5. **Success/Green**: Positive feedback text

## Accessibility

### Color Contrast
- All text colors meet WCAG AA standards
- Interactive elements have sufficient contrast
- Focus states are clearly visible

### Dark Mode Support
- All colors have light and dark mode variants
- Automatic switching based on user preference
- Consistent contrast ratios across modes

## Brand Applications

### Logo Usage
- Primary color on light backgrounds
- White/foreground color on dark backgrounds
- Maintain sufficient padding around logo

### Marketing Materials
- Use primary color for CTAs and highlights
- Secondary colors for supporting elements
- Maintain brand consistency across platforms

## Technical Implementation

### CSS Custom Properties
All colors are implemented as CSS custom properties in `globals.css`:
- Use `hsl()` color format for better manipulation
- Semantic naming for easy theming
- Automatic dark mode switching

### Tailwind Configuration
- Colors mapped to Tailwind utilities
- Custom color extensions for brand colors
- Consistent naming conventions

### Component Variants
- Use Class Variance Authority (CVA) for component variants
- Consistent color application across components
- Type-safe variant definitions
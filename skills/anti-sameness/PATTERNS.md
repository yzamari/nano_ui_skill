# AI-Generated UI Patterns to Detect & Avoid

## Color Patterns

### The "AI Gradient" (AVOID)
```css
/* These scream "AI-generated" */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
background: linear-gradient(to right, #4facfe, #00f2fe);
background: linear-gradient(135deg, #6366f1, #8b5cf6);
```

### Default Tailwind (AVOID)
```
slate-50 through slate-900
blue-500, indigo-500, purple-500
gray-100 backgrounds with gray-900 text
```

### Generic Neutrals (AVOID)
```
#f8f9fa, #e9ecef, #dee2e6 (Bootstrap grays)
#f3f4f6, #e5e7eb (Tailwind grays)
Pure black (#000) and pure white (#fff)
```

## Typography Patterns

### The "Safe Stack" (AVOID)
```css
font-family: Inter, system-ui, sans-serif;
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
```

### Generic Pairings (AVOID)
- Inter + Inter
- Roboto + Roboto
- Any system font as display type

### Boring Weights (AVOID)
- Only using 400 and 700
- No weight variation in hierarchy

## Layout Patterns

### The "SaaS Landing Page" (AVOID)
```
┌─────────────────────────────────────┐
│         HERO (centered)             │
│    Big headline + subhead           │
│        [CTA Button]                 │
├─────────────────────────────────────┤
│   Feature   Feature   Feature       │
│   ┌─────┐   ┌─────┐   ┌─────┐       │
│   │icon │   │icon │   │icon │       │
│   │text │   │text │   │text │       │
│   └─────┘   └─────┘   └─────┘       │
├─────────────────────────────────────┤
│        Testimonials                 │
├─────────────────────────────────────┤
│         Pricing                     │
│   ┌───┐   ┌───┐   ┌───┐            │
│   │ $ │   │$$│   │$$$│            │
├─────────────────────────────────────┤
│          CTA Footer                 │
└─────────────────────────────────────┘
```

### Identical Cards (AVOID)
```
All cards same size, same shadow, same border-radius
Perfect 3-column or 4-column grids
No variation in card types
```

## Component Patterns

### Generic Buttons (AVOID)
```css
.btn {
  border-radius: 8px; /* or rounded-lg */
  padding: 12px 24px;
  background: #4f46e5; /* indigo-600 */
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
```

### Generic Cards (AVOID)
```css
.card {
  border-radius: 12px; /* or rounded-xl */
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  border: 1px solid #e5e7eb;
}
```

### Generic Inputs (AVOID)
```css
.input {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 12px;
}
.input:focus {
  border-color: #6366f1;
  ring: 2px #6366f1;
}
```

## Animation Patterns

### Overused Animations (AVOID)
- Fade in from bottom (every section)
- Scale up on hover (every card)
- Bounce on buttons
- Generic loading spinners

## Illustration Patterns

### AI/Stock Illustration Styles (AVOID)
- Humaaans-style blob people
- unDraw flat illustrations
- Abstract blob backgrounds
- Gradient mesh backgrounds
- Floating 3D shapes

## Detection Checklist

When reviewing a design, check for:

- [ ] Uses default Tailwind/Bootstrap colors?
- [ ] Blue/purple gradient present?
- [ ] Inter or system fonts only?
- [ ] All elements have same border-radius?
- [ ] Perfect 3-column feature grid?
- [ ] Centered hero with single CTA?
- [ ] Generic card shadows?
- [ ] No typographic personality?
- [ ] No color surprises?
- [ ] Could be any SaaS landing page?

**Score: Count of ❌ checked items**
- 0-2: Unique design
- 3-5: Some generic elements
- 6-8: Very generic
- 9-10: Full "AI-generated look"

# GSAP Scroll Reveal Animation System

## Overview
Pure class-based animation system using GSAP ScrollTrigger. No wrapper components needed—just add `data-reveal` attributes to any element.

## System Components

### 1. Core Utility (`src/lib/gsap-scroll.ts`)
Contains all GSAP animation logic and initialization functions.

### 2. Global Initializer (`src/components/ScrollRevealInit.tsx`)
Client component that runs once in the main layout. Auto-detects and initializes all `data-reveal` elements.

### 3. Layout Integration (`src/app/(main)/layout.tsx`)
ScrollRevealInit component added to layout—animations work everywhere automatically.

---

## How to Use

### Basic Animation
Add `data-reveal` attribute with animation type:

```tsx
<div data-reveal="slideUp">
  This content will slide up when scrolled into view
</div>
```

### Custom Timing
Control delay and duration:

```tsx
<h1 data-reveal="fade" data-delay="0.3" data-duration="1.2">
  Fades in after 0.3s delay over 1.2s duration
</h1>
```

### Stagger Children
Animate children sequentially:

```tsx
<div data-reveal="slideUp" data-stagger="0.15">
  <div>Appears first</div>
  <div>Appears 0.15s later</div>
  <div>Appears 0.3s later</div>
</div>
```

### Advanced Options
```tsx
<section 
  data-reveal="scale"
  data-delay="0.2"
  data-duration="1"
  data-trigger="top center"
  data-once="false"
>
  Can trigger at custom scroll positions and animate multiple times
</section>
```

---

## Available Animations

| Animation | Effect |
|-----------|--------|
| `fade` | Opacity 0 → 1 |
| `slideUp` | Slides up from below |
| `slideDown` | Slides down from above |
| `slideLeft` | Slides from right |
| `slideRight` | Slides from left |
| `scale` | Scales from 80% → 100% |
| `scaleUp` | Scales from 50% → 100% |
| `blur` | Blur 10px → 0px |
| `rotateIn` | Rotates 45° → 0° |
| `flipX` | Flips on X-axis |
| `flipY` | Flips on Y-axis |

---

## Data Attributes Reference

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-reveal` | string | (required) | Animation type (see table above) |
| `data-delay` | number | `0` | Delay before animation starts (seconds) |
| `data-duration` | number | `0.8` | Animation duration (seconds) |
| `data-stagger` | number | `0` | Delay between child elements (seconds) |
| `data-trigger` | string | `top 80%` | ScrollTrigger start position |
| `data-once` | boolean | `true` | Animate only once or on every scroll |

---

## Real Examples from Site

### Hero Section
```tsx
<BrandText 
  data-reveal="scale" 
  data-duration="1.2" 
  data-delay="0.3"
/>

<Button 
  data-reveal="slideUp" 
  data-delay="0.8"
>
  Explore Collection
</Button>
```

### Category Grid
```tsx
<h2 data-reveal="slideUp">
  Explore Our Categories
</h2>

<div data-reveal="slideUp" data-stagger="0.15" data-delay="0.2">
  {categories.map(category => (
    <CategoryCard key={category.slug} {...category} />
  ))}
</div>
```

### About Page Image Grid
```tsx
<div data-reveal="scale" data-stagger="0.15">
  <Image src="/about-1.jpg" />
  <Image src="/about-2.jpg" />
  <Image src="/about-3.jpg" />
  <Image src="/about-4.jpg" />
</div>
```

### Contact Page Cards
```tsx
<div data-reveal="slideUp" data-stagger="0.2">
  <ContactMethodCard icon={<Mail />} />
  <ContactMethodCard icon={<Phone />} />
  <ContactMethodCard icon={<MapPin />} />
</div>
```

---

## Common Patterns

### 1. Header + Content
```tsx
<section>
  <h2 data-reveal="slideUp">Title</h2>
  <p data-reveal="slideUp" data-delay="0.15">Content appears slightly after</p>
</section>
```

### 2. Grid Layout
```tsx
<div data-reveal="slideUp" data-stagger="0.1">
  <GridItem />
  <GridItem />
  <GridItem />
  <GridItem />
</div>
```

### 3. Call-to-Action Section
```tsx
<section>
  <h2 data-reveal="scale" data-duration="1">Get Started Today</h2>
  <p data-reveal="fade" data-delay="0.2">Join thousands of satisfied customers</p>
  <Button data-reveal="slideUp" data-delay="0.4">Sign Up Now</Button>
</section>
```

### 4. FAQ Accordion
```tsx
<div data-reveal="slideUp" data-stagger="0.1">
  {faqs.map(faq => (
    <AccordionItem key={faq.id} />
  ))}
</div>
```

---

## Migration Guide

### Old Pattern (DON'T USE)
```tsx
import RevealOnScroll from '@/components/RevealOnScroll';

<RevealOnScroll animation="slideUp" delay={0.2}>
  <div>Content</div>
</RevealOnScroll>
```

### New Pattern (USE THIS)
```tsx
// No import needed!

<div data-reveal="slideUp" data-delay="0.2">
  Content
</div>
```

---

## Performance Tips

1. **Use stagger for lists**: Better than animating each item individually
2. **Keep durations under 1.2s**: Faster feels more responsive
3. **Delay increments of 0.1-0.2s**: Creates smooth cascade effect
4. **Limit animations per viewport**: Don't animate everything at once

---

## Troubleshooting

### Animations not working?
- Check that ScrollRevealInit is in the layout
- Verify GSAP and ScrollTrigger are installed
- Check browser console for errors
- Make sure element has content/height

### Animations too slow?
- Reduce `data-duration` (default is 0.8s)
- Reduce `data-delay`
- Check `data-stagger` isn't too large

### Animations repeating?
- Set `data-once="true"` (default behavior)
- Check `data-trigger` position

### Stagger not working?
- Ensure parent has `data-stagger` attribute
- Parent must have direct children to stagger
- Check children aren't positioned absolutely

---

## Browser Support
- All modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Falls back gracefully if JS disabled (content still visible)

---

## Files Involved

```
Frontend/
  src/
    lib/
      gsap-scroll.ts          # Animation utilities
    components/
      ScrollRevealInit.tsx    # Global initializer
    app/
      (main)/
        layout.tsx            # Contains <ScrollRevealInit />
```

---

## Adding to New Pages

1. No imports needed
2. No initialization code needed
3. Just add `data-reveal` attributes to elements
4. Animations work automatically

Example new page:
```tsx
// src/app/(main)/new-page/page.tsx
export default function NewPage() {
  return (
    <div className="container">
      <h1 data-reveal="slideUp">My New Page</h1>
      <p data-reveal="fade" data-delay="0.2">
        This content animates automatically!
      </p>
    </div>
  );
}
```

That's it! No additional setup required.

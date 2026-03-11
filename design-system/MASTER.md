# Humanity Founders - Master Design System

## Global Style: Premium Glassmorphism
- **Background**: Deep Zinc/Black (`#050505`)
- **Card Background**: `rgba(255, 255, 255, 0.03)` with `backdrop-filter: blur(24px)`
- **Borders**: `rgba(255, 255, 255, 0.08)`
- **Primary Color**: Zinc-100 (Primary text), Zinc-400 (Secondary text)
- **Accent Color**: White (Primary actions), Emerald (Success), Amber (Draft/Warning), Red (Critical)

## Grid & Spacing
- **Base Unit**: 8px (Tailwind standard)
- **Container**: `max-w-7xl` for main pages, `max-w-5xl` for focused dashboards.
- **Card Radius**: `1.5rem` (24px) or `2rem` (32px) for large containers.

## Typography
- **Headings**: SemiBold/Black weight, tracking-tight.
- **Labels**: `text-[10px]` or `text-xs`, font-black, uppercase, tracking-widest.
- **Body**: `text-sm` or `text-base`, font-medium, leading-relaxed.

## Interaction
- **Hover**: Scale `1.02`, border opacity increase, subtle box-shadow.
- **Transitions**: `duration-300` for layout, `duration-200` for colors.
- **Cursors**: `cursor-pointer` on all interactive cards.

## Components
### Cards
- Border: `border-white/10`
- Shadow: `shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]`
- Hover: `hover:border-white/20 hover:bg-white/[0.05]`

### Badges
- Font: `text-[10px]`
- Padding: `px-2 py-0.5`
- Radius: `rounded-full`

### Buttons
- Primary: `bg-white text-black hover:bg-zinc-200`
- Ghost/Outline: `bg-white/5 border-white/10 hover:bg-white/10`

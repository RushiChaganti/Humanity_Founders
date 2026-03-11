# Implementation Plan - Force Single Color Theme

The objective is to remove the theme switching functionality and lock the entire website to a single (dark) theme for a consistent, premium feel.

## Proposed Changes

### Core Configuration
- **app/layout.tsx**: 
    - Update `ThemeProvider` to force `dark` mode.
    - Set `forcedTheme="dark"` and `defaultTheme="dark"`.
    - Disable system theme detection.

### UI Components
- **components/TopNav.tsx**:
    - Remove the theme toggle button and its associated logic (Moon/Sun icons).
    - Remove `useTheme` hook import and usage.

### Toast Configuration
- **components/ui/sonner.tsx**:
    - Hardcode the `theme` to `'dark'` to ensure toast notifications match the forced theme.

## Verification Plan

### Automated Tests
- Check if `TopNav` still renders correctly without the toggle.
- Verify that `html` tag has `class="dark"` and `data-theme="dark"`.

### Manual Verification
- Open the application and ensure no theme toggle is visible in the navigation bar.
- Verify that the application remains in dark mode regardless of system settings.
- Check that toast notifications appear correctly in dark mode.

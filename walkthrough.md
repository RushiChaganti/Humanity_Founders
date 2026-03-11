# Walkthrough - Remove Theme Switch

The theme switching functionality has been removed, and the application is now locked to a consistent dark theme.

## Changes Made

### 1. Hardcoded Dark Mode
- Updated `app/layout.tsx` to force the `dark` theme in the `ThemeProvider`.
- Disabled transition on change and system theme detection.

### 2. Removed UI Controls
- Removed the theme toggle button (Sun/Moon icons) from the `TopNav` component.
- Cleaned up unused imports and hooks related to `next-themes` in `TopNav.tsx`.

### 3. Updated Toast Notifications
- Hardcoded the `dark` theme in `components/ui/sonner.tsx` to ensure toast notifications remain consistent with the overall application theme.

## How to Validate

### 1. Verify UI
- Open the application in your browser.
- Check the top navigation bar. The theme toggle button should no longer be present.

### 2. Verify Theme Persistence
- Change your system theme (e.g., from dark to light).
- The application should remain in dark mode regardless of system settings.

### 3. Verify HTML Attribute
- Inspect the page.
- The `<html>` tag should have `class="dark"` and `data-theme="dark"`.

### 4. Verify Toasts
- Trigger a toast notification (e.g., by saving a form or an action that triggers a toast).
- The toast should appear with a dark theme background.

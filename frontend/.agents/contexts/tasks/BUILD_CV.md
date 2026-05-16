# Build CV Interface for People with Disabilities - AI Prompt

## Overview

This prompt instructs an AI to build a responsive CV interface for users with disabilities. The design should use Tailwind CSS with predefined primary colors and background, React best practices as recommended by Vercel, and integrate APIs with mock data handling.

## Figma & Tailwind Configuration

- Use Tailwind variables for:
  - `primary`: `#004080`
  - `background-gradient`: from `#F8FBFF` to `#EAF4FF`
- Configure Google Sans for all text elements.
- Include UI components from Figma screens provided.
- Ensure responsive design for both mobile and web.

## React Best Practices to Apply

Refer to Vercel guidelines for performance and best practices (apply these when generating code):

- **Critical / High Impact**
  - `async-parallel`, `async-defer-await`
  - `bundle-dynamic-imports`, `bundle-defer-third-party`
  - `server-parallel-fetching`, `server-cache-react`
- **Medium / Medium-High**
  - `client-swr-dedup`, `rerender-memo`, `rerender-transitions`
  - `rendering-animate-svg-wrapper`, `rendering-content-visibility`
- **JS & Advanced Patterns**
  - `js-cache-property-access`, `js-batch-dom-css`, `advanced-init-once`
    > Use these best practices for code generation, re-rendering, data fetching, and API integration.

## Screens to Build

1. **Build CV Screen**
   - Form fields for personal info: Name, Birthday, Address, Gender, Phone, Email, Disability Status, etc.
   - Experience, Education, Certifications, Soft Skills, Hard Skills, Career Goals, Work Conditions, Available Equipment.
   - Use skeleton loaders or loading indicators when fetching data.
   - Validate all fields with React Hook Form + Zod.
   - Add voice input button for each text field as shown in UI.
2. **Confirmation Screen**
   - Review CV audio file before submission.
   - Allow playback, pause, and re-record.
   - Display final confirmation button before calling API.

## API Integration (Mockable)

- **Get Disability Options**
  - Fetch list of disability types and levels for dropdowns and checkboxes.
- **Create CV**
  - Submit new CV including disability info.
- **Update CV**
  - Update existing CV data including disability fields.
- **Get CV Detail**
  - Fetch CV details to pre-fill form when editing.
- **Upload Avatar**
  - Upload profile picture for CV.
- **Validate/Preview**
  - Check or preview CV before submitting.

**Implementation Notes:**

```ts
// Use axios + Tanstack Query
// Load from USE_MOCK_DATA environment variable for mocking API responses
// Always show loading state and skeletons while fetching
// Validate all forms via RHF + Zod
// Example React form behaviors
```

## UI Behavior & Validation

```ts
- Required fields: Name, Disability Status
- Disabled submit until validation passes
- Skeleton loader for async dropdowns
- Loading overlay or spinner for API calls
- Error handling: show toast messages
```

## React / Tailwind Integration Guidelines

```ts
// Tailwind usage
- Use primary color for buttons, highlights
- Background gradient applied to container
- Responsive breakpoints: sm, md, lg, xl
- Utility classes: padding, margin, text sizing, border radius
```

```ts
// React Best Practices
- Memoize expensive components
- Split hooks for independent dependencies
- Use SWR or Tanstack Query for client-side fetching
- Avoid inline components inside render
- Defer expensive renders with startTransition
```

## Expected Deliverables

- Full Markdown file including:
  - Figma-based UI components
  - Tailwind theme config
  - React components using Vercel best practices
  - API integration placeholders with mock support
  - Loading skeletons, RHF+Zod validation
- Separate screens for **Build CV** and **Confirmation**
- Fully responsive for mobile and desktop

---

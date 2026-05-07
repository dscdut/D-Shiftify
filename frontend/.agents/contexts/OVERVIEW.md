# D Shiftify — Frontend Architecture Overview

# 1. Project Overview

### Project Name

**D Shiftify**

### Project Purpose

D Shiftify is an inclusive recruitment platform designed to support people with disabilities in:

- Creating professional CVs
- Discovering suitable job opportunities
- Applying for accessible positions
- Building long-term career growth

At the same time, the platform helps businesses:

- Find qualified candidates with disabilities
- Manage recruitment workflows
- Build inclusive hiring systems
- Improve workforce diversity

The platform focuses on accessibility-first UX, scalable frontend architecture, and maintainable feature-first development.

---

# 2. Tech Stack

## Core Technologies

- React 18
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- TanStack React Query
- Zustand
- Axios
- Zod
- React Hook Form

---

## Development Tooling

- ESLint
- Prettier
- Husky
- Jest
- Commitlint

---

# 3. Development Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "check:type": "tsc --project tsconfig.json --noEmit",
    "check:lint": "eslint . --fix",
    "check:prettier": "prettier --write --ignore-unknown \"**/*\" ",
    "check:all": "yarn check:prettier && yarn check:lint && yarn check:type",
    "prepare": "husky",
    "test": "jest"
  }
}
```

# 4. Core Architecture Philosophy

The entire frontend follows a **Layer-Based Architecture** focused on scalability, maintainability, and accessibility-first development.

The architecture emphasizes:

- Clean Code
- SOLID
- DRY
- Separation of Concerns
- Predictable data flow
- Reusable UI systems
- Centralized configuration
- Accessibility-first engineering
- Scalable folder organization

The project does NOT follow strict feature-first architecture.

Instead, it uses a layered architecture where responsibilities are separated by technical concerns:

- app layer
- component layer
- core layer
- hooks layer
- services layer
- pages layer
- models layer

This structure is optimized for:

- medium to large frontend applications
- reusable UI systems
- maintainable shared logic
- scalable React applications

# 5. High-Level Architecture

The application is divided into multiple architecture layers:

| Layer         | Responsibility                              |
| ------------- | ------------------------------------------- |
| `app/`        | Application-level composition and providers |
| `components/` | Reusable UI components                      |
| `core/`       | Shared infrastructure and configuration     |
| `hooks/`      | Reusable React hooks                        |
| `pages/`      | Route/page-level components                 |
| `services/`   | API communication                           |
| `models/`     | Shared TypeScript models                    |
| `styles/`     | Global styling                              |
| `locales/`    | Internationalization                        |

# 6. Application Domains

### Candidate Side

Features for users with disabilities:

- Authentication
- Profile management
- CV builder
- Accessibility preferences
- Job discovery
- Job application tracking
- Notifications
- Messaging with recruiters

---

### Recruiter / Company Side

Features for businesses:

- Company management
- Candidate discovery
- Job posting
- Applicant tracking
- Interview scheduling
- Recruitment analytics

---

### Accessibility System

Accessibility is a first-class requirement.

The platform should support:

- Keyboard navigation
- Screen readers
- High contrast mode
- Adjustable font sizing
- Semantic HTML
- ARIA attributes
- Reduced motion support
- Color accessibility compliance

# 7. Architecture Principles

### Main Principles

Business logic should remain organized and predictable.

The project architecture separates concerns by technical responsibility instead of feature ownership.

---

### Layer-Based Organization

| Layer         | Main Purpose                           |
| ------------- | -------------------------------------- |
| `components/` | Shared reusable UI                     |
| `services/`   | API requests and backend communication |
| `hooks/`      | Shared reusable logic                  |
| `pages/`      | Route composition                      |
| `core/`       | Shared infrastructure                  |
| `models/`     | Shared TypeScript interfaces           |
| `styles/`     | Global styling                         |
| `locales/`    | Translation resources                  |

---

### Architecture Goals

The architecture is designed to ensure:

- reusable code
- centralized infrastructure
- maintainable frontend structure
- scalable UI systems
- accessibility-first development
- clear separation of responsibilities

# 8. Project Structure

```txt
├── public/                    # Static files
│   ├── favicon.ico           # Favicon
│   └── robots.txt            # Robots file
│
├── src/                      # Source code
│   ├── app/                  # App-level components
│   │   ├── layout/           # Layout components
│   │   │   ├── layout-main.tsx
│   │   │   └── layout-auth.tsx
│   │   │
│   │   └── providers/        # App providers
│   │       ├── theme-provider.tsx
│   │       └── query-provider.tsx
│   │
│   ├── assets/               # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/           # Reusable components
│   │   ├── ui/
│   │   ├── header-nav/
│   │   ├── language/
│   │   └── logo/
│   │
│   ├── core/                 # Core functionality
│   │   ├── configs/
│   │   ├── lib/
│   │   └── store/
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-theme.ts
│   │   └── use-router-element.tsx
│   │
│   ├── locales/              # Internationalization
│   │   ├── en/
│   │   └── vi/
│   │
│   ├── models/               # TypeScript interfaces/types
│   │   ├── user.ts
│   │   └── api.ts
│   │
│   ├── pages/                # Page components
│   │   ├── 404/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── home/
│   │
│   ├── services/             # API services
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   │
│   ├── styles/               # Global styles
│   │   ├── globals.css
│   │   └── tailwind.css
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── __tests__/
│   ├── components/
│   ├── hooks/
│   └── utils/
│
├── .eslintrc.js
├── .prettierrc
├── .env.example
├── .gitignore
├── babel.config.cjs
├── index.html
├── jest.config.cjs
├── package.json
├── tsconfig.json
└── vite.config.ts
```

# 9. Architecture Layer Responsibilities

## 9.1 `src/app/`

Responsible for:

- application composition
- layouts
- providers
- theme management
- query provider setup

Examples:

```txt
src/app/layout/
src/app/providers/
```

---

## 9.2 `src/components/`

Contains reusable UI components.

Examples:

```txt
src/components/ui/
src/components/header-nav/
src/components/logo/
```

Rules:

- components should remain reusable
- components should avoid heavy business logic
- components should prioritize accessibility

---

## 9.3 `src/core/`

Contains centralized application infrastructure.

Examples:

```txt
src/core/configs/
src/core/lib/
src/core/store/
```

Responsibilities:

- centralized constants
- utility functions
- global state management
- shared validation helpers
- application configuration

---

## 9.4 `src/hooks/`

Contains reusable React hooks.

Examples:

```txt
use-auth.ts
use-theme.ts
use-router-element.tsx
```

Rules:

- hook names must start with `use`
- hooks should encapsulate reusable logic
- hooks should avoid direct UI rendering

---

## 9.5 `src/locales/`

Handles internationalization.

Responsibilities:

- translation resources
- language configuration
- localization support

---

## 9.6 `src/models/`

Contains shared TypeScript interfaces and types.

Examples:

```txt
src/models/user.ts
src/models/api.ts
```

---

## 9.7 `src/pages/`

Contains route-level page components.

Examples:

```txt
src/pages/auth/
src/pages/dashboard/
src/pages/home/
```

Rules:

- pages should remain lightweight
- pages assemble hooks and components
- avoid placing API logic directly inside pages

---

## 9.8 `src/services/`

Contains backend communication logic.

Examples:

```txt
auth.service.ts
user.service.ts
```

Responsibilities:

- API requests
- response handling
- backend communication abstraction

---

## 9.9 `src/styles/`

Contains global styling configuration.

Examples:

```txt
globals.css
tailwind.css
```

Responsibilities:

- global styling
- Tailwind setup
- typography
- accessibility-friendly UI styling

# 10. State Management Rules

### React Query

Use React Query for:

- API caching
- async state
- server synchronization
- mutations
- background refetching

---

## Zustand

Use Zustand for:

- local UI state
- app preferences
- temporary frontend state

---

# 11. API Architecture

API communication should remain centralized inside the `services/` layer.

Examples:

```txt
auth.service.ts
user.service.ts
```

Responsibilities include:

- API requests
- response handling
- request abstraction
- error normalization

Rules:

- avoid inline fetch/axios inside components
- pages should not directly handle backend communication
- service functions should remain reusable

# 12. Form Handling

Forms use:

- React Hook Form
- Zod validation

Rules:

- forms must remain type-safe
- validation logic should remain centralized
- validation messages should support accessibility
- avoid duplicated validation logic

# 13. Accessibility Requirements

Accessibility is mandatory.

All UI must support:

- semantic HTML
- keyboard navigation
- aria-label
- focus visibility
- screen readers
- reduced motion support
- color accessibility compliance
- accessible form labels

Avoid:

- inaccessible div buttons
- hidden focus states
- hover-only interactions
- unclear icon-only buttons

# 14. Naming Conventions

### React Components

Use PascalCase.

Examples:

```txt
JobCard.tsx
CvPreview.tsx
ProfileSidebar.tsx
```

---

## Hooks

Hooks must start with `use`.

Examples:

```txt
use-auth.ts
use-theme.ts
use-profile.ts
```

---

## Services

Service files use `.service.ts`.

Examples:

```txt
auth.service.ts
user.service.ts
job.service.ts
```

---

## Models

Shared interfaces and types belong inside `models/`.

Examples:

```txt
user.ts
api.ts
job.ts
```

---

## Directories

Directory names should use kebab-case where possible.

# 15. UI Principles

The UI system should be:

- accessible
- responsive
- minimal
- scalable
- consistent

UI should prioritize:

- readability
- accessibility
- predictable interactions
- semantic structure
- responsive layouts

Avoid:

- inconsistent spacing
- inaccessible interactions
- excessive animation
- unclear component ownership

# 16. Code Quality Rules

Every new feature must:

- remain type-safe
- support accessibility requirements
- avoid duplicated logic
- keep components maintainable
- keep imports clean
- avoid dead code
- pass linting
- pass type-checking
- pass build validation

Business logic should remain separated from presentation whenever possible.

# 17. Definition of Done

A task is complete only if:

- functionality works correctly
- accessibility requirements are satisfied
- lint passes
- type-check passes
- build passes
- no dead code exists
- naming conventions are respected
- code remains maintainable
- services are reusable
- UI remains responsive

# 18. Commands

### Install Dependencies

```bash
yarn install
```

### Start Development Server

```bash
yarn dev
```

### Build Project

```bash
yarn build
```

### Preview Build

```bash
yarn preview
```

### Lint Project

```bash
yarn lint
```

### Run Type Check

```bash
yarn check:type
```

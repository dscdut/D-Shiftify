<div align="center">
    <img src="https://dut.gdsc.dev/static/media/full_logo.0703a97c176aa84cbc51.jpg" alt="tailwindcss" borderRadius="10px" />
  </div>

<h1 align="center">React Boilerplate 🚀</h1>

<div align="center">
  <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
  <img src="https://img.shields.io/badge/-ReactJs-61DAFB?logo=react&logoColor=white&style=for-the-badge" alt="react" />
  <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
  <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcn/ui&logoColor=white" alt="shadcn-ui" />
  <img src="https://img.shields.io/badge/-Vite-646CFF?style=for-the-badge&logoColor=white&logo=vite" alt="vite" />
  <img src="https://img.shields.io/badge/-ESLint-4B32C3?style=for-the-badge&logoColor=white&logo=eslint" alt="eslint" />
  <img src="https://img.shields.io/badge/-Prettier-F7B93E?style=for-the-badge&logoColor=white&logo=prettier" alt="prettier" />
  <img src="https://img.shields.io/badge/-Husky-000000?style=for-the-badge&logoColor=white&logo=husky" alt="husky" />
</div>

## 📝 Overview

A modern, production-ready React boilerplate with TypeScript, TailwindCSS, and Shadcn UI. This template provides a solid foundation for building scalable React applications with best practices and modern tooling.

## ✨ Features

### 🛠 Core Technologies

- ⚡️ [React 18](https://react.dev/) - A JavaScript library for building user interfaces
- 🔥 [TypeScript](https://www.typescriptlang.org) - Static type checking
- 🎨 [TailwindCSS](https://tailwindcss.com) - Utility-first CSS framework
- 🎯 [Shadcn UI](https://ui.shadcn.com/) - Re-usable components built with Radix UI and Tailwind CSS
- ⚡️ [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- 🦖 [Tanstack Query](https://tanstack.com/query) - Tanstack Query auto caching & background refetching

### 🛡 Development Tools

- 📦 [ESLint](https://eslint.org/) - Code linting
- 💅 [Prettier](https://prettier.io) - Code formatting
- 🦊 [Husky](https://typicode.github.io/husky/) - Git hooks
- 🧪 [Jest](https://jestjs.io/) - Unit testing
- 📝 [Commitlint](https://commitlint.js.org/) - Lint commit messages

### 🎯 Main Features

#### 1. Authentication System

- JWT-based authentication
- Protected routes
- Role-based access control
- Persistent login state
- Automatic token refresh

#### 2. State Management

- Zustand for local state
- Type-safe state management
- DevTools integration
- Middleware support

#### 3. Internationalization (i18n)

- Multi-language support
- Dynamic language switching
- RTL support
- Translation management
- Lazy loading of translations

#### 4. Theme System

- Dark/Light mode
- System theme detection
- Custom theme support
- Persistent theme preference
- Smooth theme transitions

#### 5. API Integration

- Axios instance with interceptors
- Request/Response caching
- Error handling
- Loading states
- Retry mechanism

#### 6. Form Handling

- React Hook Form integration
- Form validation with Zod
- Dynamic form fields
- Custom form components
- Error messages

#### 7. Performance Optimization

- Code splitting
- Lazy loading
- Image optimization
- Bundle analysis
- Performance monitoring

## 🧪 Unit Testing Setup

### 1. Configuration Files

```javascript
// jest.config.cjs
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
}

// babel.config.cjs
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]]
}

// tsconfig.jest.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "esModuleInterop": true
  },
  "include": ["src", "jest.setup.cjs"]
}
```

### 2. Test Structure

```
src/
├── __tests__/
│   ├── components/
│   │   └── ui/
│   │       └── button.test.tsx
│   ├── hooks/
│   │   └── useAuth.test.ts
│   └── utils/
│       └── formatDate.test.ts
```

### 3. Writing Tests

```typescript
// Example component test
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    screen.getByText('Click me').click()
    expect(handleClick).toHaveBeenCalled()
  })
})
```

### 4. Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

### 5. Testing Best Practices

- Use `@testing-library/react` for component testing
- Follow the Arrange-Act-Assert pattern
- Mock external dependencies
- Test user interactions
- Test accessibility
- Use meaningful test descriptions
- Keep tests focused and isolated

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- Yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/react-boilerplate-the-best-2025.git
cd react-boilerplate-the-best-2025
```

2. Install dependencies:

```bash
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Start development server:

```bash
yarn dev
```

Visit `http://localhost:4000` to see your application.

## 📁 Project Structure

```
├── public/                    # Static files
│   ├── favicon.ico           # Favicon
│   └── robots.txt            # Robots file
│
├── src/                      # Source code
│   ├── app/                  # App-level components
│   │   ├── layout/          # Layout components
│   │   │   ├── layout-main.tsx
│   │   │   └── layout-auth.tsx
│   │   └── providers/       # App providers
│   │       ├── theme-provider.tsx
│   │       └── query-provider.tsx
│   │
│   ├── assets/              # Static assets
│   │   ├── images/         # Image files
│   │   ├── icons/          # Icon files
│   │   └── fonts/          # Font files
│   │
│   ├── components/          # Reusable components
│   │   ├── ui/             # UI components (shadcn)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── header-nav/     # Header components
│   │   ├── language/       # Language components
│   │   └── logo/           # Logo components
│   │
│   ├── core/              # Core functionality
│   │   ├── configs/           # Centralized configuration files
│   │   │   ├── const.tsx         # Small constants for UI or logic
│   │   │   ├── consts.ts         # Large constants, enums, or value lists
│   │   │   ├── env.ts            # Environment variables (API URL, upload limits, etc.)
│   │   │   ├── i18n.ts           # Internationalization (i18n) configuration
│   │   │   └── icon-size.ts      # Standard icon sizes for consistent UI
│   │   ├── lib/              # Utility functions
│   │   │   ├── utils.ts
│   │   │   └── validations.ts
│   │   └── store/            # State management
│   │       ├── zustand/
│   │       └── redux/
│   │
│   ├── hooks/            # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-theme.ts
│   │   └── use-router-element.tsx
│   │
│   ├── locales/          # Internationalization
│   │   ├── en/
│   │   │   └── common.json
│   │   └── vi/
│   │       └── common.json
│   │
│   ├── models/           # TypeScript interfaces/types
│   │   ├── user.ts
│   │   └── api.ts
│   │
│   ├── pages/            # Page components
│   │   ├── 404/
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   ├── dashboard/
│   │   └── home/
│   │
│   ├── services/         # API services
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   │
│   ├── styles/           # Global styles
│   │   ├── globals.css
│   │   └── tailwind.css
│   │
│   ├── App.tsx           # Root component
│   └── main.tsx          # Entry point
│
├── __tests__/            # Test files
│   ├── components/       # Component tests
│   ├── hooks/           # Hook tests
│   └── utils/           # Utility tests
│
├── .eslintrc.js         # ESLint configuration
├── .prettierrc          # Prettier configuration
├── .env.example         # Example environment variables
├── .gitignore           # Git ignore file
├── babel.config.cjs     # Babel configuration
├── index.html           # HTML template
├── jest.config.cjs      # Jest configuration
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

### 📂 Key Directories Explained

#### `src/app/`

- Contains app-level components and providers
- Layout components for different page types
- Global providers (Theme, Query, etc.)

#### `src/components/`

- Reusable UI components
- Organized by feature/domain
- UI components from shadcn
- Custom components for specific features

#### `src/core/`

- Core application functionality
- API configuration and setup
- Utility functions and helpers
- State management setup

#### `src/hooks/`

- Custom React hooks
- Shared logic between components
- Feature-specific hooks

#### `src/pages/`

- Page components
- Organized by route/feature
- Each page has its own directory for related components

#### `src/services/`

- API service functions
- Organized by domain/feature
- Handles API calls and data transformation

#### `src/styles/`

- Global styles
- Tailwind configuration
- Theme customization

#### `__tests__/`

- Test files mirroring src structure
- Component tests
- Hook tests
- Utility function tests

## 🛠 Available Scripts

- `yarn dev`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://www.facebook.com/thanh.vophuoc.50">ThanhDev</a></sub>
</div>

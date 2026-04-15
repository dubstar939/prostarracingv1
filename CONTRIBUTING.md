# Contributing to Pro Star-Racing

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code Style

- We use TypeScript for type safety
- ESLint and Prettier enforce code style
- 2 spaces for indentation
- Single quotes for strings
- Semicolons are required
- Maximum line length: 100 characters

## Project Structure

```
src/
├── components/     # React components
├── game/          # Game engine and logic
├── hooks/         # Custom React hooks
├── services/      # Business logic (audio, etc.)
├── utils/         # Utility functions
├── constants/     # Constants and configuration
├── types.ts       # TypeScript type definitions
└── index.ts       # Public exports
```

## Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run `npm run lint` to check for errors
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development

```bash
npm install        # Install dependencies
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run type checking
```

## Code Review Process

All submissions require review. Please be patient and respectful during the process.

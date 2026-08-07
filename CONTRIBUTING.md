# Contributing to AgroMind

Thanks for your interest in contributing.

## Development Setup

1. Fork and clone the repository
2. Install dependencies:
   - `npm install`
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
3. Copy env files:
   - `cp .env.example .env`
   - `cp backend/.env.example backend/.env`
4. Run locally:
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm start`

## Contribution Workflow

1. Create a feature branch
2. Keep changes focused and small
3. Add/update documentation and tests for changed behavior
4. Run relevant tests before opening PR
5. Open a pull request with clear rationale and screenshots/logs when relevant

## Coding Guidelines

- Follow existing project style and folder conventions
- Prefer explicit error handling and actionable API error messages
- Use JSDoc annotations in backend domain logic for clarity
- Do not commit secrets or private credentials

## Reporting Issues

When opening an issue, include:
- Reproduction steps
- Expected vs actual behavior
- Environment details (OS, Node version, MongoDB version)
- Relevant request payload/response snippets

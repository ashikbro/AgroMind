# Contributing to AgroMind

Thank you for considering contributing to AgroMind! We welcome contributions from the community to help make this agricultural platform even better.

## 🌱 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- A clear, descriptive title
- Detailed steps to reproduce the issue
- Expected vs. actual behavior
- Screenshots if applicable
- Your environment (OS, browser, Node.js version)

### Suggesting Features

We love new ideas! When suggesting a feature:
- Check if the feature has already been requested
- Clearly describe the feature and its benefits
- Explain how it fits into the agricultural context
- Provide examples or mockups if possible

### Pull Requests

1. **Fork the Repository**
   ```bash
   git clone https://github.com/ashikbro/AgroMind.git
   cd AgroMind
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation as needed
   - Test your changes thoroughly

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: Add your feature description"
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Provide a clear title and description
   - Link related issues
   - Explain what you changed and why
   - Include screenshots for UI changes

## 📋 Development Guidelines

### Code Style

**Backend (Node.js)**
- Use ES6+ features
- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use async/await for asynchronous operations
- Add JSDoc comments for functions
- Keep functions small and focused

**Frontend (React)**
- Use functional components with hooks
- Follow React best practices
- Use PropTypes or TypeScript for type checking
- Keep components reusable and well-documented
- Use Tailwind CSS for styling

### Project Structure

```
AgroMind/
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic
│   └── utils/           # Helper functions
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API calls
│   │   ├── context/     # React context
│   │   └── utils/       # Helper functions
│   └── public/          # Static assets
```

### Testing

- Write tests for new features
- Ensure existing tests pass
- Aim for good test coverage
- Test edge cases

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Documentation

- Update README.md if needed
- Add JSDoc comments for functions
- Update API documentation
- Include inline comments for complex logic

## 🔒 Security

- Never commit sensitive data (API keys, passwords)
- Use environment variables for configuration
- Report security vulnerabilities privately
- Follow OWASP security guidelines

## 🌍 Agricultural Domain Knowledge

When contributing features related to agriculture:
- Research best practices
- Consider regional variations
- Think about farmers' needs
- Validate with agricultural experts if possible

## 📞 Getting Help

- Join our community discussions
- Ask questions in issues
- Check existing documentation
- Reach out to maintainers

## ✅ Code Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, your PR will be merged
4. Your contribution will be acknowledged

## 🎯 Priority Areas

We're especially interested in contributions for:
- AI/ML model improvements
- Mobile responsiveness
- Accessibility features
- Multi-language support
- Performance optimizations
- Test coverage
- Documentation improvements

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You

Every contribution, no matter how small, makes a difference. Thank you for helping improve AgroMind and supporting farmers worldwide!

---

**Happy Contributing! 🌾**

# Contributing to ZeroAI Website

Thank you for your interest in contributing to the ZeroAI website! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm 9+
- Git
- Docker (optional, for containerized development)

### Getting Started

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd zeroai-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── Button.jsx
│   ├── Card.jsx
│   └── index.js
├── pages/           # Page components
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Privacy.jsx
│   └── Terms.jsx
├── styles/          # Global styles and themes
│   ├── index.css
│   └── themes.css
├── App.jsx          # Main app component
└── index.jsx        # Entry point
```

## Coding Standards

### JavaScript/React

- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

### CSS/Tailwind

- Use Tailwind utility classes
- Follow the custom theme defined in `themes.css`
- Use the predefined color palette (purple-based)
- Maintain responsive design (mobile-first)
- Use consistent spacing and sizing

### Component Guidelines

1. **Components should be:**
   - Reusable
   - Well-documented
   - Properly typed with PropTypes (if added)
   - Tested (when testing is set up)

2. **File naming:**
   - PascalCase for components: `MyComponent.jsx`
   - camelCase for utilities: `myHelper.js`
   - kebab-case for CSS files: `my-styles.css`

3. **Import order:**
   ```javascript
   // React imports
   import React from 'react';
   
   // Third-party imports
   import { Link } from 'react-router-dom';
   
   // Internal components
   import Card from '../components/Card';
   
   // Styles (if any)
   import './styles.css';
   ```

## Theme and Design

### Color Palette

The website uses a purple-based dark theme:

- **Primary Purple**: `#6b4ce8`
- **Background**: `#0d0c0f` (dark)
- **Text**: `#eee9dc` (off-white)
- **Accents**: Various purple shades (100-800)

### Design Principles

1. **Clean and Modern** - Minimalist design with focus on content
2. **Consistent Spacing** - Use Tailwind spacing scale
3. **Smooth Animations** - Subtle transitions and animations
4. **Accessibility** - Maintain good contrast ratios
5. **Responsive** - Mobile-first approach

## Making Changes

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `style/` - Style/formatting changes

Example: `feature/add-dark-mode-toggle`

### Commit Messages

Use clear, descriptive commit messages:

```
feat: Add user authentication
fix: Resolve navigation menu bug
docs: Update README with setup instructions
style: Format code with prettier
refactor: Simplify card component logic
```

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Update documentation if needed
5. Submit a pull request with:
   - Clear title and description
   - Screenshots (for UI changes)
   - Link to related issues

## Testing

Before submitting a PR:

1. **Manual testing**
   - Test in different browsers
   - Check responsive design
   - Verify all links work
   - Test form submissions

2. **Build test**
   ```bash
   npm run build
   npm run preview
   ```

3. **Docker test**
   ```bash
   docker build -t zeroai-website:test .
   docker run -p 3000:80 zeroai-website:test
   ```

## Adding New Features

### Adding a New Page

1. Create page component in `src/pages/`
   ```javascript
   import React from 'react';
   
   const NewPage = () => {
     return (
       <div className="relative">
         {/* Your content */}
       </div>
     );
   };
   
   export default NewPage;
   ```

2. Add route in `src/App.jsx`
   ```javascript
   <Route path="/new-page" element={<NewPage />} />
   ```

3. Add navigation link in `src/components/Navbar.jsx`

### Adding a New Component

1. Create component file in `src/components/`
2. Export from `src/components/index.js`
3. Document props and usage
4. Use consistent styling

## Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)

## Questions?

If you have questions or need help:

- Open an issue on GitHub
- Email: dev@zeroai.com
- Check the README and DEPLOYMENT guides

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow the project guidelines

Thank you for contributing! 🚀


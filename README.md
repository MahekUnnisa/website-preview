# DevBytes Website

Landing page for DevBytes - an AI-powered Chrome extension that helps developers manage their calendar, tasks, and notes. Built with React and Tailwind CSS, featuring a clean dark theme with purple accents.

## 🚀 Features

- **React 19** - Latest version of React with modern hooks
- **Tailwind CSS** - Utility-first CSS framework with custom theme
- **React Router** - Client-side routing for smooth navigation
- **Vite** - Lightning-fast build tool and dev server
- **Docker** - Optimized multi-stage Docker build
- **Responsive Design** - Mobile-first approach
- **Custom Theme** - Purple-based dark theme with smooth animations

## 📦 Pages

- **Home** - Hero section showcasing DevBot's features (Calendar, Tasks, Notes, TL;DR, Search)
- **About** - DevBytes story, values, development timeline, and team
- **Contact** - Contact form for feedback, bugs, and questions
- **Privacy Policy** - Privacy policy for the extension
- **Terms of Service** - Terms and conditions

## 🛠️ Tech Stack

- React 19.2.0
- React Router DOM 7.9.5
- Tailwind CSS 3.4.17
- Vite 6.0.11
- PostCSS & Autoprefixer

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Docker

### Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

### Production Build

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Preview production build:**
   ```bash
   npm run preview
   ```

## 🐳 Docker Deployment

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t zeroai-website .

# Run the container
docker run -p 3000:80 zeroai-website
```

### Using Docker Compose

```bash
# Start the application
docker-compose up -d

# Stop the application
docker-compose down
```

The application will be available at `http://localhost:3000`

## 🎨 Customization

### Theme Colors

The custom theme colors are defined in `src/styles/themes.css` and extended in `tailwind.config.js`:

- **Primary Purple**: `#6b4ce8`
- **Purple Scale**: 50-800 variants
- **Background Colors**: Dark theme gradients
- **Semantic Colors**: Success, Error, Warning

### Modifying Styles

- Global styles: `src/styles/index.css`
- Theme colors: `src/styles/themes.css`
- Tailwind config: `tailwind.config.js`

## 📁 Project Structure

```
zeroai-website/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Button.jsx
│   │   └── Card.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Privacy.jsx
│   │   └── Terms.jsx
│   ├── styles/
│   │   ├── index.css
│   │   └── themes.css
│   ├── App.jsx
│   └── index.jsx
├── Dockerfile
├── docker-compose.yml
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── index.html
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Environment Variables

Create a `.env` file in the root directory for any environment-specific configurations:

```env
VITE_API_URL=https://api.zeroai.com
VITE_APP_NAME=ZeroAI
```

## 🚢 Production Deployment

The Dockerfile uses a multi-stage build:

1. **Stage 1**: Builds the React application with Node.js
2. **Stage 2**: Serves the static files with Nginx

This results in a minimal production image (~25MB) with optimized performance.

## 🔒 Security Features

- Security headers configured in Nginx
- XSS protection
- Content-Type nosniff
- Frame options
- Gzip compression enabled

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- **Mahek Unnisa** - *Creator & Developer*

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Vite for the lightning-fast build tool


# HealVirtue Healthcare Platform

A modern React.js application for a maternal and child healthcare organization, built with best practices and a component-driven architecture.

## Project Overview

HealVirtue is a healthcare platform designed to improve maternal and child health outcomes through education, awareness, and accessible healthcare services. This frontend application provides a responsive and accessible user interface that showcases the organization's mission, services, and contact information.

## Technology Stack

- **React**: Framework for building the user interface
- **React Router**: Routing and navigation
- **TailwindCSS**: Utility-first CSS framework for styling
- **React Hooks**: State management and component lifecycle

## Project Structure

```
src/
├── assets/            # Static assets (images, videos)
├── components/        # Reusable UI components
│   ├── common/        # Base components (Button, Input, Card)
│   ├── layout/        # Layout components (Navbar, Footer, Section)
│   ├── sections/      # Page-specific section components
│   └── utils/         # Utility components
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # API and external service integrations
├── styles/            # Global styles and theme configuration
├── utils/             # Utility functions
├── context/           # React context providers
├── routes/            # Routing configuration
└── constants/         # Application constants
```

## Key Features

- **Component-Driven Development**: Modular components designed for reusability and composition
- **Responsive Design**: Mobile-first approach with adaptive layouts for all device sizes
- **Accessibility**: WCAG-compliant components with proper aria attributes and keyboard navigation
- **Performance Optimization**: Code splitting with React.lazy and Suspense for improved loading times
- **Custom Hooks**: Abstracted logic for reactive behavior and state management

## Component Architecture

The project follows a hierarchical component structure:

1. **Base Components**: Fundamental UI elements like Button, Input, and Card
2. **Layout Components**: Structural elements like Navbar, Footer, and Section
3. **Section Components**: Content-specific components for homepage sections
4. **Page Components**: Complete page layouts that compose various components

## Best Practices Implemented

### Code Quality and Maintainability

- Consistent naming conventions
- PropTypes for type checking
- JSDoc comments for documentation
- Component organization by feature and function

### Performance

- Lazy loading of routes
- Optimized image assets
- Efficient rendering with hooks
- Memoization of expensive calculations

### Accessibility

- Semantic HTML structure
- ARIA attributes
- Keyboard navigation support
- Color contrast compliance

### State Management

- Local component state with useState
- Custom hooks for reusable logic
- Context API for global state when needed

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/healvirtue-frontend.git
   cd healvirtue-frontend
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server

   ```bash
   npm start
   # or
   yarn start
   ```

4. Open your browser and navigate to <http://localhost:3000>

## Build for Production

```bash
npm run build
# or
yarn build
```

## Deployment

The application can be deployed to various platforms:

- **Netlify**: Connect your GitHub repository for continuous deployment
- **Vercel**: Similar to Netlify with GitHub integration
- **AWS S3/CloudFront**: For more complex infrastructure requirements

## Contribution Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- TailwindCSS for the utility-first CSS framework
- React team for the amazing library
- All contributors who have helped shape this project

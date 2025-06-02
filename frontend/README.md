# Medicine Recommendation System Frontend

This is the frontend application for the Medicine Recommendation System, built with React, TypeScript, and Vite.

## Features

- User authentication with session management
- Disease prediction interface
- Prediction history visualization
- Profile management with avatar upload
- Responsive and modern UI design

## Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/namansingh1314/medbud-jtp.git
cd Medicine-Recommendation-System/Frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the Frontend directory with the following content:
```env
VITE_APP_API_URL=http://localhost:5000
```

## Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

To preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
src/
├── assets/         # Static assets (images, icons)
├── components/     # Reusable React components
├── contexts/       # React context providers
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── services/       # API services
├── styles/         # Global styles and themes
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Key Features Implementation

### Authentication
- Session-based authentication
- Protected routes with React Router
- Persistent login state

### Disease Prediction
- Interactive symptom selection
- Real-time prediction results
- Comprehensive disease information display

### Profile Management
- User profile updates
- Avatar image upload
- Prediction history tracking

## Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful component documentation

### State Management
- Use React Context for global state
- Implement proper loading states
- Handle error states appropriately

### Testing
- Write unit tests for components
- Test error handling scenarios
- Verify form validations

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## Troubleshooting

### Common Issues

1. **Backend Connection Issues**
   - Verify the backend server is running
   - Check VITE_APP_API_URL in .env
   - Ensure CORS is properly configured

2. **Build Errors**
   - Clear node_modules and reinstall
   - Verify TypeScript configurations
   - Check for dependency conflicts

3. **Authentication Issues**
   - Clear browser storage
   - Verify session handling
   - Check network requests

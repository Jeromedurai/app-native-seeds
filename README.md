# Himalaya E-commerce Application

A modern, responsive e-commerce application built with React 18, TypeScript, and Tailwind CSS.

## Features

- **Modern Tech Stack**: React 18, TypeScript, Tailwind CSS
- **Responsive Design**: Mobile-first approach with beautiful UI
- **State Management**: Context API with useReducer for global state
- **Routing**: React Router v6 for client-side navigation
- **Custom Hooks**: Reusable hooks for API calls, localStorage, and debouncing
- **Error Handling**: Error boundaries for graceful error handling
- **Loading States**: Smooth loading indicators throughout the app
- **Dynamic Navigation**: API-driven menu system with dropdown support
- **Mock Data**: Ready-to-use mock data for development

## Dynamic Menu System

The application features a fully dynamic navigation menu system that is generated from API responses. This allows for flexible menu management without hardcoding navigation items.

### Menu API Structure

The menu system expects an API response in the following format:

```json
{
  "menuMaster": [
    {
      "menuId": 1,
      "menuName": "Home",
      "orderBy": 1,
      "active": true,
      "image": "",
      "subMenu": false,
      "category": []
    },
    {
      "menuId": 2,
      "menuName": "Seed",
      "orderBy": 2,
      "active": true,
      "image": "",
      "subMenu": true,
      "category": [
        {
          "categoryId": 1,
          "category": "All Seed",
          "active": true
        },
        {
          "categoryId": 2,
          "category": "Vegetable",
          "active": true
        }
      ]
    }
  ]
}
```

### Key Features

- **Dynamic Generation**: Navigation menus are generated based on API response
- **Hierarchical Structure**: Support for main menus and sub-menus
- **Active State Management**: Only active menu items are displayed
- **Automatic Sorting**: Menu items are sorted by `orderBy` field
- **Responsive**: Works on both desktop and mobile with dropdown functionality
- **Route Generation**: Automatic route path generation based on menu names

### Implementation Details

1. **Types**: TypeScript interfaces for `MenuItem`, `MenuCategory`, and `MenuMaster`
2. **Context**: Menu data managed in AppContext and fetched on app initialization
3. **Components**: Layout component renders navigation dynamically
4. **Routes**: App component includes routes for all menu items
5. **Utils**: Helper functions for route path generation

### Menu Item Properties

- `menuId`: Unique identifier for the menu item
- `menuName`: Display name for the menu
- `orderBy`: Sorting order for menu items
- `active`: Whether the menu item should be displayed
- `image`: Optional image URL for menu icon
- `subMenu`: Boolean indicating if menu has sub-items
- `category`: Array of sub-menu items (if `subMenu` is true)

### Adding New Menu Items

To add new menu items, simply update the API response. The system will automatically:
- Generate new navigation items
- Create appropriate routes
- Handle dropdown functionality
- Update footer links

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary.tsx
│   ├── Layout.tsx
│   └── LoadingSpinner.tsx
├── context/            # Context API for state management
│   └── AppContext.tsx
├── endpoint/           # API endpoint configurations
│   └── index.ts
├── hooks/              # Custom React hooks
│   ├── useApi.ts
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── pages/              # Page components
│   └── Home.tsx
├── services/           # API services and mock data
│   ├── api.ts
│   └── mockData.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── index.ts
└── App.tsx             # Main application component
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd app-himalaya
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (irreversible)

## Key Components

### Context API (AppContext)
- Manages global application state
- Handles user authentication
- Manages shopping cart functionality
- Provides product and menu data to components

### Custom Hooks
- `useApi`: Generic hook for API calls with loading states
- `useLocalStorage`: Hook for persisting data to localStorage
- `useDebounce`: Hook for debouncing values and callbacks

### Error Boundaries
- Catches JavaScript errors in component tree
- Displays fallback UI when errors occur
- Logs errors for debugging

### Responsive Design
- Mobile-first approach using Tailwind CSS
- Responsive navigation and layout
- Optimized for all screen sizes

## TypeScript Types

The application uses comprehensive TypeScript types for:
- Product and cart item structures
- User authentication
- API responses
- Application state
- Menu system structure

## Mock Data

The application includes mock data for development:
- Sample products with images from Unsplash
- Categories and product details
- Simulated API response delays
- Dynamic menu structure with seed and plant categories

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Mobile-first**: Responsive design approach
- **Dark mode ready**: CSS variables for easy theming
- **Consistent spacing**: Using Tailwind's spacing scale

## Future Enhancements

- [ ] User authentication system
- [ ] Product search and filtering
- [ ] Shopping cart persistence
- [ ] Order management
- [ ] Payment integration
- [ ] Admin dashboard for menu management
- [ ] Product reviews and ratings
- [ ] Wishlist functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please create an issue in the repository.

# Restaurant Frontend

This project is a React application built with Vite for managing restaurants and their reservations. It provides two main pages:

- **Restaurants**: administration interface to list, create, edit and delete restaurants.
- **Reservations**: allow users to create new reservations and view existing ones.

The UI is built using [Material UI](https://mui.com/) components and routing is handled with `react-router-dom`.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` by default.

## Scripts

- `npm run dev` – start the development server with hot reload.
- `npm run build` – build the project for production.
- `npm run preview` – preview the production build locally.
- `npm run lint` – run ESLint over the source files.


## Project Structure

```
src/
├── App.jsx                # Application routes
├── App.css
├── main.jsx               # Entry point
├── assets/                # Static assets
├── components/            # Reusable components
│   ├── Navbar.jsx
│   └── reservations/
│       ├── ReservationCard.jsx
│       └── ReservationList.jsx
├── pages/                 # Page components
│   ├── RestaurantsPage.jsx
│   └── ReservationsPage.jsx
└── services/
    └── api.js             # Axios API client
```

API requests are configured in `src/services/api.js` to communicate with a backend service running on `http://127.0.0.1:5000`.


## Development Notes

- The project uses React 19 and Vite 7.
- Material UI components are used for styling and layout.
- The ESLint configuration can be found in `eslint.config.js`.
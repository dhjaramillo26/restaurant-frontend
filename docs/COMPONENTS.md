# Component Overview

This file provides a brief description of the main React components and pages found in the `src` directory.

## Components

### `Navbar.jsx`
Top navigation bar with links to the Restaurants and Reservations pages.

### `reservations/ReservationCard.jsx`
Card component that shows the details of a single reservation and allows deleting it.

### `reservations/ReservationList.jsx`
Grid layout that renders a list of `ReservationCard` components.

## Pages

### `RestaurantsPage.jsx`
Admin page that lets you list all restaurants, filter them, and perform CRUD operations.

### `ReservationsPage.jsx`
Page to create a new reservation and view/delete existing reservations.

## Services

### `services/api.js`
Axios client with helper functions to call the backend API (`/restaurants` and `/reservations`).
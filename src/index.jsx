import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { CreditsPage, ErrorPage, HomePage, InstructionsPage, MapPage, SearchPage } from './pages';
import { Root } from './Root';

import './index.css';

/**
 * Utility function to GET data formatted as JSON from a passed URL.
 *
 * @param {string} url The URL to fetch
 * @returns {object} The returned JSON as a javascript object
 */
const fetchData = (url) => fetch(url).then((res) => res.json());

/**
 * Async Promise-based function to load all data required for the map and search pages.
 *
 * @returns {Array<object>} Asynchronously fetched array of objects with map/search data.
 */
const fetchMapData = async () =>
  await Promise.all([
    fetchData('data/authors.json'),
    fetchData('data/places.json'),
    fetchData('data/itineraries.json'),
  ]);

const router = createHashRouter([
  {
    element: <Root />,
    errorElement: <ErrorPage />,
    id: 'root',
    loader: fetchMapData,
    path: '/',
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'credits',
        element: <CreditsPage />,
      },
      {
        path: 'instructions',
        element: <InstructionsPage />,
      },
      {
        path: 'intersections',
        element: <MapPage />,
      },
      {
        path: 'trajectories',
        element: <MapPage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

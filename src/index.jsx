import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CreditsPage, ErrorPage, HomePage, InstructionsPage, MapPage, SearchPage } from './pages';
import { Root } from './Root';

import './index.css';

const fetchData = (url) => fetch(url).then((res) => res.json());

const fetchMapData = async () =>
  await Promise.all([
    fetchData('data/authors.json'),
    fetchData('data/places.json'),
    fetchData('data/itineraries.json'),
  ]);

const router = createBrowserRouter(
  [
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
  ],
  // optionally configure a basename that is not the root URL, such as "/itsb/"
  // see https://reactrouter.com/en/6.4.3/routers/create-browser-router#basename
  { basename: import.meta.env.VITE_BASENAME || '' }
);

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

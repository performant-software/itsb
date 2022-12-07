import { Header } from '../../components';
import { useRouteError } from 'react-router-dom';

/**
 * Error page using React Router to handle known errors, with static defaults.
 * Will not render in <Outlet> so requires its own Header.
 *
 * @returns {React.ReactElement} Error page React functional component
 */
export function ErrorPage() {
  const error = useRouteError();
  return (
    <>
      <Header />
      <main id="error">
        <article>
          <h2>{`${error.status || 500} ${error.statusText || 'Internal Server Error'}`}</h2>
          <p>This page could not be displayed.</p>
        </article>
      </main>
    </>
  );
}

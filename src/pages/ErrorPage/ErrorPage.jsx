import { Header } from '../../components';
import { useRouteError } from 'react-router-dom';

export function ErrorPage() {
  const error = useRouteError();
  return (
    <>
      <Header />
      <main id="error">
        <h2>{`${error.status} ${error.statusText}`}</h2>
        <p>This page could not be displayed.</p>
      </main>
    </>
  );
}

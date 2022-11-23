import { ITSBSearchHandler } from './ITSBSearchHandler';
import { ITSBGraphProvider } from './ITSBGraphProvider';

/**
 * The Store is a Peripleo-specific abstraction. It represents
 * the domain model of the application - in our case, a graph of
 * Authors, Places and Waypoints.
 *
 * To separate concerns, we split the Store into two sub-components:
 * the ITSBGraphProvider and the ITSBSearchHandler.
 *
 * - The ITSBGraphProvider holds our domain model, and provides basic
 *   query and retrieval functions.
 *
 * - The ITSBSearchHandler 'translates' between our domain model (which
 *   is completely specific to ITSB) and the Peripleo search interface
 *   (which has a predefined, generic structure).
 *
 * @param {*} props
 * @returns {ReactElement}
 */
export const ITSBStore = (props) => {
  return (
    <ITSBGraphProvider {...props}>
      <ITSBSearchHandler>{props.children}</ITSBSearchHandler>
    </ITSBGraphProvider>
  );
};

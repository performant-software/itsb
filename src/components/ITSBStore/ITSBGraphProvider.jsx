import { useState, useEffect } from 'react';
import { GraphContext } from '@peripleo/peripleo';
import { ITSBGraph } from './itsbGraph';

/**
 * @typedef {object} ITSBGraphProviderProps
 * @property {object[]} authors the list of authors
 * @property {object[]} places this list of places
 * @property {object[]} itineraries the list of itineraries
 *
 * The ITSBGraphProvider exposes the ITSB graph as global context.
 * @param {ITSBGraphProviderProps} props the component props
 * @returns {React.ReactElement} the React element
 */
export const ITSBGraphProvider = (props) => {
  const [graph, setGraph] = useState();

  useEffect(() => {
    const { authors, places, itineraries } = props;

    if (authors && places && itineraries) {
      const g = new ITSBGraph();
      g.init(authors, places, itineraries);
      setGraph(g);
    }
  }, [props.authors, props.places, props.itineraries]);

  return <GraphContext.Provider value={graph}>{graph && props.children}</GraphContext.Provider>;
};

import { useState, useEffect } from 'react';
import { GraphContext } from '@peripleo/peripleo';
import { ITSBGraph } from './itsbGraph';

/**
 * The ITSBGraphProvider exposes the ITSB graph as global context.
 *
 * @param {*} props
 * @returns {ReactElement}
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

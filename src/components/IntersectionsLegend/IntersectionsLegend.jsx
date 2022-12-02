import { useState } from 'react';
import './IntersectionsLegend.css';

/**
 * A legend for the intersections visualization, adapted from the original ITSB project.
 *
 * @returns {ReactElement} Legend React functional component
 */
export function IntersectionsLegend() {
  const [visible, setVisible] = useState(true);
  return (
    <legend id="intersection-legend" className={visible ? 'visible' : 'hidden'}>
      <h2>Legend</h2>
      <button type="button" onClick={() => setVisible(false)} aria-hidden="true">
        (click to close)
      </button>
      <p>Rings indicate possible intersections.</p>
      <svg viewBox="-1 -1 14 14" xmlns="http://www.w3.org/2000/svg">
        <title>A graphic of concentric rings representing possible intersections</title>
        <circle className="outer" cx={6} cy={6} r={6}></circle>
        <circle className="middle" cx={6} cy={6} r={4}></circle>
        <circle className="inner" cx={6} cy={6} r={2}></circle>
      </svg>
      <p>Solid circles indicate definite intersections.</p>
      <svg viewBox="-1 -1 14 14" xmlns="http://www.w3.org/2000/svg">
        <title>A graphic of a single solid circle representing a definite intersection</title>
        <circle className="inner" cx={6} cy={6} r={6}></circle>
      </svg>
    </legend>
  );
}

import { formatInterval } from '../../components/ITSBStore/utils';

/**
 * @typedef {object} SearchResultProps
 * @property {object} data the search result data
 * @property {ITSBGraph} graph the ITSB graph
 *
 * A single search result in the the search results list.
 * @param {SearchResultProps} props the component props
 * @returns {React.ReactElement} the React element
 */
export const SearchResult = (props) => {
  const { data, graph } = props;

  return (
    <div className={data.type}>
      {data.type === 'waypoint' && (
        <div className="search-result">
          <h3 className="title">{graph.getNode(data.author).name}</h3>
          <h4 className="subhead">
            {data.title} <span className="time">({formatInterval(data)})</span>
          </h4>
          <p className="description">{data.relation.label}</p>
        </div>
      )}
    </div>
  );
};

import { formatInterval } from '../../components/ITSBStore/utils';

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

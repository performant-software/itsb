import { useGraph, useSearch } from '@peripleo/peripleo';

import './AuthorSelect.css';

export const AuthorSelect = () => {
  const authors = useGraph().listAuthors();

  const { search, setFilter } = useSearch();

  const selected = search.args.filters?.find((f) => f.name === 'authors')?.values || [];

  const toggleAuthor = (id) => () => {
    const updated = selected.includes(id) ? selected.filter((i) => i !== id) : [...selected, id];

    setFilter({ name: 'authors', values: updated });
  };

  /**
   * Behavior: clicking the button will select ALL AUTHORS, unless
   * all authors are already selected. If all are selected, this button
   * deselects all.
   */
  const toggleAll = () => {
    if (selected.length < authors.length) {
      setFilter({ name: 'authors', values: authors.map((a) => a.id) });
    } else {
      setFilter({ name: 'authors', values: [] });
    }
  };

  return (
    <div className="author-select">
      <h2>
        <span>Select Authors</span>
        <button className="select-all" onClick={toggleAll}>
          <span>Select all</span>
        </button>
      </h2>

      <ul>
        {authors.map((author) => (
          <li key={author.id}>
            <input
              type="checkbox"
              id={`${author.id}-checkbox`}
              name={author.id}
              checked={selected.includes(author.id)}
              onChange={toggleAuthor(author.id)}
            />

            <label
              htmlFor={`${author.id}-checkbox`}
              style={{
                '--color': `rgba(${author.color.join(',')})`,
              }}
            >
              {author.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

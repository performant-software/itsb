import { useGraph, useSearch } from '@peripleo/peripleo';

import './AuthorSelect.css';

export const AuthorSelect = () => {

  const authors = useGraph().listAuthors();

  const { search, setFilter } = useSearch();

  const selected = 
    search.args.filters?.find(f => f.name === 'authors')?.values || [];

  const toggleAuthor = id => () => {
    const updated = selected.includes(id) ?
      selected.filter(i => i !== id) : [ ...selected, id ]; 

    setFilter({ name: 'authors', values: updated });
  }

  return (
    <ul className="author-select">
      {authors.map(author => (
        <li key={author.id}>
          <input
            type="checkbox"
            id={`${author.id}-checkbox`}
            name={author.id}
            checked={selected.includes(author.id)}
            onChange={toggleAuthor(author.id)} />

          <label
            htmlFor={`${author.id}-checkbox`}
            style={{
              color: `rgba(${author.color.join(',')})`
            }}>

            {author.name}
          </label>
        </li>
      ))}
    </ul>
  )
}
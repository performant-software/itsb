const AuthorSelect = ({ authors, selectedAuthors, onChange }) => (
    <fieldset id="author-select" style={{ marginTop: "30px" }}>
        {authors?.itemListElement &&
            authors.itemListElement.map((author) => (
                <div key={author["@id"]}>
                    <input
                        type="checkbox"
                        id={`${author["@id"]}-checkbox`}
                        name={author["@id"]}
                        checked={selectedAuthors.includes(author["@id"])}
                        onChange={() => onChange(author)}
                    />
                    <label
                        htmlFor={`${author["@id"]}-checkbox`}
                        style={{
                            color: `rgba(${author["color"].join(", ")})`,
                        }}
                    >
                        {author.name}
                    </label>
                </div>
            ))}
    </fieldset>
);

export default AuthorSelect;

export const getColor = ({ authors, author }) => {
    // get the color for an author
    // TODO: maybe figure out a better way of storing/generating? color
    if (authors?.itemListElement)
        return authors.itemListElement.find((a) => a["@id"] === author).color;
};

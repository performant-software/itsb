# In The Same Boats

A React rewrite of the [_In The Same Boats_](https://github.com/elotroalex/itsb/tree/main) (ITSB) project, which maps the movements of significant cultural actors from the Caribbean and wider Americas, Africa, and Europe within the 20th century Afro-Atlantic world.

This version of _In The Same Boats_ is built on the [Linked Places](https://github.com/LinkedPasts/linked-places-format) and [Linked Traces](https://github.com/LinkedPasts/linked-traces-format) standards for representing historical and geographical data, and makes use of the [Peripleo](https://github.com/peripleo/peripleo) and [Deck.GL](https://github.com/visgl/deck.gl) libraries for search and interactive visualization.

For more information and credits, visit the current deployment of [_In The Same Boats_](https://performant-software.github.io/itsb/).

## Usage

### Requirements

- Python v3.9+
- Node.JS v16
- NPM v8

### Data generation

This project takes CSV files in the format created by contributors to the original ITSB project, and converts them to Linked Places and Linked Traces JSON-formatted records.

Each CSV file representing an author's movements should be placed in `/script/in/movements`, while any additional places should be appended to `/script/in/places/ITSB Place Names - Places.csv`.

Then, the following script can be run to convert the CSV formatted data into JSON:

```sh
cd script
python ./convertJSON.py
```

This will save updated data JSON files to `/public/data`, from where they are served statically and used in the React application. This script will also print warnings and errors about missing or malformed data.

### Installation

To install NPM dependencies, run the following script from the project root:

```sh
npm install
```

### Build for production

This project uses [Vite](https://vitejs.dev/) to build a static bundle that can be deployed to a server. To generate a static build output to `/dist`:

```sh
npm run build
```

You can also preview the built bundle using:

```sh
npm run preview
```

In this mode, Vite will launch a development server which serves the built assets from the `/dist` folder.

### Deploy

A build of _In The Same Boats_ created using the above steps can be deployed with minimal configuration; for an example build, see the `gh-pages` branch of this repo and its resulting deployment [here](https://performant-software.github.io/itsb/).

We have configured a GitHub Workflow, stored at `/.github/workflows/gh-pages.yml`, to automatically build and deploy ITSB to this repo's GitHub Pages instance upon any push to the `main` branch.

## Development

### Run in development

This project uses [Vite](https://vitejs.dev/) to enable hot-module reloading during development. To start a development build served over `localhost:5173`, run the following from the project root:

```sh
npm start
```

This build will refresh automatically as you save local changes to code in the `/src` directory.

### Unit tests

Unit tests are written using [Vitest](https://vitest.dev/) and stored alongside components in `*.test.js` files, and the entire test suite can be run with the following script from the root directory:

```
npm test
```

A GitHub Workflow is also configured to run unit tests on each push to any branch in this repo.

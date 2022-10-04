# In The Same Boats

## Development notes

### Peripleo

Currently requires Peripleo to be installed in `../peripleo` relative to the root of this project.

You may also have to point the packages it shares with this project (`react`, `react-dom`, and `react-map-gl`) to this project's `node_modules` in Peripleo's `package.json` before installing Peripleo.

### Data generation

To generate JSON Linked Data from CSV files:

```sh
cd script
python ./convertJSON.py
```

### Installation

To install NPM packages:

```sh
npm install
```

### Run in development

To start a hot-module-reloading build served over `localhost:1234`:

```sh
npx parcel src/index.html
```

### Build for production

To generate a static build output to `/dist`:

```sh
npx parcel build src/index.html
```

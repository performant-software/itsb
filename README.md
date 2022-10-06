# In The Same Boats

## Development notes

### Peripleo

Currently requires Peripleo to be installed in `../peripleo` relative to the root of this project.

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

To start a hot-module-reloading build served over `localhost:5173`:

```sh
npm start
```

### Build for production

To generate a static build output to `/dist`:

```sh
npm run build
```

You can also preview the built bundle using:

```sh
npm run preview
```

In this mode, Vite will launch a development server which serves the built assets from the `/dist` folder.

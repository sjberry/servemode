# servemode #
Servemode is a simple library to serve up content locally for local development purposes.


### web ###
Servemode comes with a flexible local API development and testing server built on the `loopback` npm library. This development server is for testing basic CRUD operations on REST resources whose URL patterns are predictable constructed.

The LoopBack test server uses some default configurations internally, but can be externally configured with NodeJS compliant JS modules or JSON files. There are example configurations of each of the acceptable forms in the `tests/server` directory. The configurable settings are:
* **port** &ndash; The port that the local server will listen on.
  **Default:** 3000
* **models** &ndash; A list of models to serve on the API server.
  **Default:** Empty array (`[]`)

The test server can be run from the command line through node with:

```servemode api [options]```

The server will then listen on the specified or default port and log connections to stdout. The server can be closed by using the standard <kbd>CTRL</kbd>+<kbd>C</kbd> escape sequence.


### web ###
Servemode comes with a small local development and testing server built on the `express` npm library. This development server is mainly used for fat-fingering console tests and tracing through code using the browsers' excellent breakpoint systems.

The Express test server uses some default configurations internally, but can be externally configured with NodeJS compliant JS modules or JSON files. There are example configurations of each of the acceptable forms in the `tests/server` directory. The configurable settings are:
* **port** &ndash; The port that the local server will listen on.
  **Default:** 5000
* **staticRoot** &ndash; The root directory for static files.
  **Default:** The directory containing `web.js`
* **scripts** &ndash; A list of static scripts to serve on the index page (`/`) of the running server. These files should be relative to `staticRoot` and should be formatted with forward slashes for directory shifts according to the HTML standard since the strings are reproduced verbatim in the served HTML template on the index page.
  **Default:** Empty array (`[]`)
* **styles** &ndash; A list of static styles to serve on the index page (`/`) of the running server. These files should be relative to `staticRoot` and should be formatted with forward slashes for directory shifts according to the HTML standard since the strings are reproduced verbatim in the served HTML template on the index page.
  **Default:** Empty array (`[]`)

The test server can be run from the command line through node with:

```servemode web [options]```

The server will then listen on the specified or default port and log connections to stdout. The server can be closed by using the standard <kbd>CTRL</kbd>+<kbd>C</kbd> escape sequence.

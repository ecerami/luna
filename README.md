## Luna: Single Cell Viewer

Luna is a tool for publishing single cell data with highlighted observations and findings.

## Current Status

The tool is being developed as part of the Human Tumor Atlas Network (HTAN) and is currently in alpha.  

## Overview

Luna takes in two sets of files:

* A single cell data file in h5ad format.
* A Luna config file.  This config file contains vignettes that you want to highlight when publishing your data.

The buildLuna.py script takes these two files and generates a set of JSON files that can be used for deployment.

![screenshot_371](https://user-images.githubusercontent.com/1009066/81432352-bfc46b80-9130-11ea-8cc8-2ead3d0790de.png)

## To Run

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


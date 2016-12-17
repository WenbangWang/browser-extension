#Tasks
 - `lint` lints all javascript files includes `src` files, `test` files and `grunt` task files.
 - `dev:app` serves up application separately together with a stub server which uses as backend service and uses a mocked browser extension API to mock browser behaviors. 
 - `dev:extension` packages everything together into a manifest to be ready to deploy to browser and also serves up a stub server. 
 - `test` runs all the tests and outputs coverage matrix. 
 - `test:coverage` runs `test` and also checks coverage threshold which will fail the check if it is not reached. 

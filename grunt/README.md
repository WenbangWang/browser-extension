# Tasks
 - `lint` lints all javascript files includes `src` files, `test` files and `grunt` task files.
 - `dev:app` serves up application separately together with a stub server (`localhost:9090`) which uses as backend service and uses a mocked browser extension API to mock browser behaviors. 
 - `dev:extension` packages everything together into a manifest to be ready to deploy to browser and also serves up a stub server. The stub server will be served on `http` with a sef-signed certificate due to the content security policy within browser extension environment. In order to be able to talk between browser extension and stub server, you need to go to `https://localhost:9090` and trust the certificate first before proceed.
 - `test` runs all the tests and outputs coverage matrix. 
 - `test:coverage` runs `test` and also checks coverage threshold which will fail the check if it is not reached. 

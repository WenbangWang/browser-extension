**PLEASE update the documentation (includes jsdoc) accordingly when you make any changes to the code!!!**<br/>
**PLEASE update the documentation (includes jsdoc) accordingly when you make any changes to the code!!!**<br/>
**PLEASE update the documentation (includes jsdoc) accordingly when you make any changes to the code!!!**<br/>

# Setup

## Install Dependencies

Go to terminal and use `npm install` to install all the dependencies. 

## Task Runner

The project uses `grunt` as the task runner and `webpack` to package javascript. `webpack` has already integrated with `grunt`. For `grunt` tasks, see [here](grunt/README.md).

There are a couple of ways to use `grunt`.
 
1. Install `grunt` cli globally using `npm install -g grunt-cli`. And you can run tasks by using `grunt` directly like `grunt ${task name}`
2. Use local installed `grunt` cli (Already installed from [here](#install-dependencies)) and run the tasks like `./node_modules/.bin/grunt ${task name}`.
3. Use shortcut in `npm scripts` which is a reference to `./node_modules/.bin/grunt` and run the tasks like `npm run grunt ${task name}`. 

Either way above works fine. Choose anyone you preferred. 

# Folder Structure

```
/grunt  - grunt tasks
/locales    - language files
/src    - source files
    /app    - application
    /browser-api    - A wrapper over browser extension api
    /browser-api-mock   - A mocked version of the api wrapper
/stub   - stub server
/test   - test folder
/webpack    - webpack config
```

# Development

## Application

### Overview
The whole application uses `angular` to build and uses HTTP request to communicate between app and server. 

### Internalization
`angular-translate` is used for i18n purpose. [I18n Config](src/app/core/config/i18n.js) for configuring all the supported languages (For now, only English), loading `*.properties` files and converting `*.properties` files into `json` (by `webpack`). 


## Extension

## Unit Test

All test files should follow the naming pattern `*.spec.js`. Otherwise, it will not be loaded into testing environment.

Run `grunt test` to test all the source files and `grunt test:coverage` to test with coverage reports generated and check coverage. It uses `karma` as the test runner, `mocha` as the test framework, `sinon` as the spy/stub lib, `chai` as the assertion lib and `istanbul` to generate and check test coverage under the hood.

The reason behind using `karma` is the app should live within a browser environment and `karma` is a good test runner to run the app within headless browser such as `PhantomJS` or normal browsers such as `Chrome` and it will take a lot of efforts to mock dependencies which already exist in a browser environment if we want to test the app in a `node` environment. A little problem when using `PhantomJS` is that it does not fully support ES6 syntax (See [here](https://github.com/ariya/phantomjs/issues/14506#issuecomment-251611067)) and `webpack` with `babel` loader comes in place to solve this problem.

Note that if you want to import an `angular` module into test context by using shortcut `module({module name})` from `angular.mock`, an `Object is not a constructor` exception will be thrown because `webpack` is overriding `module`. So instead of using `module` as a shortcut, just use `angular.mock.module({module name})` explicitly.
 
# Deployment
TBD

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
3. Use shortcut in `npm scripts` which is a reference to `./node_modules/.bin/grunt` and run the tasks like `npm run grunt ${task name}. 

Either way above works fine. Choose anyone you preferred. 

# Development

## Application


## Extension

## Unit Test

Run `grunt test` to test all the source files. It uses `mocha` and `istanbul` under the hood to test and generate test coverage. So you can also run `mocha` directly to test individual file like `./node_modules/.bin/mocha ${file path}`. 

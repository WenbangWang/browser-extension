**PLEASE update the documentation (including jsdoc) accordingly when you make any changes to the code!!!**<br/>
**PLEASE update the documentation (including jsdoc) accordingly when you make any changes to the code!!!**<br/>
**PLEASE update the documentation (including jsdoc) accordingly when you make any changes to the code!!!**<br/>

# Setup

## Install Dependencies

Go to terminal and use `yarn install` to install all the dependencies. 

## Task Runner

The project uses `grunt` as the task runner and `webpack` to package javascript. `webpack` has already integrated with `grunt`. For `grunt` tasks, see [here](grunt/README.md).

There are a couple of ways to use `grunt`.
 
1. Install `grunt` cli globally using `npm install -g grunt-cli`. And you can run tasks by using `grunt` directly like `grunt ${task name}`
2. Use local installed `grunt` cli (Already installed from [here](#install-dependencies)) and run the tasks like `./node_modules/.bin/grunt ${task name}`.
3. Use shortcut in `npm scripts` which is a reference to `./node_modules/.bin/grunt` and run the tasks like `npm run grunt ${task name}`. 

Either way above works fine. Choose anyone you preferred. 

# Folder Structure

```
/constants - Global contants
/doc - Documentation assets
/grunt  - Grunt tasks
/locales    - Language files
/src    - Source files
    /app    - Application
    /background-script  - Background script
    /browser-api    - A wrapper over browser extension api
    /browser-api-mock   - A mocked version of the api wrapper
    /constants    - Constants shared between scripts and app    
    /content-script    - Content script
    /lib    - Shared libraries
/stub   - stub server
/test   - test folder
/webpack    - webpack config
```

# Development

## Application

### Overview

The whole application uses `Vue` to build and uses HTTP to communicate between app and server.

### Config

All the app level configurations should go into [here](src/app/config.js).

You can also override the config either through compiling (Using webpack `EnvironmentPlugin`) or define a global object on `window` as `__epnExtensionConfig` with configurations you want to override. Note that if you override them in both ways, the global object on `window` will take precedence over webpack `EnvironmentPlugin`.

#### App Mode

There are two app modes defined in the config. There are certain scenarios where it is being used to let the application knows about which mode it is running on.

### Internationalization

`vue-i18n` is used for i18n purpose. [I18n Config](src/app/i18n.js) is for converting `*.properties` files into `json` (by `webpack`) and load them into `vue-i18n` context. `AppLanguageService` is the place to abstract self defined locale and browser UI locale.

### State

The application state is defined as followed: 
```json
{
  "storeState": {},
  "locale": "en"
}
``` 
On app startup, `AppStateSyncService` will retrieve the app state by API and initialize the app with it. During runtime, `AppStateSyncService` will update and persist the app state accordingly by API. The API refers to LocalStorage API in browser extension environment and GET/POST HTTP request to `/storage` to stub server in web app environment.

### Browser Extension API

As mentioned in [folder structure](#folder-structure), there is a mocked version of browser extension api which will be used when build the application as a replacement of the actual browser extension api. Every time a new browser extension api is used, a mocked version of that api needs to be created accordingly.
 
Browser extension api provides both `sync` version as well as `async` version for some methods. In order to unify apis, all the methods will use `async` version. The tricky part of using unified `async` apis is: it does not use the `errorback` style of callback, instead, it sets `runtime.lastError` when calls the callback. In order to make the apis standard across the app, a thin layer of wrapper is created for the purpose (See [here](src/app/browser)).

#### Communicate to Unreachable Browser Extension API and Content Script

There are really limited APIs available in the app runtime (only `storage`, `runtime`, `i18n` and `extension`) and we also need talking to `content_script` to prevent app from directly accessing the host page DOM. 

Fortunately, browser extension API leaves a `runtime.sendMessage` way to communicate to the outside world (extension runtime) and even better, the method has a callback which will be triggered when the message listener sends a response back. With this mechanism, we can abstract the interaction between app and browser extension API/content_script into a request/response (or client/server, RPC) pattern. Within this mode, the client AKA app does not and should not even care about where the server is and how it handles the request. 

![messaging communication](doc/images/messaging-communication.jpg)

### Logging

[js-logger](https://github.com/jonnyreeves/js-logger) is used internally. As mentioned earlier, there are two modes: app mode and extension mode. For app mode, it uses all methods `js-logger` supports and log directly to browser console. For extension mode, it will proxy the logs to `background-page` and print out there with only certain levels defined [here](src/constants/LoggerCommand.js). You can also override the log level in the `EXTENSION_CONFIG` (during compile time) or on `window[${CONFIG_OVERRIDE_KEY}]` (during runtime) by doing `logLevel: String`. 

To support more log levels, one needs to add a command [here](src/constants/LoggerCommand.js), creat a mapping between `js-logger` level and the command in the app logger and add a message handler in `background-page`.

#### Usage
```javascript
import logger from './src/app/logger'

logger.info('info')
logger.error(new Error())
// ...

// Or you can create a new logger instance.
const componentLogger = logger.getInstance('component')

// and you can use all the log methods on this instance.
```

## Extension

### Background Page

The background page or even event page which as the name indicates should be a centralized space to register and handler different events. 

This is the "`server`" part of client/server model between app and the outside world including some app-unreachable browser extension API and delegate "request" to content script for some host page DOM behaviors.

### Content Script

The content script is the script which browser extension will "insert" into (kind of) web page depends on the match rules in `manifest.json`. 

In our case, content script is mainly responsible for executing different page parsing rules on different pages. Besides parsing pages, it is also a "`server`" within the messaging client/server model. It takes delegated "request" from app through background page.

Reason not using [host page communication](https://developer.chrome.com/extensions/content_scripts#host-page-communication): it is easy to only do pub/sub but what we need is to initiate a command to the browser API to execute and most of times the command will return a result/response to the app which requires another round-trip pub/sub event. 

### Deploy Manifest and Test

1. Go to `chrome://extensions/` and check `Developer mode`.
2. Click `Load unpacked extension...`.
3. Navigate to `your_project_location/manifest`.

You only need to do the steps above for the first time, then every time afterwards, you just need to click `Reload` under the name of the extension `after a new compilation`. 

## Unit Test

All test files should follow the naming pattern `*.spec.js`. 

Run `grunt test` to test all the source files and `grunt test:coverage` to test with coverage reports generated and check coverage. 

All tests are written by `mocha` with `chai` as assertion library, `sinon` as spy and stub library together with some other plugins like `sinon-chai`. 

Most of the tests are running in `node` environment. So you can also run `mocha` directly to test individual file like `./node_modules/.bin/mocha ${file path}`. 
 
# Publish

Check [here](https://developer.chrome.com/webstore/publish) for details. What we normally will do is to push a zipped manifest (under `build/`) to Chrome Developer Portal, have it deployed to the test account and let QAs test around it before we expose it to the rest of the world. 

Note that every time you push a new version to the Portal, you need to update your manifest version as well. The versioning will follow something similar to `SemVer` which will be `${MAJOR}.${MINOR}.${PATCH}.${BUILD}`. In general, `${BUILD}` version needs to be bumped upon uploading so that we won't run out of version numbers.

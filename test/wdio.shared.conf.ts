import allure from "allure-commandline";
export const config: WebdriverIO.Config = {
  autoCompileOpts: {
    // ts-node Configurations
    // =====================
    autoCompile: true,
    // see https://github.com/TypeStrong/ts-node#cli-and-programmatic-options
    tsNodeOpts: {
      transpileOnly: true,
      project: "test/tsconfig.json",
    },
    // tsconfig-paths is only used if "tsConfigPathsOpts" are provided, if you
    //tsConfigPathsOpts: {
    //    baseUrl: './'
    //}
  },
  specs: [
    // Specify Test Files
    // ==================
    // that will be expanded). The test for each spec file will be run in a separate
    // worker process. In order to have a group of spec files run in the same worker
    //
    // If you are calling `wdio` from an NPM script (see https://docs.npmjs.com/cli/run-script),
    // then the current working directory is where your `package.json` resides, so `wdio`
    //
    "./test/specs/**/*.ts",
  ],
  exclude: [
    // 'path/to/excluded/files'
  ],
  maxInstances: 10,
  capabilities: [
    // Capabilities
    // ============
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // If you have trouble getting all important capabilities together, check out the
    // https://saucelabs.com/platform/platform-configurator
  ],
  // Test Configurations
  // ===================
  logLevel: "info", // trace | debug | info | warn | error | silent
  // Set specific log levels per logger
  // loggers:
  // - webdriver, webdriverio
  // - @wdio/devtools-service
  // - @wdio/jasmine-framework
  // - @wdio/local-runner
  // - @wdio/cli, @wdio/config, @wdio/utils
  logLevels: {
    devtools: "warn",
  },
  bail: 0, // If you only want to run your tests until a specific amount of tests have failed use

  // Set a base URL in order to shorten url command calls. If your `url` parameter starts
  // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
  // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
  // gets prepended directly.
  baseUrl: "https://example.com/",
  waitforTimeout: 10000, // Default timeout for all waitFor* commands.

  // Default timeout in milliseconds for request
  // if browser driver or grid doesn't send response
  connectionRetryTimeout: 120000,

  connectionRetryCount: 3, // Default request retries count

  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  services: [],

  framework: "jasmine", // see also: https://webdriver.io/docs/frameworks
  // specFileRetries: 1, // The number of times to retry the entire specfile when it fails as a whole
  // specFileRetriesDelay: 0, // Delay in seconds between the spec file retry attempts
  // specFileRetriesDeferred: false, // Whether or not retried specfiles should be retried immediately or deferred to the end of the queue

  // see also: https://webdriver.io/docs/dot-reporter
  reporters: [
    "dot",
    [
      "allure",
      {
        outputDir: "_results_/allure-raw",
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: true,
      },
    ],
  ],

  jasmineOpts: {
    defaultTimeoutInterval: 60000,
    // The Jasmine framework allows interception of each assertion in order to log the state of the application
    // or website depending on the result. For example, it is pretty handy to take a screenshot every time
    // an assertion fails.
    expectationResultHandler: function (passed, assertion) {},
  },

  // Hooks
  // =====
  // it and to build services around it. You can either apply a single function or an array of
  // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
  // resolved to continue.

  // onPrepare: function (config, capabilities) {},
  // onWorkerStart: function (cid, caps, specs, args, execArgv) {},
  // beforeSession: function (config, capabilities, specs, cid) {},
  // before: function (capabilities, specs) {},
  // beforeCommand: function (commandName, args) {},
  // beforeSuite: function (suite) {},
  // beforeTest: function (test, context) {},
  // beforeHook: function (test, context) {},
  // afterHook: function (
  //   test,
  //   context,
  //   { error, result, duration, passed, retries }
  // ) {},
  afterTest: async function (
    test,
    context,
    { error, result, duration, passed, retries }
  ) {
    if (!passed) {
      await browser.takeScreenshot();
    }
  },
  // afterSuite: function (suite) {},
  // afterCommand: function (commandName, args, result, error) {},
  // after: function (result, capabilities, specs) {},
  // afterSession: function (config, capabilities, specs) {},
  onComplete: function (exitCode, config, capabilities, results) {
    const reportError = new Error("Could not generate Allure report");
    const generation = allure([
      "generate",
      "_results_/allure-raw",
      "--clean",
      "--output",
      "_results_/allure-report",
    ]);
    return new Promise<void>((resolve, reject) => {
      const generationTimeout = setTimeout(() => reject(reportError), 5000);

      generation.on("exit", function (exitCode) {
        clearTimeout(generationTimeout);

        if (exitCode !== 0) {
          return reject(reportError);
        }

        console.log("Allure report successfully generated");
        resolve();
      });
    });
  },
  // onReload: function (oldSessionId, newSessionId) {},
};

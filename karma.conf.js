var webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
  config.set({

    // Add any browsers here
    // browsers: ['PhantomJS', 'Chrome'], // if you have karma-chrome-launcher installed
    browsers: ['PhantomJS'],
    frameworks: ['jasmine', 'intl-shim'],

    // The entry point for our test suite
    basePath: 'src',
    autoWatch: true,
    files: ['webpack.tests.js'],
    preprocessors: {
      // Run this through webpack, and enable inline sourcemaps
      'webpack.tests.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,
    client: {
      // log console output in our test console
      captureConsole: true
    },

    reporters: ['dots', 'junit'],
    singleRun: false, // exit after tests have completed

    junitReporter: {
      outputDir: '../',
      outputFile: 'tests_results.xml',
      suite: '', // suite will become the package name attribute in xml testsuite element
      useBrowserName: false // add browser name to report and classes names
    },

    webpackMiddleware: {
      noInfo: true
    },

    // Webpack takes a little while to compile -- this manifests as a really
    // long load time while webpack blocks on serving the request.
    browserNoActivityTimeout: 60000 // 60 seconds

  });
};

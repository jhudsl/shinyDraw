// Karma configuration
// Generated on Wed Jul 26 2017 12:31:11 GMT-0500 (CDT)

module.exports = function(config) {
  config.set({
    frameworks: ['browserify', 'mocha', 'chai'],
    plugins: [
      'karma-browserify',
      'karma-mocha',
      'karma-chai',
      'karma-chrome-launcher',
    ],
    files: ['src/*.test.js'],
    preprocessors: {
      'src/*.test.js': ['browserify'],
    },
    browserify: {
      debug: true,
      transform: ['babelify'],
    },
    reporters: ['progress'],
    port: 9876, // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['Chrome'],
    autoWatch: false,
    // singleRun: false, // Karma captures browsers, runs the tests and exits
    concurrency: Infinity,
  });
};

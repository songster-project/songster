module.exports = function ( karma ) {
  karma.set({
    /**
     * From where to look for files, starting with the location of this file.
     */
    basePath: '../',

    /**
     * This is the list of file patterns to load into the browser during testing.
     */
    files: [
      <% scripts.forEach( function ( file ) { %>'<%= file %>',
      <% }); %>
      'src/**/module.js',
      'src/**/*.js',
      'src/**/*.coffee',
    ],
    exclude: [
      'src/assets/**/*.js'
    ],
    frameworks: [ 'jasmine' ],
      plugins
  :
  ['karma-jasmine', 'karma-phantomjs-launcher', 'karma-coffee-preprocessor', 'karma-htmlfile-reporter', 'karma-story-reporter', 'karma-junit-reporter', 'karma-coverage'],
    preprocessors: {
      '**/*.coffee': 'coffee',
        'src/**/*.js': 'coverage'
    },

    /**
     * How to report, by default.
     */
  reporters: ['story', 'progress', 'dots', 'html', 'junit', 'coverage'],

      htmlReporter
  :
  {
    outputFile: 'out/test/frontend/units.html'
  }
  ,

  junitReporter: {
    outputFile: 'out/test/frontend/test-results.xml',
        suite
  :
    ''
  }
  ,
  coverageReporter: {
    type : 'html',
    dir : 'frontend_coverage/'
  },
    /**
     * On which port should the browser connect, on which port is the test runner
     * operating, and what is the URL path for the browser to use.
     */
    port: 9018,
    runnerPort: 9100,
    urlRoot: '/',

    /**
     * Disable file watching by default.
     */
    autoWatch: false,

    /**
     * The list of browsers to launch to test on. This includes only "Firefox" by
     * default, but other browser names include:
     * Chrome, ChromeCanary, Firefox, Opera, Safari, PhantomJS
     *
     * Note that you can also use the executable name of the browser, like "chromium"
     * or "firefox", but that these vary based on your operating system.
     *
     * You may also leave this blank and manually navigate your browser to
     * http://localhost:9018/ when you're running tests. The window/tab can be left
     * open and the tests will automatically occur there during the build. This has
     * the aesthetic advantage of not launching a browser every time you save.
     */
    browsers: [
      'PhantomJS'
    ]
  });
};

exports.config = {
  output: './functional/output',
  helpers: {
    Puppeteer: {
      url: 'http://localhost:3003',
      show: false,
      restart: false,
      waitForAction: 1000,
      keepBrowserState: true,
      uniqueScreenshotNames: true,
      waitForTimeout: 11000,
      waitForNavigation: 'domcontentloaded',
      windowSize: '1425x710',
      chrome: {args: ['--no-sandbox']}
    },
    Assertions: {require: './functional/helpers/assertions_helper.js'},
    DataHelper: {require: './functional/helpers/data_helper.js'},
    Editor: {require: './functional/helpers/editor_helper.js'}
  },
  include: {
    I: './functional/stepDefinitions/steps_file.js',
    articlePage: './functional/pages/Article.js',
    fieldPage: './functional/pages/Field.js',
    loginPage: './functional/pages/Login.js',
    mediaPage: './functional/pages/Media.js',
    profilePage: './functional/pages/Profile.js'
  },
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: {verbose: false, steps: true}
      },
      mochawesome: {
        stdout: './functional/output/console.log',
        options: {reportDir: './functional/output', reportFilename: 'report'}
      }
    }
  },
  bootstrap: './functional/setup.js',
  teardown: './functional/setup.js',
  hooks: [],
  multiple: {
    basic: {browsers: ['chrome', 'firefox']},
    parallel: {chunks: 2, browsers: ['chrome']}
  },
  plugins: {
    allure: {outputDir: './functional/output/allure', enabled: false},
    screenshotOnFail: {enabled: true},
    customEvents: {require: './functional/events/index', enabled: true}
  },
  tests: './functional/features/*/*_test.js',
  _tests: './functional/features/*/*_test.js',
  timeout: 10000,
  name: 'test'
}

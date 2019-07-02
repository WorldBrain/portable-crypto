const os = require('os')
const path = require('path')

let browsers = ['ChromeHeadless', 'FirefoxHeadless'];
// if (process.platform === 'darwin') {
//   browsers.push('Safari');
// } else if (process.platform === 'win32' && os.release().slice(3) === '10.') {
//   browsers.push('Edge');
// }

module.exports = function(config) {
  config.set({
    frameworks: ['mocha'],
    files: [
      'ts/*.webtest.ts'
    ],
    preprocessors: {
      'ts/*.ts': ['webpack']
    },
    webpack: {
      mode: 'none',
      node: false,
      resolve: {
      //   root: path.join(__dirname, 'ts'),
        extensions: [ '.js', '.ts' ]
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            loader: 'ts-loader',
            include: path.join(__dirname, 'ts'),
            exclude: path.join(__dirname, 'node_modules')
          },
        ]
      }
    },
    plugins: [
      'karma-webpack',
      'karma-mocha',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    // config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers,
    customLaunchers: {
      FirefoxHeadless: {
        base: 'Firefox',
        flags: ['-headless']
      },
    }
  })
}

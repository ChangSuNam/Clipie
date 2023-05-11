# Prerequisites

Chrome browser needed run and test the extension.
On Chrome, go to : chrome://extensions/ , and click "Load unpacked". Then load the "/src" directory.
For testing, install mocha, chai and selenium with the following:
  npm install --save-dev mocha chai selenium-webdriver chromedriver

Test can be run with mocha test.js in the tests directory.

# Contributing

git clone your project,

On your chrome browser, go to : chrome://extensions/ , and click "Load unpacked". 

Then load the "/src" directory. Then click "Inspect views background page (Inactive)" to see messages on the console for background.js.  Now you will be able to debug Clipe extension.

Before opening a PR, run mocha test.js in the tests directory to check errors.

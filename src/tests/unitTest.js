const assert = require('chai').assert;
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');

// Path to the extension directory
const extensionPath = path.resolve(__dirname, '/Users/swu/Documents/Columbia University/Spring 2023/COMS 4995 Open Source Software/project/Clipie/src');

// Set up the Selenium Chrome driver
let driver;
const options = new chrome.Options();
options.addArguments(`load-extension=${extensionPath}`);
options.addArguments('--disable-extensions-except=' + extensionPath);
options.addArguments('--disable-infobars');
options.addArguments('--disable-notifications');
options.addArguments('--disable-popup-blocking');
options.addArguments('--no-sandbox');
options.addArguments('--disable-setuid-sandbox');
options.addArguments('--disable-dev-shm-usage');

describe('Clipie Chrome Extension Tests', function() {

  // Set timeout for each test
  this.timeout(10000);

  before(async function() {
    driver = await new webdriver.Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  after(async function() {
    await driver.quit();
  });

  // Unit tests for copy and paste functionality
  describe('Copy and Paste', function() {
    it('should copy selected text', async function() {
      await driver.get('https://www.google.com/');
      await driver.executeScript(`
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(document.getElementsByTagName("body")[0]);
        selection.removeAllRanges();
        selection.addRange(range);
      `);
      await driver.actions()
        .keyDown(webdriver.Key.CONTROL)
        .sendKeys('c')
        .keyUp(webdriver.Key.CONTROL)
        .perform();
      const copiedText = await driver.executeScript('return navigator.clipboard.readText()');
      assert.notStrictEqual(copiedText, '');
    });

    it('should paste copied text', async function() {
      const copiedText = 'Hello World!';
      await driver.executeScript(`navigator.clipboard.writeText('${copiedText}');`);
      await driver.get('https://www.google.com/');
      await driver.actions()
        .click(webdriver.Button.LEFT)
        .keyDown(webdriver.Key.CONTROL)
        .sendKeys('v')
        .keyUp(webdriver.Key.CONTROL)
        .perform();
      const pastedText = await driver.executeScript('return document.querySelector("textarea").value;');
      assert.strictEqual(pastedText, copiedText);
    });
  });

  // Integration tests for popup functionality
  describe('Popup', function() {
    it('should display clipboard history', async function() {
      await driver.get('chrome-extension://keamhamnpnlepoeplpmaocjnlbklbaeg/popup.html');
      const historyList = await driver.findElement(webdriver.By.id('historyList')).getText();
      assert.notStrictEqual(historyList, '');
    });

    it('should save clipboard history as .txt', async function() {
      await driver.get('chrome-extension://keamhamnpnlepoeplpmaocjnlbklbaeg/popup.html');
      const saveButton = await driver.findElement(webdriver.By.id('txtSaveButton'));
      await saveButton.click();
      const fileName = await driver.executeScript('return document.querySelector("a").download;');
      assert.strictEqual(fileName, 'Clipie_clipBoard_history.txt');
    });

    it('should clear clipboard history', async function() {
      await driver.get('chrome-extension://keamhamnpnlepoeplpmaocjnlbklbaeg/popup.html');
      const deleteButton = await driver.findElement(webdriver.By.id('historyDeleteButton'));
      await deleteButton.click();
      const historyList = await driver.findElement(webdriver.By.id('historyList')).getText();
      assert.strictEqual(historyList

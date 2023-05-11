const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const path = require('path');

const extensionPath = '/Users/swu/Documents/Columbia University/Spring 2023/COMS 4995 Open Source Software/Clipie/src';

const options = new chrome.Options();
options.addArguments([
    `--load-extension=${extensionPath}`
]);

describe('Clipboard Chrome Extension Test', function() {
    this.timeout(50000);
    let driver;

    beforeEach(async function() {
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    });

    afterEach(async function() {
        await driver.quit();
    });

    it('should open the extension popup', async function() {
        // Open a new tab to initialize the Chrome extension
        await driver.get('chrome://newtab');
        
        // Open the extension popup
        await driver.get(`chrome-extension://giffbkijnobblneabpeincocfimkgdao/popup.html`);
        
        // Check if the popup opened by verifying the title
        let title = await driver.getTitle();
        assert.equal(title, 'Clipie');
    });

    // Removed the copy and paste test, as it's not possible to simulate clipboard events in this context

    it('should show history', async function() {
        // Open the extension popup
        await driver.get(`chrome-extension://giffbkijnobblneabpeincocfimkgdao/popup.html`);

        // Wait for the history list to be populated
        await driver.wait(until.elementLocated(By.id('historyList')), 5000);

        // Check if the history list exists
        const historyList = await driver.findElement(By.id('historyList'));
        assert.ok(await historyList.isDisplayed());
    });

    it('should copy and paste text', async function() {
      await driver.get('https://www.google.com');
      await driver.findElement(By.name('q')).sendKeys('Hello World');
      await driver.findElement(By.name('q')).sendKeys(webdriver.Key.CONTROL, 'a');
      await driver.findElement(By.name('q')).sendKeys(webdriver.Key.CONTROL, 'c');
  
      await driver.findElement(By.name('q')).clear();
      await driver.findElement(By.name('q')).sendKeys(webdriver.Key.CONTROL, 'v');
  
      let value = await driver.findElement(By.name('q')).getAttribute('value');
      assert.strictEqual(value, 'Hello World');
    });

    it('should show clipboard history', async function() {
      await driver.get('chrome-extension://giffbkijnobblneabpeincocfimkgdao/popup.html');
  
      let historyList = await driver.findElement(By.id('historyList'));
      let historyItems = await historyList.findElements(By.tagName('li'));
  
      assert.strictEqual(historyItems.length, 2);
  
      let firstItem = await historyItems[0].getText();
      assert(firstItem.includes('Copied: \'Hello World\''));
      
      let secondItem = await historyItems[1].getText();
      assert(secondItem.includes('Pasted: \'Hello World\''));
    });
    
    it('should clear clipboard history', async function() {
      await driver.get('chrome-extension://giffbkijnobblneabpeincocfimkgdao/popup.html');
  
      let deleteButton = await driver.findElement(By.id('historyDeleteButton'));
      await deleteButton.click();
  
      let historyList = await driver.findElement(By.id('historyList'));
      let historyItems = await historyList.findElements(By.tagName('li'));
  
      assert.strictEqual(historyItems.length, 0);
    });
});

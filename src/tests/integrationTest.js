const assert = require('assert');
const { Builder, By, until, Key} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const isMacOS = process.platform === "darwin"; // check if using Mac

describe('Clipie Chrome Extension Test', function () {
    this.timeout(10000);
    let driver;

    before(async function() {
        let options = new chrome.Options();
        options.addArguments('load-extension=' + path.resolve(__dirname, '/Users/swu/Documents/Columbia University/Spring 2023/COMS 4995 Open Source Software/project/Clipie/src')); 
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

        // Open a new tab and switch to it
        await driver.switchTo().newWindow('tab');
    });

    after(async () => {
      if (driver) {
          await driver.quit();
      }
  });

    it('copy and paste', async function() {
        // Go to a webpage
        await driver.get('https://www.google.com/search?q=HelloWorld&source=hp&ei=eURcZI_wMNSg5NoP2IW5wAM&iflsig=AOEireoAAAAAZFxSiRyy3DoAUCgqmSQO8Yyvc8f5vNqP&ved=0ahUKEwjPkO6ejuz-AhVUEFkFHdhCDjgQ4dUDCAs&uact=5&oq=HelloWorld&gs_lcp=Cgdnd3Mtd2l6EAMyDgguEIAEEMcBENEDENQCMgsILhCvARDHARCABDIFCAAQgAQyBwgAEIAEEAoyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQ6BwgAEIoFEEM6BwguEIoFEEM6EQguEIAEELEDEIMBEMcBENEDOgsIABCABBCxAxCDAToKCC4QigUQ1AIQQzoKCC4QigUQsQMQQzoOCC4QgAQQsQMQxwEQ0QM6CwguEIAEELEDENQCOg0IABCKBRCxAxCDARBDOgsILhCABBCxAxCDAToICC4QgAQQsQM6DgguEIAEELEDEIMBENQCOgsILhCDARCxAxCABDoICAAQgAQQsQM6DQguEIAEEMcBENEDEAo6EAgAEIAEELEDEIMBELEDEAo6DQguEIMBELEDEIAEEAo6DQguEIAEEMcBEK8BEAo6BwguEIAEEAo6DQgAEIAEELEDEIMBEAo6CggAEIAEELEDEAo6DggAEA0QgAQQChBGEPsBOgkIABANEIAEEAo6CQguEA0QgAQQCjoICAAQHhANEAo6CwgAEB4QDRDxBBAKOgkIABAeEA0Q8QQ6DQgAEAUQHhANEPEEEApQAFigGGDMGWgDcAB4AIABmQGIAbwJkgEDOS40mAEAoAEB&sclient=gws-wiz');

        // // Select some text
        // await driver.executeScript('window.getSelection().selectAllChildren(document.body);');
        
        // // Perform a copy operation
        // await driver.actions()
        // .keyDown(isMacOS ? Key.COMMAND : Key.CONTROL) // If macOS, use COMMAND. Else, use CONTROL.
        // .sendKeys('c')
        // .keyUp(isMacOS ? Key.COMMAND : Key.CONTROL)
        // .perform();


        // Find the search bar element
       // let searchBar = await driver.findElement(By.name('q')); //gLFyf google'ss searchbar 
       let searchBar = await driver.findElement(By.xpath("//input[@value='HelloWorld']"));
        
       let wait = new WebDriverWait(driver, 5000);
await wait.until(ExpectedConditions.elementToBeClickable(searchBar));       

       // Select the text in the search bar
        await driver.actions()
            .click(searchBar)
            .keyDown(isMacOS ? Key.COMMAND : Key.CONTROL)
            .sendKeys('c')
            .keyUp(isMacOS ? Key.COMMAND : Key.CONTROL)
            .perform();

        // Get copied text from clipboard
        let copiedText = await driver.executeScript("return navigator.clipboard.readText();");

        // Verify the copied text
        assert.equal(copiedText, "HelloWorld"); 
    }); 



    it('copy event adds item to history list', async function() {
        // Open the extension popup
        await driver.get('chrome-extension://keamhamnpnlepoeplpmaocjnlbklbaeg/popup.html');
      
        // Simulate a copy event
        await driver.executeScript('document.dispatchEvent(new Event("copy"));');
      
        // Wait for message to be sent to background script
        await driver.sleep(500);
      
        // Get the current history from the background script
        let response = await driver.executeAsyncScript('chrome.runtime.sendMessage({type: "getHistory"}, arguments[0]);');
        let curHistory = response.history;
      
        // Check that the last item in history is a "Copied" action with correct text
        assert.equal(curHistory[0].action, "Copied");
        assert.equal(curHistory[0].text, await driver.executeScript('return window.getSelection().toString();'));
      });
      
      it('paste event adds item to history list', async function() {
        // Simulate a paste event
        await driver.executeScript('var event = new Event("paste"); document.dispatchEvent(event);');
        
        // Wait for message to be sent to background script
        await driver.sleep(500);
        
        // Get the current history from the background script
        let response = await driver.executeAsyncScript('chrome.runtime.sendMessage({type: "getHistory"}, arguments[0]);');
        let curHistory = response.history;
      
        // Check that the last item in history is a "Pasted" action with correct text
        assert.equal(curHistory[0].action, "Pasted");
        console.log(curHistory[0].text)
        assert.equal(curHistory[0].text, await driver.executeScript('return navigator.clipboard.readText();'));
      });
      
      
  
    it('delete history button clears history list', async function() {
        // Open the extension popup
        await driver.get('chrome-extension://keamhamnpnlepoeplpmaocjnlbklbaeg/popup.html');

        // Click the "Delete my history" button
        await driver.findElement(By.id('historyDeleteButton')).click();
        await driver.sleep(2000);
        // Check if the history is cleared
        let historyList = await driver.findElement(By.id('historyList')).getText();

        assert.strictEqual(historyList, '');
    });


});

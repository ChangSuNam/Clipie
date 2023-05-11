 /**
 * This file handles copy and paste request, and updates the history.
 */
 
 
 /** 
   * Stores the clipboard history returned by the background script.
   * @type {Array.<object>}
   */
let curHistory = [];

/**
Adds an action to the clipboard history.
@param {Object} request - The message received from the content script.
@param {string} request.type - The type of action to add to the history (e.g. "copy", "paste").
@param {string} request.text - The text that was copied or pasted.
@param {number} request.timestamp - The timestamp of the action.
@param {Object} sender - The sender of the message.
@param {function} sendResponse - The function to call to send a response back to the content script.
*/
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type == "copy") {
    curHistory.push({action: "Copied", text: request.text, timestamp: new Date(request.timestamp).toLocaleString()});
    console.log('Item copied:', request.text);
    console.log('History requested:', curHistory);
  } else if (request.type == "paste") {
    curHistory.push({action: "Pasted", text: request.text, timestamp: new Date(request.timestamp).toLocaleString()});
    console.log('Item pasted:', request.text);
    console.log('History requested:', curHistory);
  } else if (request.type == "getHistory") {
    sendResponse({history: curHistory});
  } else if (request.type == "deleteHistory") {
    curHistory = [];
    console.log("history data cleared.")
    sendResponse({history: curHistory});
  }
});


/**
This fi;e listens for copy and paste events and sends the copied or pasted text along with the timestamp to background.js.

*/

//console.log("Content script loaded");

/**
Listen for copy events.
@event module:contentScript~copy
@type {object}
@property {string} type - The type of event (copy).
@property {string} text - The copied text.
@property {number} timestamp - The timestamp when the copy event was triggered.
*/
document.addEventListener('copy', function(event) {
  //console.log('Copy event triggered!');
  //get the selected text
  var copyText = window.getSelection().toString();
  // Send to the background.js with the copied text and timestamp
  chrome.runtime.sendMessage({type: 'copy', text: copyText, timestamp: Date.now()});
})

/**
Listen for paste events.
@event module:contentScript~paste
@type {object}
@property {string} type - The type of event (paste).
@property {string} text - The pasted text.
@property {number} timestamp - The timestamp when the paste event was triggered.
*/
document.addEventListener('paste', function(event) {
  //console.log('Paste event triggered!');
  // Get the pasted text from the clipboard
  var clipboardText = event.clipboardData.getData('text');
  // Send to the background.js with the pasted text and timestamp
  chrome.runtime.sendMessage({type: 'paste', text: clipboardText, timestamp: Date.now()});
});








// /**
// JS file for the extension.
// Save and update copy and pasted texts, and their timestamp.
// @author ChangSu Nam
// @date Feb 19
// @ver 0.0.2



//console.log("Content script loaded");

// Listen for copy events
document.addEventListener('copy', function(event) {
  //console.log('Copy event triggered!');
  //get the selected text
  var copyText = window.getSelection().toString();
  // Send to the background.js with the copied text and timestamp
  chrome.runtime.sendMessage({type: 'copy', text: copyText, timestamp: Date.now()});
})

document.addEventListener('paste', function(event) {
  //console.log('Paste event triggered!');
  // Get the pasted text from the clipboard
  var clipboardText = event.clipboardData.getData('text');
  // Send to the background.js with the pasted text and timestamp
  chrome.runtime.sendMessage({type: 'paste', text: clipboardText, timestamp: Date.now()});
});








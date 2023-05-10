let curHistory = [];
//console.log('background.js loaded');
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  //console.log('Listener function triggered:', request);

  if (request.type == "copy") {
    curHistory.push({action: "Copied", text: request.text, timestamp: new Date(request.timestamp).toLocaleString()});
    console.log('Item copied:', request.text);
    console.log('History requested:', curHistory);

  } else if (request.type == "paste") {
    curHistory.push({action: "Pasted", text: request.text, timestamp: new Date(request.timestamp).toLocaleString()});
    console.log('Item pasted:', request.text);
    console.log('History requested:', curHistory);
  } 
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type == "getHistory") {
    sendResponse({history: curHistory});
  }
  
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type == "deleteHistory") {
    curHistory = [];
    console.log("history data cleared.")
    sendResponse({history: curHistory});
  }
  
});

/**
 * This file is responsible for interacting with the Chrome extension's clipboard history. 
 * It displays the clipboard history in the form of a list and provides functionality 
 * to copy items from the history, save the history to a file, and clear the history.
 */



 /** 
   * Stores the clipboard history returned by the background script.
   * @type {Array.<object>}
   */
var historyList = document.getElementById("historyList");


/** 
 * Asks the background script for the clipboard history using the Chrome runtime messaging API.
 * @type {object}
 * @property {string} type - The type of the message, which is "getHistory" in this case.
 */
chrome.runtime.sendMessage({type: "getHistory"}, function(response) {
  var history = response.history;

  /**
   * Iterates through the history array in reverse order, creating and appending list items
   * to the history list for each clipboard action. Each list item includes a button to copy
   * the associated clipboard text.
   */
  for (var i = history.length-1; i >= 0; i--) {
    //List of copy and pastes
    var item = history[i];
    var listItem = document.createElement("li");
    var textSpan = document.createElement("span");
    textSpan.innerHTML = item.text;
    if (item.action === "Copied") {
      textSpan.classList.add("copiedText");
    } else if (item.action === "Pasted") {
      textSpan.classList.add("pastedText");
    }
  
    listItem.innerHTML = item.action + ": '";
    listItem.appendChild(textSpan);
    listItem.innerHTML += "' @ [" + item.timestamp + "]";

    //create button that will allow user to copy what's on the clipboard
    var copyButton = document.createElement("button");
    copyButton.textContent = "Copy";
    copyButton.dataset.text = item.text; 
    copyButton.classList.add("copyButton");
    copyButton.addEventListener("click", function(event) {
      var textToCopy = event.target.dataset.text;
      navigator.clipboard.writeText(textToCopy).then(function() {
        console.log("Text copied to clipboard: " + textToCopy);
      }, function() {
        console.error("Failed to copy text to clipboard.");
      });
    });

    listItem.appendChild(copyButton);
    historyList.appendChild(listItem);
  }
  
   /** 
   * Gets the save button from the DOM and adds an event listener to it. When clicked,
   * the save button generates a text file containing the clipboard history and triggers
   * a download of the file.
   */
  var saveButton = document.getElementById("txtSaveButton");
  // Add event listener to the save button
  saveButton.addEventListener("click", function() {
    //console.log("save button clicked")
    var textToSave = "";
    for (var i = history.length-1; i >= 0; i--) {
      var item = history[i];
      textToSave += item.action + ": " + item.text + " (" + item.timestamp + ")\n";
    }

    //blob object with the textToSave string
    var blob = new Blob([textToSave], {type: "text/plain"});

    // URL for the Blob object
    var url = URL.createObjectURL(blob);

    // link element- set its href to the URL
    var link = document.createElement("a");
    link.href = url;
    link.download = "Clipie_clipBoard_history.txt";
    link.textContent = "Download History";

    // click to download
    link.click();
  });




  /**
   * Gets the delete button from the DOM and adds an event listener to it. When clicked,
   * the delete button clears the clipboard history in the popup.*/
  var deleteButton = document.getElementById("historyDeleteButton");

  deleteButton.addEventListener("click", function() {
  // Clear the history array
  history = [];
  // Clear the history list in the popup
  historyList.innerHTML = "";
  // Send a message to the background script to clear the history in storage
  chrome.runtime.sendMessage({type: "deleteHistory"}, function(response) {
   // console.log('History deleted on popup.js side');
  });
});


});


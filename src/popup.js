var historyList = document.getElementById("historyList");

//get current history
chrome.runtime.sendMessage({type: "getHistory"}, function(response) {
  var history = response.history;

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



  //button to save current history
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




  // DeleteButton
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


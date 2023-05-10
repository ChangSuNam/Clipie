// chrome.runtime.sendMessage({action: "getHistory"}, function(response) {
//   var historyList = document.getElementById("history");
//   for (var i = 0; i < response.history.length; i++) {
//     var item = document.createElement("li");
//     item.textContent = response.history[i].text + " (" + response.history[i].timestamp + ")";
//     historyList.appendChild(item);
//   }
// });

var historyList = document.getElementById("historyList");

chrome.runtime.sendMessage({type: "getHistory"}, function(response) {
  var history = response.history;

  for (var i = 0; i < history.length; i++) {
    var item = history[i];
    var listItem = document.createElement("li");
    listItem.textContent = item.action + ": '" + item.text + "' at [" + item.timestamp + "]";
    if (item.action === "Copied") {
      listItem.style.color = "blue";
    } else if (item.action === "Pasted") {
      listItem.style.color = "red";
    }

    var copyButton = document.createElement("button");
    copyButton.textContent = "Copy";
    copyButton.dataset.text = item.text; // Store the text to be copied in a custom data attribute
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
});

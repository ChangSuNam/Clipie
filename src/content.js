// /**
// JS file for the extension.
// Save and update copy and pasted texts, and their timestamp.
// @author ChangSu Nam
// @date Feb 19
// @ver 0.0.1
// */
// /**
// Variables:
// @date the Date object for timestamp
// @copiedText the texts that is copied
// @copiedTime the time it was copied
// @pastedText the texts that is pasted
// @pastedTime the time it was pasted
// */
// const date = new Date();
// let copiedText = ""
// let copiedTime = ""
// let pastedText = ""
// let pastedTime = ""


// //add selectable element in right-click menu for copy
// chrome.contextMenus.create ({
//   "title": "copy with extension",
//   "contexts": ["selection"],
//   "onclick": appendCopyInfoToDiv()
// });
// //add selectable element in right-click menu for paste
// chrome.contextMenus.create ({
//   "title": "paste with extension",
//   "contexts": ["selection"],
//   "onclick": appendPastedInfoToDiv()
// });

// //Functions: 
// /**
//  *Append copied text and time to div in the extension  
//  */
// function appendCopyInfoToDiv(){
//   copiedText = window.getSelection() //save highlighted text that's copied
//   copiedTime = date.toDateString() //save time when copied

//   let copyDiv = document.getElementsByTagName("copyDiv")
//   copyDiv.append(copiedText,p)
//   let copyTimeDiv = document.getElementsByTagName("copyTimeDiv")
//   copyTimeDiv.append(copiedTime,p) 
// }
// /**
//  *Append pasted text and time to div in the extension
//  */
// function appendPastedInfoToDiv(){
//   pastedText = copiedText//save highlighted text that's pasted
//   pastedTime = date.toDateString()// save time when pasted

//   //append pasted text and time
//   let PasteDiv = document.getElementsByTagName("pasteDiv")
//   copyDiv.append(pastedText,p)
//   let pasteTimeDiv = document.getElementsByTagName("pasteTimeDiv")
//   pasteTimeDiv.append(pastedTime,p)
// }




// //check if Keycode for control(command) is different for mac and windows?
// window.onload = function(){
//   //detect if command and c is pressed on keyboard.
//   $(document).on("keydown", function(e){
//     if (e.keyCode == 67 && (e.ctrlKey || e.metaKey)){
//       console.log("control and c pressed")
//       appendCopyInfoToDiv()
//     }
//   });

//   //detect if command and v is pressed on keyboard.
//   $(document).on("keydown", function(e){
//     if (e.keyCode == 86 && (e.ctrlKey || e.metaKey)){
//       console.log("control and v pressed")
//       appendPastedInfoToDiv()
//     }
//   });
// }


////
// Listen for copy events

console.log("Content script loaded");

// function copyHandler(event) {
//   if (event.ctrlKey || event.metaKey && event.keyCode == 67) {
//     console.log('Copy event triggered!');

//     var copyText = window.getSelection().toString();
//     // Send a message to the background script with the copied text and timestamp
//     chrome.runtime.sendMessage({type: 'copy', text: copyText, timestamp: Date.now()});
//   }
// }
// document.addEventListener('keydown', copyHandler);





// // Listen for paste events
// function pasteHandler(event) {
//   console.log('Paste event triggered!');
//   // Get the pasted text from the clipboard
//   var clipboardText = event.clipboardData.getData('text');
//   // Send a message to the background script with the pasted text and timestamp
//   chrome.runtime.sendMessage({type: 'paste', text: clipboardText, timestamp: Date.now()});
// }
// document.addEventListener('paste', pasteHandler);


document.addEventListener('copy', function(event) {
  console.log('Copy event triggered!');

  var copyText = window.getSelection().toString();
  // Send a message to the background script with the copied text and timestamp
  chrome.runtime.sendMessage({type: 'copy', text: copyText, timestamp: Date.now()});
});

document.addEventListener('paste', function(event) {
  console.log('Paste event triggered!');

  // Get the pasted text from the clipboard
  var clipboardText = event.clipboardData.getData('text');
  // Send a message to the background script with the pasted text and timestamp
  chrome.runtime.sendMessage({type: 'paste', text: clipboardText, timestamp: Date.now()});
});








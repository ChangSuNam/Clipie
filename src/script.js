//JS for scipt

const date = new Date();
let copiedText = ""
let copiedTime = ""
let pastedText = ""
let pastedTime = ""

//detect if command and c is pressed on keyboard.
//check if different for mac and windows?
$(document).on("keydown", function(e){
  if (e.keyCode == 67 && (e.ctrlKey || e.metaKey)){
    console.log("control and c pressed")
    
    copiedText = window.getSelection() //save highlighted text that's copied

    copiedTime = date.toDateStrin() //save time when copied
  }
});

//detect if command and v is pressed on keyboard.
$(document).on("keydown", function(e){
  if (e.keyCode == 86 && (e.ctrlKey || e.metaKey)){
    console.log("control and v pressed")
    pastedText = copiedText//save highlighted text that's pasted

    pastedTime = date.toDateStrin()// save time when pasted
  }
});


// funciton to append 

let copyDiv = document.getElementsByTagName("copy")
copyDiv.append(copiedText,p)

let PasteDiv = document.getElementsByTagName("paste")
copyDiv.append(pastedText,p)

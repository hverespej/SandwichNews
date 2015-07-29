var replaceMap;
var wordsToReplace;
$.post( "http://sandwichnewz.herokuapp.com/mapwords", " ", function(data) {
  replaceMap = data;
  console.log(data);
  wordsToReplace = Object.keys(data);
  console.log(wordsToReplace);
  // list of words to replace here
  wrapWords(document.body, wordsToReplace);
});


// Reusable generic function
function surroundInElement(el, regex, surrounderCreateFunc) {
  // script and style elements are left alone
  if (!/^(script|style)$/.test(el.tagName)) {
    var child = el.lastChild;
    while (child) {
      if (child.nodeType == 1) {
        surroundInElement(child, regex, surrounderCreateFunc);
      } else if (child.nodeType == 3) {
        surroundMatchingText(child, regex, surrounderCreateFunc);
      }
      child = child.previousSibling;
    }
  }
}

function getRandomSandwichTerm(){
  var min = 0;
  var max = sandwichTerms.length-1;
  return sandwichTerms[Math.floor(Math.random() * (max - min + 1)) + min];
}

// Reusable generic function
function surroundMatchingText(textNode, regex, surrounderCreateFunc) {
  var parent = textNode.parentNode;
  var result, surroundingNode, matchedTextNode, matchLength, matchedText;
  while ( textNode && (result = regex.exec(textNode.data)) ) {
    matchedTextNode = textNode.splitText(result.index);
    matchedText = result[0];
    matchLength = matchedText.length;
    textNode = (matchedTextNode.length > matchLength) ?
    matchedTextNode.splitText(matchLength) : null;
    surroundingNode = surrounderCreateFunc(matchedTextNode.cloneNode(true));
    parent.insertBefore(surroundingNode, matchedTextNode);
    parent.removeChild(matchedTextNode);
  }
}

// This function does the surrounding for every matched piece of text
// and can be customized  to do what you like
function createSpan(matchedTextNode) {
  var val = matchedTextNode.nodeValue;
  var valuelower = val.toLowerCase();
  var replacement = replaceMap[valuelower];
  if(typeof replacement === "undefined"){
    replacement = valuelower;
  }
  var t = document.createTextNode(replacement);
  // if what valuelower is mapped to is not the same as valuelower, then add it to the array of words to replace.
  // if(valuelower != replacement){
  //   wordsToReplace.push(valuelower);
  // }
  var el = document.createElement("span");
  el.style.color = "red";
  el.appendChild(t);
  return el;
  // var http = new XMLHttpRequest();
  // http.open("POST", "http://127.0.0.1:5000/mapwords", true);
  // http.onreadystatechange = function(){
  //   if(http.readyState == 4 && http.status == 200){
  //     console.log("foo");
  //   }
  // }
  // http.send("");


  // $.post( "http://127.0.0.1:5000/mapwords", valuelower, function(data) {
  //   console.log("callback run");
  //   var replacement = data[valuelower];
  //   var t = document.createTextNode(replacement);
  //   // if what valuelower is mapped to is not the same as valuelower, then add it to the array of words to replace.
  //   if(valuelower != replacement){
  //     wordsToReplace.push(valuelower);
  //   }
  //   var el = document.createElement("span");
  //   el.style.color = "red";
  //   el.appendChild(t);
  //   return el;
  // })
  // .fail(function() {
  //   alert( "error" );
  // });
}

// The main function
function wrapWords(container, words) {
  // Replace the words one at a time.
  for (var i = 0, len = words.length; i < len; ++i) {
    surroundInElement(container, new RegExp(words[i], "i"), createSpan);
  }
}

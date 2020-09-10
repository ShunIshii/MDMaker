'use strict';

var TurndownService = require('turndown');
var DomParser = require('dom-parser');
var request = require('request');
var fs = require('fs');

let defaultUrl = 'https://social.msdn.microsoft.com/Forums/ja-JP/4e6223e2-34d0-4a5f-bb61-109bc28040b6/windows-10-1249612540124721251912531-2004-20h1-1997812391';
let outputFileName = 'page2.md';

function getUrl() {
  if (process.argv.length == 3) {
    return process.argv[2];
  }
  else {
    return defaultUrl;
  }
}

if (require.main === module) {
  main();
}

function main() {
  var turndownService = new TurndownService();
  var url = getUrl();
  request.get(url, function(err, res, html) {
    if (err) {
      console.log('Error: ' + err.message);
      return;
    }

    var body = analysis(html);

    var markdown = turndownService.turndown(body);
    writeFile('generated/' + outputFileName, markdown);
  });
}

function writeFile(path, data) {
  fs.writeFile(path, data, function (err) {
    if (err) {
        throw err;
    }
    else {
      console.log('Generated "' + outputFileName + '" in "generated/" folder.');
    }
  });
}

function analysis(htmlStrings) {
  var domParser = new DomParser();
  var doc = domParser.parseFromString(htmlStrings, 'text/html');
  var body = doc.getElementsByClassName('body');
  return(body[0].innerHTML);
}

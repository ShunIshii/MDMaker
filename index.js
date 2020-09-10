'use strict';

var TurndownService = require('turndown');
var DomParser = require('dom-parser');
var request = require('request');
var fs = require('fs');

let defaultUrl = 'https://social.msdn.microsoft.com/Forums/ja-JP/4e6223e2-34d0-4a5f-bb61-109bc28040b6/windows-10-1249612540124721251912531-2004-20h1-1997812391';

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

    var blogObj = getBody(html);

    // 10進数の数値文字参照を通常テキストへデコードするために、マークダウンに変換するツールを使用
    blogObj.title = turndownService.turndown(blogObj.title);

    var markdown = turndownService.turndown(blogObj.body);

    var outputFileName = blogObj.title + '.md';
    writeFile('generated/', outputFileName, markdown);
  });
}

function writeFile(path, fileName, data) {
  fs.writeFile(path + fileName, data, function (err) {
    if (err) {
        throw err;
    }
    else {
      console.log('[Generated] ' + fileName);
    }
  });
}

function getBody(htmlStrings) {
  var domParser = new DomParser();
  var obj = new Object();
  var doc = domParser.parseFromString(htmlStrings, 'text/html');
  obj.title = doc.getElementsByTagName('title')[0].innerHTML;
  obj.body = doc.getElementsByClassName('body')[0].innerHTML;
  return(obj);
}


'use strict';

var TurndownService = require('turndown')
var request = require('request')
var fs = require('fs');

var url = getUrl()

function getUrl() {
  if (process.argv.length == 3) {
    return process.argv[2]
  }
  else {
    return 'https://social.msdn.microsoft.com/Forums/ja-JP/4e6223e2-34d0-4a5f-bb61-109bc28040b6/windows-10-1249612540124721251912531-2004-20h1-1997812391?forum=officesupportteamja'
  }
}

if (require.main === module) {
  main()
}

function writeFile(path, data) {
  fs.writeFile(path, data, function (err) {
    if (err) {
        throw err;
    }
  });
}

function main() {
  var turndownService = new TurndownService()
  request.get(url, function(err, res, body) {
    if (err) {
      console.log('Error: ' + err.message);
      return;
    }
    var markdown = turndownService.turndown(body)
    writeFile('generated/page1.md', markdown)
  })
}

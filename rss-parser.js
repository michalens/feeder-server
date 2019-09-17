let Parser = require('rss-parser');
let parser = new Parser();

async function rssParser (url) {

  let feed = await parser.parseURL(url);
  
  return feed

}

module.exports.rssParser = rssParser
'https://www.youtube.com/feeds/videos.xml?channel_id=UCVPYbobPRzz0SjinWekjUBw'
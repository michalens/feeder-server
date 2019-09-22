const Parser = require('rss-parser')
const parser = new Parser()

const RSSFeed = require('../models/rss-model').RSSFeed
const FeedItem = require('../models/rss-model').FeedItem

function refreshFeed() {
	RSSFeed.find({}, (err, feeds) => {
		if (err) { 
			console.log(err)
			return 
		}

		feeds.map(async feed => {
			const parsedFeed = await rssParser(feed.feedUrl)

			if (parsedFeed.link && feed.link !== parsedFeed.link) {
				console.log(feed.link, parsedFeed.link)
				RSSFeed.findOneAndUpdate({ feedUrl: feed.feedUrl }, { link: parsedFeed.link }, (err, res) =>{
					if (err) {
						console.log(err)
					}
					res.save()
				}) 
			}
			if (parsedFeed.title && feed.title !== parsedFeed.title) {
				console.log(feed.title, parsedFeed.title)
				RSSFeed.findOneAndUpdate({ feedUrl: feed.feedUrl }, { title: parsedFeed.title }, (err, res) =>{
					if (err) {
						console.log(err)
					}
					res.save()
				}) 
			}

			itemsComparison(feed, parsedFeed)

		})

	})
}

function itemsComparison (prevFeed, newFeed) {
	if (prevFeed.items = [] || !prevFeed.items) {
		console.log("adding")
		newFeed.items.forEach(item => {
			let { pubDate, title, content, link } = item 
			if (!link) {
				link = item.guid
			}
			const feedItem = new FeedItem({
				pubDate: pubDate,
				title: title,
				link: link,
				content: content
			})
			feedItem.save((err, feedItem) => {
				if(err){
				    console.log("Something went wrong,", err)
				    return
				}
				RSSFeed.findByIdAndUpdate(prevFeed._id, { $push: {items: feedItem._id} }, (err, res)=>{
					if (err) {console.log('err',err)}
					res.save()
				})
			})
		})
	} else {
		console.log(prevFeed.items)

	}	  

}

async function rssParser(url) {
	try {
		const parsedFeed = await parser.parseURL(url)
		return parsedFeed
	} catch (err) {
		return {}
	}
}

// rssParser('https://aeon.co/fed.rss')

// console.log(feed)

module.exports = refreshFeed
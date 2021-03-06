const Parser = require('rss-parser')
const rssParser = new Parser()
const slugify = require('slugify')

const RSSFeed = require('../models/rss-model').RSSFeed
const Folder = require('../models/rss-model').Folder

createFeed =  async (req, res) => {

    if (!req.body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a URL',
        })
    }
    let feedUrl = ""
    if (req.body.feedUrl.indexOf('https://www.youtube.com/channel/') === 0) {
        feedUrl = "http://www.youtube.com/feeds/videos.xml?channel_id=" + req.body.feedUrl.slice('https://www.youtube.com/channel/'.length)
    } else if (req.body.feedUrl.indexOf('/') === -1) {
        feedUrl = "http://www.youtube.com/feeds/videos.xml?channel_id=" + req.body.feedUrl
    } else {
        feedUrl = req.body.feedUrl
    }

    const parsedRss = await rssParser.parseURL(feedUrl)

    const feed = new RSSFeed({
        title,
        slug: slugify(title),
        feedUrl,
        link
    })

    if (!feed) {
        return res.status(400).json({ success: false, error: err })
    }

    feed
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: feed._id,
                message: 'Feed added!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Feed not added!',
            })
        })
}

updateFeed = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    RSSFeed.findOne({ _id: req.params.id }, (err, feed) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Feed not found!',
            })
        }
        feed.url = body.url
        feed.read = body.read
        feed
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: feed._id,
                    message: 'Feed updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Feed not updated!',
                })
            })
    })
}

deleteFeed = async (req, res) => {
    await RSSFeed.findOneAndDelete({ _id: req.params.id }, (err, feed) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!feed) {
            return res
                .status(404)
                .json({ success: false, error: `Feed not found` })
        }

        return res.status(200).json({ success: true, data: feed })
    }).catch(err => console.log(err))
}

getFeedById = async (req, res) => {
    await RSSFeed.findOne({ _id: req.params.id })
        .populate('items')
        .exec((err, feed) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!feed) {
            return res
                .status(404)
                .json({ success: false, error: `Feed not found` })
        }
        return res.status(200).json({ success: true, data: feed })
    })
}


getFeeds = async (req, res) => {
    await Folder.find({parentFolder: null})
        .populate({path: 'folders feeds', populate: {path: 'folders feeds', populate: {path: 'folders feeds', populate: {path: 'folders feeds'}}}})
        .exec((err, folders) => {
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
            if (!folders.length) {
                return res
                    .status(404)
                    .json({ success: false, error: `Feed not found` })
            }

            RSSFeed.find({parentFolder: null}, (err, feeds) => {
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!feeds.length) {
                    return res
                        .status(404)
                        .json({ success: false, error: `Feed not found` })
                }
                return res.status(200).json({ success: true, data: {folders, feeds} })
            })
        })
}

module.exports = {
    createFeed,
    updateFeed,
    deleteFeed,
    getFeeds,
    getFeedById,
}

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const folderSchema = new Schema({
    title: {
        type: String, 
        required: true 
    },
    parentFolder: { type: Schema.Types.ObjectId, ref: 'Folder' },
    folders: [{ type: Schema.Types.ObjectId, ref: 'Folder' }],
    feeds: [{ type: Schema.Types.ObjectId, ref: 'RSSFeed' }]
})

const rssFeedSchema = new Schema({
        feedUrl: { 
        	type: String, 
        	required: true 
        },
        title: {
        	type: String,
        	required: true
        },
        link: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        parentFolder: { type: Schema.Types.ObjectId, ref: 'Folder' },
        items: [{ type: Schema.Types.ObjectId, ref: 'FeedItem' }]
    })

const feedItemSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    pubDate: {
        type: String,
        required: true
    },
    content: String,
    author: String
})

const Folder = mongoose.model('Folder', folderSchema)
const RSSFeed = mongoose.model('RSSFeed', rssFeedSchema)
const FeedItem = mongoose.model('FeedItem', feedItemSchema)


module.exports = {
    Folder,
    RSSFeed,
    FeedItem
}
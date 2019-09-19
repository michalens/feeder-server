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
        items: {
            type: Array,
            required: false
        },
        parentFolder: { type: Schema.Types.ObjectId, ref: 'Folder' },

    })

const RSSFeed = mongoose.model('RSSFeed', rssFeedSchema);
const Folder = mongoose.model('Folder', folderSchema);
module.exports = {
    RSSFeed,
    Folder
}
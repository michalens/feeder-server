const mongoose = require('mongoose')
const Schema = mongoose.Schema

const rssFeedSchema = new Schema(
  	{
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
        }

    }
)

module.exports = mongoose.model('RSSFeed', rssFeedSchema)
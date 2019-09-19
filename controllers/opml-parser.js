const convert = require('xml-js')
const RSSFeed = require('../models/rss-model').RSSFeed
const Folder = require('../models/rss-model').Folder
const fs = require('fs')

function opmlUpload(req, res) {
  	const opmlFile = req.files.file;
  	opmlFile.mv(__dirname + `/../public/opmlUpload/${opmlFile.name}`, function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.json({file: `public/opmlUpload/${opmlFile.name}`})

    opmlParser(__dirname + `/../public/opmlUpload/${opmlFile.name}`)
  });	
}

function opmlParser(file) {
	if (file.search(/(\.opml$)/gm) === -1 ) {
		console.log("Not an OPML file")
		return false;
	}
	const xml = fs.readFileSync(file, 'utf8');
	const result = convert.xml2js(xml, {compact: true})

	outlineLoop(result.opml.body.outline)
	fs.unlink(file, err => {
		if (err) throw err;
  console.log('successfully deleted', file);
	})
}

function outlineLoop(obj, parentId) {
	for (let feed in obj) {
		const item = obj[feed]
		if (!item._attributes) {
			console.log(item)
		} else {
			if (item._attributes.type === 'folder') {

				const folder = new Folder({ 
					title: item._attributes.title, 
					parentFolder: parentId,

				})
				folder.save((err, folder) => {
					if(err){
					    console.log("Something went wrong,", err)
					    return
					}
			      	if (parentId !== 0) {
						Folder.findByIdAndUpdate(parentId, { $push: {folders: folder._id} }, (err, res)=>{
							if (err) {console.log(err)}
						})
			      	}
					outlineLoop(item.outline, folder._id)
				})
			} else if (item._attributes.type === 'rss' || item._attributes.type === 'atom') {
				const { title, xmlUrl, htmlUrl } = item._attributes
				
				const feed = new RSSFeed({
					title,
					feedUrl: xmlUrl,
					link: htmlUrl,
					parentFolder: parentId
				})
				feed.save((err, feed) => {
					if(err){
					    console.log("Something went wrong,", err)
					    return
					}
			      	if (parentId !== 0) {
						Folder.findByIdAndUpdate(parentId, { $push: {feeds: feed._id} }, (err, res)=>{
							if (err) {console.log(err)}
						})
			      	}
				})
			}

		}
	}

}

module.exports = {
	opmlUpload
}
const convert = require('xml-js')
const Folder = require('../models/rss-model').Folder
const api = require('./rss-ctrl')

async function createFolder(obj) {
	const folder = new Folder(obj)

	if (!folder) {
        return { success: false, error: "Error, folder not provided" }
    }

    folder
        .save()
        .then(() => {
            return {
                success: true,
                id: folder._id,
                message: 'Folder added!',
            }
        })
        .catch(error => {
        	console.log(error)
            return {
                error,
                message: 'Folder not added!',
            }
        })
}

async function outlineLoop(obj) {
	for (let feed in obj) {
		const item = {}

		if (obj[feed]._attributes.type === 'folder') {
			item.title = obj[feed]._attributes.title
			console.log(item.title)
			// await createFolder(item)

		} else if (obj[feed]._attributes.type === 'rss' || obj[feed]._attributes.type === 'atom') {
			const { title, xmlUrl, htmlUrl } = obj[feed]._attributes
			api.createFeed({body: {
				title,
				link: htmlUrl,
				feedUrl: xmlUrl
			}})
			console.log(obj[feed]._attributes.title)
		}
	}
}

function opmlParser(file) {
	if (file.search(/(\.opml$)/gm) === -1 ) {
		console.log("Not an OPML file")
		return false;
	}
	const xml = require('fs').readFileSync(file, 'utf8');
	const result = convert.xml2js(xml, {compact: true})

	outlineLoop(result.opml.body.outline)


}

opmlParser('feedlist1.opml')

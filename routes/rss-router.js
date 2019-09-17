const express = require('express')

const rssCtrl = require('../controllers/rss-ctrl')

const router = express.Router()

router.post('/feed', rssCtrl.createFeed)
router.put('/feed/:id', rssCtrl.updateFeed)
router.delete('/feed/:id', rssCtrl.deleteFeed)
router.get('/feed/:id', rssCtrl.getFeedById)
router.get('/feed', rssCtrl.getFeeds)

module.exports = router
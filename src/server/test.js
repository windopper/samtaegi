const express = require('express')
const router = express.Router()
const { Players } = require('../commands/music_player_commands')

router.get('/', (req, res) => {
    res.send({response: "I am alive"})
})

module.exports = router
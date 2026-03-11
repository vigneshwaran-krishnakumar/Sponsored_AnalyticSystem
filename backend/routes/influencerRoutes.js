const express = require('express');
const influencerController = require('../controllers/influencerController');

const router = express.Router();

// Get all influencers
router.get('/', influencerController.getAllInfluencers);

// Create influencer
router.post('/', influencerController.createInfluencer);

// Update influencer
router.put('/:id', influencerController.updateInfluencer);

// Delete influencer
router.delete('/:id', influencerController.deleteInfluencer);

module.exports = router;
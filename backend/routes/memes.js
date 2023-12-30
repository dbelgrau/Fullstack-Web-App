const express = require('express');
const router = express.Router();
const upload = require('../config/multerconfig');
const { 
  getAllMemes,
  getRankingMemes,
  getOneMeme,
  addMeme,
  modifyMeme,
  deleteMeme,
  increaseMemeRating,
  decreaseMemeRating,
  spamMeme, 
  addMemeToFavorites, 
  getAllUserMemes, 
  getSpamMemes, 
  removeMemeFromFavorites, 
  getAllFavoriteMemes, 
  getAllLikedMemes
} = require('../controllers/memes');

router.get('/', getAllMemes);

router.get('/ranking/:sort', getRankingMemes);

router.get('/spam', getSpamMemes);

router.get('/user/:uid', getAllUserMemes);

router.get('/favorites/:uid', getAllFavoriteMemes);

router.get('/liked/:uid', getAllLikedMemes);

router.get('/:id', getOneMeme);

router.post('/', upload.single('image'), addMeme);

router.put('/:id', upload.single('image'), modifyMeme);

router.delete('/:id', deleteMeme);

router.post('/uprating', increaseMemeRating);

router.post('/downrating', decreaseMemeRating);

router.post('/spam', spamMeme);

router.post('/favorites', addMemeToFavorites);

router.post('/notfavorites', removeMemeFromFavorites);

module.exports = router;

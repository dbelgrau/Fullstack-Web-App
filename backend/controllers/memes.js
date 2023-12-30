const driver = require('../config/neo4jconfig');
const fs = require('fs');

// GET ALL
const getAllMemes = async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (m:Meme)<-[:AUTHOR]-(u:User)
       RETURN m, u.uid as uid, 
       size([(m)<-[:COMMENT]-() | 1]) as comments, 
       size([(m)<-[:FAVORITE]-() | 1]) as favorites`);
    const memes = result.records.map(m => {
      const memeProperties = m.get('m').properties;
      const uid = m.get('uid');
      const comments = m.get('comments').low;
      const favorites = m.get('favorites').low;
      return { ...memeProperties, uid, comments, favorites };
    });
    session.close();
    res.status(200).json(memes);
  } catch (error) {
    session.close();
    console.log(error);
    res.status(500).json({ message: 'Error fetching all memes' });
  }
};

// GET ALL RANKING
const getRankingMemes = async (req, res) => {
  const session = driver.session();
  try {
    const { sort } = req.params;
    let query = '';
    if (sort === 'rating') {
      query = `MATCH (m:Meme)<-[:AUTHOR]-(u:User)
               RETURN m, u.uid as uid, 
               size([(m)<-[:COMMENT]-() | 1]) as comments, 
               size([(m)<-[:FAVORITE]-() | 1]) as favorites
               ORDER BY m.rating DESC
               LIMIT 5`;
    } else if (sort === 'comments') {
      query = `MATCH (m:Meme)<-[:AUTHOR]-(u:User)
               WITH m, u.uid as uid, 
               size([(m)<-[:COMMENT]-() | 1]) as comments, 
               size([(m)<-[:FAVORITE]-() | 1]) as favorites
               ORDER BY comments DESC
               LIMIT 5
               RETURN m, uid, comments, favorites`;
    } else if (sort === 'favorites') {
      query = `MATCH (m:Meme)<-[:AUTHOR]-(u:User)
               WITH m, u.uid as uid, 
               size([(m)<-[:COMMENT]-() | 1]) as comments, 
               size([(m)<-[:FAVORITE]-() | 1]) as favorites
               ORDER BY favorites DESC
               LIMIT 5
               RETURN m, uid, comments, favorites`;
    } else {
      session.close();
      res.status(400).json({ message: 'Invalid sorting method' });
      return;
    }
    const result = await session.run(query);
    const memes = result.records.map(m => {
      const memeProperties = m.get('m').properties;
      const uid = m.get('uid');
      const comments = m.get('comments').low;
      const favorites = m.get('favorites').low;
      return { ...memeProperties, uid, comments, favorites };
    });
    session.close();
    res.status(200).json(memes);
  } catch (error) {
    session.close();
    console.log(error);
    res.status(500).json({ message: 'Error fetching ranking memes' });
  }
};

// GET ALL FROM USER
const getAllUserMemes = async (req, res) => {
  const session = driver.session();
  try {
    const { uid } = req.params;
    const result = await session.run(
      `MATCH (u:User {uid: $uid})-[:AUTHOR]->(m:Meme) 
      RETURN m, 
      size([(m)<-[:COMMENT]-() | 1]) as comments, 
      size([(m)<-[:FAVORITE]-() | 1]) as favorites`,
       { uid });
      const memes = result.records.map(m => {
        const memeProperties = m.get('m').properties;
        const comments = m.get('comments').low;
        const favorites = m.get('favorites').low;
        return { ...memeProperties, uid, comments, favorites };
      });
    session.close();
    res.status(200).json(memes);
  } catch (error) {
    session.close();
    console.log(error);
    res.status(500).json({ message: 'Error fetching memes' });
  }
};

// GET ONE
const getOneMeme = async (req, res) => {
  const session = driver.session();
  try {
    const { id } = req.params;
    const result = await session.run(
      `MATCH (m:Meme)<-[:AUTHOR]-(u:User) WHERE m.id = $id 
      RETURN m, u.uid as uid,
      size([(m)<-[:COMMENT]-() | 1]) as comments, 
      size([(m)<-[:FAVORITE]-() | 1]) as favorites`,
      { id }
    );
    session.close();
    if (result.records.length > 0) {
      const memeProperties = result.records[0].get('m').properties;
      const uid = result.records[0].get('uid');
      const comments = result.records[0].get('comments').low;
      const favorites = result.records[0].get('favorites').low;
      res.status(200).json({ ...memeProperties, uid, comments, favorites });
    } else {
      res.status(404).json({ message: 'Meme not found' });
    }
  } catch (error) {
    session.close();
    console.log(error);
    res.status(500).json({ message: 'Error getting meme' });
  }
};

// GET FAVORITES
const getAllFavoriteMemes = async (req, res) => {
  const session = driver.session();
  try {
    const { uid } = req.params;
    const result = await session.run(
      `MATCH (u:User {uid: $uid})-[:FAVORITE]->(m:Meme) RETURN m.id as id`, { uid });
      const favoriteIds = result.records.map(m => m.get('id'));
    session.close();
    res.status(200).json(favoriteIds);
  } catch (error) {
    session.close();
    console.log(error);
    res.status(500).json({ message: 'Error fetching favorite memes' });
  }
};
  
// GET SPAM
const getSpamMemes = async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (s:Spam)<-[:SPAM]-(m:Meme)<-[:AUTHOR]-(u:User) 
      RETURN m, u.uid as uid, 
      size([(m)<-[:COMMENT]-() | 1]) as comments, 
      size([(m)<-[:FAVORITE]-() | 1]) as favorites`);
    session.close();
    if (result.records.length > 0) {
      const memes = result.records.map(m => {
        const memeProperties = m.get('m').properties;
        const uid = m.get('uid');
        const comments = m.get('comments').low;
        const favorites = m.get('favorites').low;
        return { ...memeProperties, uid, comments, favorites };
      });
      res.status(200).json(memes);
    } else {
      res.status(404).json({ message: 'No spam memes found' });
    }
  } catch (error) {
    session.close();
    console.log(error);
    res.status(500).json({ message: 'Error fetching spam memes' });
  }
};

// GET ALL LIKED
const getAllLikedMemes = async (req, res) => {
  const session = driver.session();
  try {
    const { uid } = req.params;
    const result = await session.run(
      `MATCH (u:User {uid: $uid})-[:LIKES]->(m:Meme) RETURN m`, { uid });
    const memes = result.records.map((record) => record.get("m").properties.id);
    session.close();
    res.status(200).json(memes);
  } catch (error) {
    session.close();
    console.log(error);
    res.status(500).json({ message: 'Error fetching liked memes' });
  }
};

// ADD ONE
const addMeme = async (req, res) => {
  const session = driver.session();
  try {
    const { id, title, description, category, uid } = req.body;
    let image = '';
    if (req.file) image = 'http://localhost:8080/api/' + req.file.path;
    const added_at = new Date().toISOString();
    const result = await session.run(
      `MATCH (u:User {uid: $uid}) CREATE (m:Meme { id: $id, title: $title, description: $description, category: $category, image: $image, added_at: $added_at , rating: 0}) CREATE (u)-[:AUTHOR]->(m) RETURN m`,
      { id, title, description, category, image, added_at, uid });
    session.close();
    const memeProperties = result.records[0].get('m').properties;
    res.status(201).json({ message: 'Meme added successfully', meme: { ...memeProperties, uid }});
  } catch (error) {
    session.close();
    console.log(error);
    if(req.file) fs.unlink(req.file.path, err => console.log(err));
    res.status(500).json({ message: 'Error adding meme' });
  }
};

// MODIFY ONE
const modifyMeme = async (req, res) => {
  const session = driver.session();
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;
    let image = null;
    if (req.file) {
      image = 'http://localhost:8080/api/' + req.file.path;
      const result = await session.run(`MATCH (m:Meme {id: $id}) RETURN m.image as image`, {id});
      oldImage = result.records[0].get("image");
    }
    let query = `MATCH (m:Meme {id: $id})<-[:AUTHOR]-(u:User) SET m.title = $title, m.description = $description, m.category = $category`;
    let params = { id, title, description, category };
    if (image) {
      query += `, m.image = $image`;
      params.image = image;
    }
    query += ` RETURN m, u.uid as uid`;
    const result = await session.run(query, params);
    session.close();
    if (result.records.length === 0) {
      if (req.file) {
        fs.unlink(image, err => console.log(err));
      }
      res.status(404).json({ message: "Meme not found" });
      return;
    }
    if (req.file && oldImage !== '') {
      oldImage = oldImage.replace("http://localhost:8080/api/", "")
      fs.unlink(oldImage, err => console.log(err));
    }
    const memeProperties = result.records[0].get('m').properties;
    const uid = result.records[0].get('uid');
    res.status(200).json({ message: 'Meme modified successfully', meme: { ...memeProperties, uid }});
  } catch (error) {
    session.close();
    console.log(error);
    if (req.file) {
      fs.unlink(req.file.path, err => console.log(err));
    }
    res.status(404).json({ message: 'Error modifying meme' });
  }
};

// DELETE ONE
const deleteMeme = async (req, res) => {
  const session = driver.session();
  try {
    const { id } = req.params;
    const result = await session.run(`MATCH (m:Meme {id: $id}) RETURN m.image as image`, { id });
    const imageUrl = result.records[0].get("image");
    let imagePath;
    if (imageUrl !== "") imagePath = imageUrl.replace("http://localhost:8080/api/", "");
    await session.run(`MATCH (m:Meme {id: $id}) DETACH DELETE m RETURN m`, { id });
    session.close();
    if (result.records.length === 0) {
      res.status(404).json({ message: "Meme not found" });
      return;
    }
    if (imageUrl !== "") fs.unlink(imagePath, err => console.log(err));
    res.status(200).json({ message: 'Meme deleted successfully' });
  } catch (error) {
    session.close();
    console.log(error);
    res.status(500).json({ message: 'Error deleting meme' });
  }
};

// INCREASE RATING
const increaseMemeRating = async (req, res) => {
  const session = driver.session();
  try {
    const { uid, id } = req.body;
    const result = await session.run(
      `MATCH (u:User {uid: $uid}), (m:Meme {id: $id}) 
      MERGE (u)-[r:LIKES]->(m) 
      ON CREATE SET m.rating = m.rating + 1 
      RETURN m`,
      { uid, id });
    session.close();
    res.status(201).json({ message: 'Meme rating changed successfully' });
  } catch (error) {
    session.close();
    console.log(error);
    res.status(500).json({ message: 'Error changing meme rating' });
  }
};

// DECREASE RATING
const decreaseMemeRating = async (req, res) => {
  const session = driver.session();
  try {
    const { uid, id } = req.body;
    const r = await session.run(
      `MATCH (u:User {uid: $uid})-[r:LIKES]->(m:Meme {id: $id}) RETURN r`,
      { uid, id });
    if (r.records.length > 0) await session.run(
      `MATCH (u:User {uid: $uid})-[r:LIKES]->(m:Meme {id: $id}) DELETE r 
      SET m.rating = m.rating - 1`,
      { uid, id });
    session.close();
    res.status(201).json({ message: 'Meme rating changed successfully' });
  } catch (error) {
    session.close();
    console.log(error);
    res.status(500).json({ message: 'Error changing meme rating' });
  }
};

// ADD ONE TO SPAM
const spamMeme = async (req, res) => {
  const session = driver.session();
  try {
    const { id } = req.body;
    await session.run(`
      MATCH (m:Meme { id: $id }), (s:Spam)
      CREATE (m)-[:SPAM]->(s)
    `, { id });
    session.close();
    res.status(200).json({ message: 'Meme marked as spam successfully' });
  } catch (error) {
    session.close();
    console.log(error);
    res.status(500).json({ message: 'Error marking meme as spam' });
  }
};

// ADD ONE TO FAVORITES
const addMemeToFavorites = async (req, res) => {
  const session = driver.session();
  try {
    const { uid, id } = req.body;
    await session.run(
      `MATCH (u:User {uid: $uid}), (m:Meme {id: $id}) MERGE (u)-[r:FAVORITE]->(m)`,
      { uid, id });
      session.close();
      res.status(201).json({ message: 'Meme added to favorites successfully' });
    } catch (error) {
    session.close();
    console.log(error);
    res.status(500).json({ message: 'Error adding meme to favorites' });
  }
};

// REMOVE ONE FROM FAVORITES
const removeMemeFromFavorites = async (req, res) => {
  const session = driver.session();
  try {
    const { uid, id } = req.body;
    await session.run(
      `MATCH (u:User { uid: $uid })-[f:FAVORITE]->(m:Meme { id: $id }) DELETE f` , { uid, id });
    session.close();
    res.status(201).json({ message: "Successfully removed from favorites" });
  } catch (error) {
    session.close();
    console.log(error);
    res.status(500).json({ message: "Error removing from favorites" });
  }
};

module.exports = {
  getAllMemes,
  getRankingMemes,
  getAllUserMemes,
  getOneMeme,
  getSpamMemes,
  getAllFavoriteMemes,
  getAllLikedMemes,
  addMeme,
  modifyMeme,
  deleteMeme,
  increaseMemeRating,
  decreaseMemeRating,
  spamMeme,
  addMemeToFavorites,
  removeMemeFromFavorites
};
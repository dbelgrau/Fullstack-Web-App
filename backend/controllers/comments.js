const driver = require('../config/neo4jconfig');

// GET ALL
const getAllComments = async (req, res) => {
  const { id } = req.params;
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (:Meme {id: $id})<-[c:COMMENT]-(u:User) RETURN c, u.uid as uid`,
      { id });
    const comments = result.records.map(c => {
      const commentsProperties = c.get('c').properties;
      const uid = c.get('uid');
      return { ...commentsProperties, uid, id };
  });
    session.close();
    res.status(200).json(comments);
  } catch (error) {
    session.close();
    console.log(error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
};

// ADD ONE
const addComment = async (data) => {
  const session = driver.session();
  try {
    const { cid, id, content, uid } = data;
    const added_at = new Date().toISOString();
    const result = await session.run(
      `MATCH (u:User {uid: $uid}), (m:Meme {id: $id}) CREATE (u)-[c:COMMENT {cid: $cid, content: $content, added_at: $added_at}]->(m) RETURN c`,
      { uid, id, cid, content, added_at });
    session.close();
    const rel = result.records[0].get('c').properties;
    return { ...rel, id, uid };
  } catch (error) {
    session.close();
    console.log(error);
  }
};

// MODIFY ONE
const modifyComment = async (data) => {
  const session = driver.session();
  try {
    const { cid, id, content } = data;
    await session.run(
      `MATCH (m)<-[c:COMMENT {cid: $cid}]-(u) SET c.content = $content RETURN c`,
     { cid, content });
  } catch (error) {
    session.close();
    console.log(error);
  }
};

// DELETE ONE
const deleteComment = async (cid) => {
  const session = driver.session();
  try {
    await session.run(
      `MATCH (n)-[c:COMMENT {cid: $cid}]->(m) DELETE c`,
      { cid });
    return;
  } catch (error) {
    session.close();
    console.log(error);
  }
};

module.exports = {
  getAllComments,
  addComment,
  modifyComment,
  deleteComment
};
const driver = require('../config/neo4jconfig');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ADMIN SECRET CODE
// const generateAdminCode = (req, res) => {
//   const code = 'noPrzeciezTuNiePodamKodu';
//   const salt = bcrypt.genSaltSync(10);
//   const hash = bcrypt.hashSync(code, salt);
//   const session = driver.session();
//   session.run(
//     `MATCH (c:AdminCode) SET c.code = $hash`,
//     { hash }
//   ).then(result =>
//     res.status(201).json({message: 'Ok'})
//   ).catch(error => 
//     res.status(500).json({message: 'Error'})  
//   )
// }

// GET ALL
const getAllUsers = async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(`MATCH (u:User) RETURN u`);
    session.close();
    const resJson = result.records.map(u => {
      const properties = u.get('u').properties;
      delete properties.password;
      return properties;
    });
    res.status(200).json(resJson);
  } catch (error) {
    session.close();
    console.log(error);
    res.status(404).json({ message: 'Cannot get users' });
  }
};

// ADD ONE
const addUser = async (req, res) => {
  const session = driver.session();
  try {
    const { uid, name, password, code } = req.body;
    let image = 'images/default.jpg';
    if (req.file) image = req.file.path;
    const created_at = new Date().toISOString();
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    let role = 'user';

    const adminCode = await session.run(`MATCH (a:AdminCode) RETURN a.code as code`);
    const codeFromDb = adminCode.records[0].get("code");
    const isCodeValid = bcrypt.compareSync(code, codeFromDb);
    if (isCodeValid) role = 'admin';

    const result = await session.run(`MATCH (u:User {name: $name}) RETURN u`, {name});
    if (result.records.length > 0) {
      if(req.file) fs.unlink(image, err => console.log(err));
      session.close();
      res.status(409).json({message: 'This nickname is already taken'});
    } else {
      const img = 'http://localhost:8080/api/' + image;

      const result = await session.run(
        `CREATE (u:User { uid: $uid, name: $name, password: $hash, role: $role, image: $img, created_at: $created_at }) RETURN u`,
          { uid, name, hash, role, img, created_at });
        const u = result.records[0].get('u').properties;
        delete u.password;
      session.close();
      res.status(201).json({ message: 'User created successfully', user: u });
    }
  } catch (error) {
    session.close();
    console.log(error);
    if(req.file) fs.unlink(image, err => console.log(err));
    res.status(500).json({ message: 'Error creating user' });
  }
};

// GET ONE
const getOneUser = async (req, res) => {
  const session = driver.session();
  try {
    const { uid } = req.params;
    const result = await session.run(`MATCH (u:User { uid: $uid }) RETURN u`, { uid });
    session.close();
    if (result.records.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const u = result.records[0].get('u').properties;
    delete u.password;
    res.status(200).json(u);
  } catch (error) {
    session.close();
    console.log(error);
    res.status(404).json({ message: 'Cannot get user' });
  }
};

// MODIFY ONE
const modifyUser = async (req, res) => {
  const session = driver.session();
  try {
    const { uid } = req.params;
    let name = null;
    let image = null;
    let hash = null;
    let code = null;
    let role = null;
    if (req.body.name) {
      name = req.body.name;
      const existingUser = await session.run(`MATCH (u:User {name: $name}) RETURN u`, {name});
      if (existingUser.records.length > 0) {
        session.close();
        res.status(409).json({ message: "This nickname is already taken" });
        if (req.file) {
          fs.unlink(req.file.path, err => console.log(err));
        }
        return;
      }
    }
    if (req.file) {
      image = 'http://localhost:8080/api/' + req.file.path;
      const result = await session.run(`MATCH (u:User {uid: $uid}) RETURN u.image as image`, {uid});
      oldImage = result.records[0].get("image").replace("http://localhost:8080/api/", "");
    }
    if (req.body.password) {
      const salt = bcrypt.genSaltSync(10);
      hash = bcrypt.hashSync(req.body.password, salt);
    }
    if (req.body.code) {
      code = req.body.code;
      const adminCode = await session.run(`MATCH (a:AdminCode) RETURN a.code as code`);
      const codeFromDb = adminCode.records[0].get("code");
      const isCodeValid = bcrypt.compareSync(code, codeFromDb);
      if (isCodeValid) role = 'admin';
    }
    let query = `MATCH (u:User {uid: $uid})`;
    let params = { uid };
    if (name) {
      query += ` SET u.name = $name`;
      params.name = name;
    }
    if (hash) {
      query += ` SET u.password = $hash`;
      params.hash = hash;
    }
    if (image) {
      query += ` SET u.image = $image`;
      params.image = image;
    }
    if (role) {
      query += ` SET u.role = $role`;
      params.role = role;
    }
    query += ` RETURN u`;
    
    const result = await session.run(query, params);
    session.close();
    if (result.records.length === 0) {
      if (req.file) {
        fs.unlink(image, err => console.log(err));
      }
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (req.file && oldImage !== 'images/default.jpg') {
      fs.unlink(oldImage, err => console.log(err));
    }
    const u = result.records[0].get('u').properties;
    delete u.password;
    res.status(200).json({ message: 'User modified successfully', user: u });
  } catch (error) {
    session.close();
    console.log(error);
    if (req.file) {
      fs.unlink(req.file.path, err => console.log(err));
    }
    res.status(404).json({ message: 'Error modifying user' });
  }
};

// DELETE ONE
const deleteUser = async (req, res) => {
  const session = driver.session();
  try {
    const { uid } = req.params;
    const result = await session.run(`MATCH (u:User {uid: $uid}) RETURN u.image as image`, { uid });
    const imageUrl = result.records[0].get("image");
    const imagePath = imageUrl.replace("http://localhost:8080/api/", "");
    await session.run(
      `MATCH (u:User {uid: $uid})
      OPTIONAL MATCH (u:User {uid: $uid})-[:AUTHOR]->(m:Meme)
      WITH u,m WHERE m IS NOT NULL
        DETACH DELETE u, m RETURN u
      UNION
        MATCH (u:User {uid: $uid})
        DETACH DELETE u
      RETURN u`, { uid });
    session.close();
    if (result.records.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (imagePath !== 'images/default.jpg'){
      fs.unlink(imagePath, err => console.log(err));
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    session.close();
    console.log(error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// BAN ONE
const banUser = async (req, res) => {
  const session = driver.session();
  try {
    const { uid } = req.body;
    const result = await session.run(`MATCH (u:User {uid: $uid}) SET u.role = "banned" RETURN u`, { uid });
    session.close();
    if (result.records.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    } 
    res.status(200).json({ message: 'User banned successfully' });
  } catch (error) {
    session.close();
    console.log(error);
    res.status(500).json({ message: 'Error banning user' });
  }
};

// UNBAN ONE
const unbanUser = async (req, res) => {
  const session = driver.session();
  try {
    const { uid } = req.body;
    const result = await session.run(`MATCH (u:User {uid: $uid}) SET u.role = "user" RETURN u`, { uid });
    session.close();
    if (result.records.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    } 
    res.status(200).json({ message: 'User unbanned successfully' });
  } catch (error) {
    session.close();
    console.log(error);
    res.status(500).json({ message: 'Error unbanning user' });
  }
};

// LOGIN
const login = async (req, res) => {
  const session = driver.session();
  try {
    const { name, password } = req.body;
    const result = await session.run(`MATCH (u:User {name: $name}) RETURN u`, { name });
    session.close();
    if (result.records.length === 0) {
      res.json({ message: "Invalid username or password", logged: false });
      return;
    }
    const user = result.records[0].get('u').properties;
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      res.json({ message: "Invalid username or password", logged: false });
      return;
    }
    const token = jwt.sign({ uid: user.uid, role: user.role }, 'token');
    res.cookie('token', token, 
    { maxAge: 604800000, httpOnly: true });
    delete user.password;
    res.json({ message: 'Logged in successfully', logged: true, user: user});
  } catch (error) {
    session.close();
    console.log(error);
    res.json({ message: 'Error logging in', logged: false});
  }
};

// VERIFY
const verifyUser = async (req, res) => {
  const session = driver.session();
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    const decoded = jwt.verify(token, 'token');
    //console.log(decoded);
    const result = await session.run(`MATCH (u:User {uid: $uid}) RETURN u`, { uid: decoded.uid });
    session.close();
    if (result.records.length === 0) {
      res.status(401).json({ message: 'Not authorized' });
      //console.log('not found');
      return;
    }
    const user = result.records[0].get('u').properties;
    //console.log('Authorized');
    res.json({user: user});
  } catch (error) {
    session.close();
    console.log(error);
    res.status(401).json({ message: 'Not authorized' });
  }
};

// LOGOUT
const logout = async (req, res) => {
  // console.log('logout');
  res.clearCookie('token',
  { maxAge: 604800000, httpOnly: true })
  .json({message: 'User has been logged out'});
}


module.exports = {
  //generateAdminCode,
  getAllUsers,
  getOneUser,
  addUser,
  modifyUser,
  deleteUser,
  banUser,
  unbanUser,
  login,
  verifyUser,
  logout
};
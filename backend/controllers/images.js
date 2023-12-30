// const express = require('express');
const path = require('path');

const getImage = (req, res) => {
  const name = req.params.name;
  const imagePath = `../images/${name}`;
  res.sendFile(path.join(__dirname, imagePath));
};

module.exports = {getImage};
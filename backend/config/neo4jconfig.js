const neo4j = require('neo4j-driver');
require("dotenv").config({path: "./.env"});
const uri = process.env.URI;
const login = process.env.LOGIN;
const password = process.env.PASSWORD;
const driver = neo4j.driver(uri, neo4j.auth.basic(login, password));

module.exports = driver;
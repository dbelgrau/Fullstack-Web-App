const driver = require('../config/neo4jconfig');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// MEMES TO CSV
const exportMemesToCsv = async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(`MATCH (m:Meme) RETURN m`);
    const data = result.records.map(record => record.get(0).properties);
    const csvWriter = createCsvWriter({
      path: './data/memes.csv',
      header: Object.keys(data[0])
    });
    await csvWriter.writeRecords(data.map(d => {
      return Object.entries(d).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    }));
    res.download('./data/memes.csv');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error exporting to csv' });
  } finally {
    session.close();
  }
};

// USERS TO CSV
const exportUsersToCsv = async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(`MATCH (u:User) RETURN u`);
    const data = result.records.map(record => record.get(0).properties);
    const csvWriter = createCsvWriter({
      path: './data/users.csv',
      header: Object.keys(data[0])
    });
    await csvWriter.writeRecords(data.map(d => {
      return Object.entries(d).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    }));
    res.download('./data/users.csv');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error exporting to csv' });
  } finally {
    session.close();
  }
};

// ALL TO CSV
const exportAllCSV = async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `CALL apoc.export.csv.all(null, {stream:TRUE})`);
    let csvFile = '';
    result.records.forEach(record => {
      csvFile += record.get('data') + '\n';
    });
    const filePath = './data/db.csv';
    fs.writeFileSync(filePath, csvFile, 'utf-8');
    res.download(filePath);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error exporting to csv' });
  } finally {
    session.close();
  }
};

// DB TO CYPHER
const exportCypher = async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `CALL apoc.export.cypher.all(null, {stream:true})`);
    let cypherFile = '';
    result.records.forEach(record => {
      cypherFile += record.get('cypherStatements') + '\n';
    });
    const filePath = './data/export.cypher';
    fs.writeFileSync(filePath, cypherFile, 'utf-8');
    res.download(filePath);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error exporting to cypher' });
  } finally {
    session.close();
  }
};

// IMPORT CYPHER TO DB
const importCypher = async (req, res) => {
  const session = driver.session();
  try {
    const filePath = req.file.path;
    const cypherFile = fs.readFileSync(filePath, 'utf-8');
    await session.run(`CALL apoc.cypher.runMany("${cypherFile}", {})`);
    res.status(200).json({ message: 'Import successful' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error importing cypher file' });
  } finally {
    session.close();
    fs.unlink(req.file.path, err => console.log(err));
  }
};

module.exports = {
  exportMemesToCsv,
  exportUsersToCsv,
  exportAllCSV,
  exportCypher,
  importCypher
};

const constants = {
  scannerStrategy: 'node', // or 'elastic'
  NODE_SCANNER_URL: `http://localhost:3222/scanner`,
  FILE_READER:  {
    MAX_CHUNK_LEN: 20,
    BACKTRACK_OFFSET: 10
  },


};

module.exports = {
  constants: constants
};
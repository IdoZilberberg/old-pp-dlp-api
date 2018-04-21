const path = require('path');
const express = require('express');
const txtFileProcessor = require('../services/TxtFileProcessor');
const router = express.Router();

const stringScanner = require('../services/string-scanner');

const scannerResponseParser = require('../services/scanner-response-parser');

/* GET users listing. */
router.get('/file', function (req, res, next) {
  const localPath = req.query['localpath'];
  const gdrivePath = req.query['gdrivepath'];

  const extension = path.extname(localPath);
  let func;
  switch (extension) {
    case '.txt':
      func = txtFileProcessor.processFile.bind(null, localPath);
      break;
    case '.xls': // TODO: Parse it to text, then run txtFileProcessor as in .txt case
    default:
      throw new Error(`Extension ${extension} is not supported yet, open a Github issue to the developer!`);
  }

  return func()
    .then(response => {
      return res.status(200).json(response);
    })
    .catch(function (err) {
      return res.status(500).send(err.message);
    });


});

router.post('/string', function (req, res, next) {
  const input = req.body;

  return stringScanner.runScanner(input)
    .then(function (parsedBody) {
      // const parsedScannerResponse = scannerResponseParser.parseScannerResponse(parsedBody);
      return res.status(200).json(parsedBody);
    })
    .catch(function (err) {
      return res.status(500).send(err.message);
    });
});

module.exports = router;

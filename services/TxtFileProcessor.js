const logger = require('winston');
const constants = require('./constants').constants;
const fs = require('fs');
const util = require('util');
// const randomAccessFile = require('random-access-file');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');
const stringScanner = require('./string-scanner');

function processFile(localFilePath) {

  if(!localFilePath)  {
    throw new Error()
  }

  // const promises = [];


  // const options = {
  //   truncate: false,
  //   readable: true,
  //   writable: false
  // };


  //const file = randomAccessFile(localFilePath, options);



  return new Promise((resolve, reject) => {
    const stats = fs.statSync(localFilePath);
    const filesize = stats.size;
    // let processed = 0;
    let offset = 0;
    let buflen = 0;
    let remainingChunks = 0;
    logger.info(`Starting to process local file ${localFilePath} with size ${filesize}`);
    const fd = null;
    const promises = [];
    while(offset < filesize) {

      offset = offset===0 ? 0 : offset-constants.FILE_READER.BACKTRACK_OFFSET;
      buflen = Math.min(filesize - offset, constants.FILE_READER.MAX_CHUNK_LEN);

      let readStream = fs.createReadStream(localFilePath, {fd: fd, start: offset, end: offset+buflen});
      logger.info(`Read chunk with offset ${offset}, length ${buflen} out of total ${filesize} bytes`);
      readStream.on("data", function (chunk) {

        const bufstr = decoder.write(chunk);
        ++remainingChunks;
        promises.push(stringScanner.runScanner(bufstr));
      });
      readStream.on('close', () => {
        if(remainingChunks<=1) {
          return Promise.all(promises)
            .then(results => {
              return resolve(results);
            })
            .catch(err => {
              return reject(err);
            });
        }
        --remainingChunks;
      });


      // promises.push(read(fd,buffer,0,buflen,offset));
      offset += buflen;
    }


  });

  // return Promise.all(promises)
  //   .then(results => {
  //     logger.info(`Results: ${JSON.stringify(results)}`);
  //     return results[0]; // TODO: Aggregate results
  //   });
}

module.exports = {
  processFile: processFile
};
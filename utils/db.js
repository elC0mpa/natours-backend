const db = require('mongoose');

db.Promise = global.Promise;

function connect(url) {
  db.connect(url, {
    useNewUrlParser: true,
  })
    .then(() => {
      console.log('Connected to the Database');
    })
    .catch((error) => {
      console.error(`Error trying to connect to the DB: ${error}`);
    });
}

module.exports = connect;

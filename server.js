const app = require('./utils/express');
const db = require('./utils/db');

db(process.env.mongo_url);

app.listen(3000, () => {
  console.log('App running on port 3000');
});

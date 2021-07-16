const dotenv = require('dotenv');
const app = require('./utils/express');
const db = require('./utils/db');

dotenv.config();
db(process.env.MONGO_URL);

app.listen(3000, () => {
  console.log('App running on port 3000');
});

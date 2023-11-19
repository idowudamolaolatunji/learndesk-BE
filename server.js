const path = require('path');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

// CONNECTING CONFIG FILE
dotenv.config({ path: './config.env' });

const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);
const PORT = process.env.PORT || 5050;

// CONNECT DATABASE WITH THE DB CONNECTION STRINGS FROM OUR CONFIG FILE
mongoose.connect(DB)
    .then((con) => {
        console.log('Database connected successfully!..');
    }).catch((err) => {
        console.log(err);
    })
;

// APP LISTENING ON HOST AND PORT
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}...`);
});
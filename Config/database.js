const mongodb = require('mongoose')

const mongodb_connection_url = process.env.MONGO_STR_URL

const ConnectDB = async () => {
    await mongodb.connect(mongodb_connection_url);
}


module.exports = ConnectDB


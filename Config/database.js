const mongodb = require('mongoose')

const mongodb_connection_url = "mongodb+srv://harshitha:harshitha@dbcluster.eghu41z.mongodb.net/devTinder"

const ConnectDB = async () => {
    await mongodb.connect(mongodb_connection_url);
}


module.exports = ConnectDB


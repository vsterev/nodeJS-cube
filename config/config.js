const env = process.env.NODE_ENV || 'development';
const DB_PASS = process.env.DB_PASS;
const DB_USER = process.env.DB_USER;
const config = {
    development: {
        port: process.env.PORT || 3000,
        dataBaseUrl: `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0-azuwr.mongodb.net/workshopCube`
    },
    production: {
        port: 4000,
        dataBaseUrl: 'mongodb://127.0.0.1:27017'
    }
};
module.exports = config[env];

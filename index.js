const dbConnect = require('./config/db')
const config = require('./config/config')
const app = require('express')();
const routes = require('./routes')
dbConnect()
    .then(() => {
        require('./config/express')(app);
        app.use('/', routes)
        app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));
    })
    .catch(err => {
        console.log(err);
    })
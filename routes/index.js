const indexRoute = require('../routes/pages.js');

const constructorMethod = (app) => {

    app.use('/', indexRoute);
    app.use('*', (req, res) => {
        res.status(404).json({ error: "Not Found!!" });
    });
};

module.exports = constructorMethod
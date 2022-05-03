const studentRoutes = require('./students');
const eventsRoutes = require('./events');
const informativeRoutes = require('./informative');

const constructorMethod = (app) => {
    app.use('/', studentRoutes);
    app.use('/events', eventsRoutes);
    app.use('/informative', informativeRoutes);
    app.use('*', (req, res) => {
        res.status(404).json({ error: "Not Found!!" });
    });
};

module.exports = constructorMethod;
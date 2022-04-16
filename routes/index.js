const pagesRoutes = require('./pages');


const constructorMethod = (app) => {
  app.use('/', pagesRoutes);
  app.use('*', (req, res) => {
    res.redirect('/');
  });
};

module.exports = constructorMethod;

const studentRoutes = require('./students');


const constructorMethod = (app) => {
  app.use('/', studentRoutes);


  app.use('*', (req, res) => {
    res.sendStatus(404).send("Not Found!!!");
  });
};

module.exports = constructorMethod;
const express =  require('express');
const cors = require('cors');
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');
const AppError = require('./utils/AppError');  

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);


app.get("/", (req, res) => {
    res.json({status: "event management backend is running"});
});

//404 handler
app.all(/.*/, (req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found on this server`, 404));
});

//Global error handler
app.use(errorHandler);
module.exports = app;
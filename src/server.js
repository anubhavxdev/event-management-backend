const env = require('./config/env');
const express = require('express');
const app = require('./app');

app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port} in ${env.nodeEnv} mode.`);
});
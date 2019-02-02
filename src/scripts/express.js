const path = require('path');
const express = require('express');

const isDevelopment = process.env.NODE_ENV === 'development';
const staticDir = path.join(__dirname, isDevelopment ? '../.temp' : '../.publish');

const app = express();
app.use(express.static(staticDir));
app.listen(4000);

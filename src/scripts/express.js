const path = require('path');
const express = require('express');

const app = express();
app.use(express.static(path.join(__dirname, '../.temp')));
app.listen(4000);

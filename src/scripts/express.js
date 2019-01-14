const path = require('path');
const express = require('express');

const staticDir = path.join(__dirname, '../.temp');

const app = express();
app.use(express.static(staticDir));
app.listen(4000);

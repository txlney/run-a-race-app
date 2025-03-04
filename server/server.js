import express from 'express';

const port = 8080;

const app = express();
app.use(express.static('client'));
app.listen(port);
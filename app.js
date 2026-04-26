import {config} from "dotenv";
import express from "express";
import path from "path";
import cors from "cors";
import {fileURLToPath} from "url";
import logger from "morgan";
import mongoose from "mongoose";
import connectDB from "./config/dbConn.js";
import routes from "./routes/index.js";
import states from "./routes/states.js";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDB();

app.use(logger('dev'));
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/states', states);

app.use((req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'public', '404.html'));
    } else if (req.accepts('json')) {
        res.json({error: '404 Not Found'});
    } else {
        res.type('txt').send('404 Not Found');
    }
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

export default app;

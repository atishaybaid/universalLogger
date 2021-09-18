import express from "express";
import config from "../config/dev.js";
import healthcheck from "express-healthcheck";
import MessageRecorderRouter from "./resources/MessageRecorder/router.js";
import bodyParser from 'body-parser';
import rateLimit from "express-rate-limit";
const app = express();
app.use('/healthcheck', healthcheck());
/* app.use('/static', express.static('lib')) */

app.use('/static', express.static('Agent'));

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:8080', 'https://app.birdeye.com'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return next();
});
app.use(bodyParser.json());

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 10 // limit each IP to 100 requests per windowMs
});

app.use('/record', limiter, MessageRecorderRouter);


const start = async () => {


    app.listen(config.port, () => {
        console.log(`server started on port ${config.port}`);
    })
}
start();
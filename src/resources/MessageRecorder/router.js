import express from "express";
const router = express.Router();
import { recordError } from "./controller.js"


const MessageRecorderRouter = router;

MessageRecorderRouter.post('/error', recordError);


export default MessageRecorderRouter;
import pino from 'pino';
import { makeDirectory } from "../../utils/index.js"



export const recordError = async (req, res) => {
    const reqBody = req.body;
    try {
        if (!reqBody.errorMessage) {
            return res.status(400).send({ msg: 'Error Message is missing' })
        }
        const { directoryName="web2Logs" } = reqBody;

        if (directoryName) {
            makeDirectory(`./log/${directoryName}`);
        }
        const logger = pino(pino.destination({
            dest: `./log/${directoryName}/log`, sync: false
        }));
        logger.info(reqBody);
        return res.status(200).send({ msg: 'Error Recorded Sucessfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: 'Internal server error' });
    }



}
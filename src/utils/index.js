import fs from "fs"
var dir = './tmp';


export const makeDirectory = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

}


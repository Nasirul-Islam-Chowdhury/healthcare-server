import { Server } from "http";
import app from "./app";
import config from "./config";


const main = async () => {
    const server: Server =  
    app.listen(config.port, () => {
      console.log(`app is listening on ${config.port}`);
    });
};

main();
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const expressApp_1 = __importDefault(require("./expressApp"));
const socketioServer_1 = require("./socketioServer");
// ===================================================
// Load the .env file into process.env
const dotenvLoadResult = dotenv_1.default.config();
if (dotenvLoadResult.error) {
    if (dotenvLoadResult.error.message) {
        console.log(`Error loading the .env file: "${dotenvLoadResult.error.message}"`);
    }
    throw dotenvLoadResult.error;
}
// ExpressJS Server
const httpServer = http_1.default.createServer(expressApp_1.default);
// SocketIO Server
(0, socketioServer_1.attachSocketIOServerToHttpServer)(httpServer);
// ===================================================
httpServer.listen(process.env.EXPRESS_PORT, () => {
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`Listening on http://localhost:${process.env.EXPRESS_PORT}`);
});

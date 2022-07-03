"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
  Express.js app
*/
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const root_router_1 = __importDefault(require("./expressRoutes/root/root.router"));
const users_router_1 = __importDefault(require("./expressRoutes/users/users.router"));
const chats_router_1 = __importDefault(require("./expressRoutes/chats/chats.router"));
// ========================================================
const app = (0, express_1.default)();
// Middlware
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use('/', root_router_1.default);
app.use('/users', users_router_1.default);
app.use('/chats', chats_router_1.default);
exports.default = app;

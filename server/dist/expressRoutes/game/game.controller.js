"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const GameLogic_1 = require("../../lib/GameLogic");
// import SessionStore from '../../database/SessionStore'
// ========================================================
class GameController {
    static handleBreak(req, res) {
        var _a, _b;
        if (Array.isArray((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.breaks)) {
            const trashPerColumn = (0, GameLogic_1.ProcessBreaks)((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.breaks);
            res.json(trashPerColumn);
        }
        else {
            res.json([]);
        }
    }
}
exports.GameController = GameController;

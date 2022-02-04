"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const pino_1 = __importDefault(require("pino"));
const logger = (0, pino_1.default)();
const db = new _1.DBClient(logger);
const id = 1;
const result = db.getItem(id);
result.then((id) => {
    console.log(id);
});
//# sourceMappingURL=test.js.map
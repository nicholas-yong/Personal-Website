"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const pino_1 = __importDefault(require("pino"));
const logger = (0, pino_1.default)();
const tester = new _1.DBClient(logger);
tester.createItem({
    title: "test",
    mainPicture: "www.test.com",
    teaser: "Test of a lifetime...",
    content: "Dream...",
    tags: ["food"]
});
//# sourceMappingURL=test.js.map
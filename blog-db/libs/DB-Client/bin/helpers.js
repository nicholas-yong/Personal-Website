"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAWSConnection = exports.getNumBlogItems = void 0;
const aws = __importStar(require("aws-sdk"));
const nconf_1 = __importDefault(require("nconf"));
const getNumBlogItems = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Setup the SDK
        const ssm = new aws.SSM();
        const params = {
            Name: "numBlogs"
        };
        const result = ssm.getParameter(params, (err, data) => {
            if (data && data.Parameter) {
                return data.Parameter.Value;
            }
            return;
        });
        return;
    }
    catch (e) {
        console.error(e);
    }
});
exports.getNumBlogItems = getNumBlogItems;
const setupAWSConnection = (log) => {
    aws.config.update({
        region: "ap-southeast-2"
    });
    const db = new aws.DynamoDB({
        apiVersion: "2012-08-10"
    });
    try {
        nconf_1.default.file("./config.json");
        nconf_1.default.load();
        log.info({
            test1: nconf_1.default.get("tableName"),
            test2: nconf_1.default.get("ssmBlogCountName")
        });
    }
    catch (e) {
        console.error(e);
    }
    return {
        items: nconf_1.default,
        db
    };
};
exports.setupAWSConnection = setupAWSConnection;
//# sourceMappingURL=helpers.js.map
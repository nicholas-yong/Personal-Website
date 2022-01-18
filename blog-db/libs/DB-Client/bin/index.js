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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBClient = void 0;
const helpers_1 = require("./helpers");
const aws = __importStar(require("aws-sdk"));
class DBClient {
    constructor(log) {
        this.log = log;
        this.deleteItem = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const output = yield this.queryBatchItems(id);
                if (!output || (output && output.length <= 0)) {
                    throw new Error("Invalid items returned from queryBatchItems function");
                }
                for (const item of output) {
                    const deleteParams = {
                        TableName: this.config.items.get("tableName"),
                        Key: {
                            BlogID: {
                                S: item.id.toString()
                            },
                            ItemType: {
                                S: item.rev
                            }
                        }
                    };
                    yield this.config.db.deleteItem(deleteParams).promise();
                }
            }
            catch (e) {
                console.error(e);
            }
        });
        // Setup Configuration -- this will throw if there isn't a config file inside the root of the project.
        this.config = (0, helpers_1.setupAWSConnection)(log);
    }
    queryBatchItems(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    // Note that 0 is falsy, not that it's possible to have an ID of 0 anyway.
                    throw new Error("No ID passed to function");
                }
                // We need to get the current rev of the item
                const queryParams = {
                    KeyConditionExpression: "BlogID = :id",
                    TableName: this.config.items.get("tableName"),
                    ExpressionAttributeValues: {
                        ":id": {
                            S: id.toString()
                        }
                    },
                    ScanIndexForward: false
                };
                const { $response } = yield this.config.db
                    .query(queryParams)
                    .promise();
                let output = [];
                if ($response && $response.data) {
                    const responseResult = $response.data.Items;
                    if (responseResult) {
                        output = responseResult.map((result) => {
                            return aws.DynamoDB.Converter.unmarshall(result);
                        });
                    }
                }
                else {
                    throw new Error("Unable to get latest result rev of item");
                }
                return output;
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    getItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // either a number or the string latest
                // Unary operator(+) will convert string to number
                if (isNaN(+id)) {
                    throw new Error(`Invalid parameter ${id} passed`);
                }
                const queryParams = {
                    TableName: this.config.items.get("tableName"),
                    Key: {
                        BlogID: {
                            S: id.toString(0)
                        },
                        ItemType: {
                            S: "Current"
                        }
                    }
                };
                const { $response, Item } = yield this.config.db
                    .getItem(queryParams)
                    .promise();
                if ($response.error) {
                    const error = $response.error;
                    throw new Error(error.message);
                }
                if (Item) {
                    return aws.DynamoDB.Converter.unmarshall(Item);
                }
                return;
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    createItem(item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ssm = new aws.SSM();
                const { Parameter } = yield ssm
                    .getParameter({
                    Name: this.config.items.get("ssmBlogCountName")
                })
                    .promise();
                if (!Parameter || !Parameter.Value) {
                    throw new Error("Could not get current blog count from SSM");
                }
                const newBlogID = (Parameter.Value + 1).toString();
                // We will return the created item to the client as a BlogItemDTO
                const queryParams = {
                    TableName: this.config.items.get("tableName"),
                    Item: {
                        BlogID: {
                            S: newBlogID
                        },
                        ItemType: {
                            S: "Current"
                        },
                        Title: {
                            S: item.title
                        },
                        MainPicture: {
                            S: item.mainPicture
                        },
                        Teaser: {
                            S: item.teaser
                        },
                        PublicationDate: {
                            N: new Date().getTime().toString()
                        },
                        Content: {
                            S: item.content
                        },
                        Tags: {
                            SS: item.tags
                        }
                    }
                };
                // We don't need the response (bills :() )
                yield this.config.db.putItem(queryParams).promise();
                // Need to update SSM to the next current BlogID
                yield ssm
                    .putParameter({
                    Name: this.config.items.get("ssmBlogCountName"),
                    Value: newBlogID,
                    Overwrite: true
                })
                    .promise();
                // Get the newly added item from the Table
                const result = (yield this.getItem(Number.parseInt(newBlogID)));
                return result;
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    createRevItem(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id || !item) {
                    throw new Error("Invalid parameters passed");
                }
                const output = this.queryBatchItems(id);
                // We know that due to the scan index forward, that the first item has to be the latest
                const latest = output[0];
                const insertParams = {
                    TableName: this.config.items.get("tableName"),
                    Item: {
                        BlogID: {
                            S: latest.id.toString()
                        },
                        ItemType: {
                            S: latest.rev
                        },
                        Title: {
                            S: item.title
                        },
                        MainPicture: {
                            S: item.mainPicture
                        },
                        Teaser: {
                            S: item.teaser
                        },
                        PublicationDate: {
                            N: new Date().getTime().toString()
                        },
                        Content: {
                            S: item.content
                        },
                        Tags: {
                            SS: item.tags
                        }
                    }
                };
                yield this.config.db.putItem(insertParams).promise();
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    updateItem(item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // We can add in shape validation later once we're sure all of this actually works
                if (!item) {
                    throw new Error("Item to update is not defined");
                }
                // We first need to query what the thing is updating and then insert a copy of that...
                const currentItem = yield this.getItem(item.id);
                // Transform the result into a CreateItemBlogDTO so that we can insert it as a revision
                if (!currentItem) {
                    throw new Error(`Current version of Blog Item ${item.id} not found`);
                }
                // Insert a revision of that item first.
                yield this.createRevItem(currentItem.id, currentItem);
                // Update the item
                const updateParams = {
                    TableName: this.config.items.get("tableName"),
                    ExpressionAttributeNames: {
                        "#T": "Title",
                        "#MP": "MainPicture",
                        "#TE": "Teaser",
                        "#PD": "PublicationDate",
                        "#C": "Content",
                        "#TA": "Tags"
                    },
                    ExpressionAttributeValues: {
                        ":t": {
                            S: item.title
                        },
                        ":mp": {
                            S: item.mainPicture
                        },
                        ":te": {
                            S: item.teaser
                        },
                        ":pd": {
                            S: new Date().getTime().toString()
                        },
                        ":c": {
                            S: item.content
                        },
                        ":ta": {
                            SS: item.tags
                        }
                    },
                    Key: {
                        BlogID: {
                            S: item.id.toString()
                        },
                        ItemType: {
                            S: "Current"
                        }
                    },
                    ReturnValues: "ALL_NEW",
                    UpdateExpression: "SET #T = :t, #MP = :mp, #TE = :te, #PD = :pd, #C = :c, #TA = :ta"
                };
                const updateResult = yield this.config.db
                    .updateItem(updateParams)
                    .promise();
                return updateResult.Attributes;
            }
            catch (e) {
                console.error(e);
            }
        });
    }
}
exports.DBClient = DBClient;
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const error_1 = require("../lib/error");
const validate = (schema, type = "body") => (req, res, next) => {
    try {
        const data = schema.parse(req[type]);
        req[type] = data;
        next();
    }
    catch (err) {
        if (err instanceof Error) {
            next(new error_1.BadRequestError(err.message));
        }
        else {
            next(new error_1.BadRequestError("Invalid request"));
        }
    }
};
exports.validate = validate;

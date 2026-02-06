"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const error_1 = require("./lib/error");
const error_handler_1 = require("./lib/error.handler");
const routes_1 = __importDefault(require("./routes/routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.get("/healthz", (req, res) => {
    res.status(200).json({
        status: "healty",
    });
});
app.use("/api/v1", routes_1.default);
app.use((_req, _res, next) => {
    next(new error_1.NotFoundError());
});
app.use(error_handler_1.errorHandler);
app.listen(4000, () => console.log("Server Running!"));

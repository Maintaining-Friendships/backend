"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./src/routes/index"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.get('/', (req, res) => {
    res.send('Welcome to the Maintaining Friendships API');
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server!!!! is running at https://localhost:${port}`);
});
app.use(express_1.default.json());
app.use('/api', index_1.default);

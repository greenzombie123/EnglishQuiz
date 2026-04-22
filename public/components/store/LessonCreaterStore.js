"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lesssonCreaterStore = void 0;
const store_ts_1 = __importDefault(require("./store.js"));
const initialState = {
    audioFiles: [],
    // haveSoundSelect:false
};
exports.lesssonCreaterStore = new store_ts_1.default(initialState);
//# sourceMappingURL=LessonCreaterStore.js.map
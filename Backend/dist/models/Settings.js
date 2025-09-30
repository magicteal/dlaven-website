"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const mongoose_1 = require("mongoose");
const SettingsSchema = new mongoose_1.Schema({
    smtpUser: { type: String, default: null },
    smtpPass: { type: String, default: null },
    mailFrom: { type: String, default: null },
});
exports.Settings = mongoose_1.models.Settings || (0, mongoose_1.model)("Settings", SettingsSchema);

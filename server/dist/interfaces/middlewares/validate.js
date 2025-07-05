"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => (req, res, next) => {
    var _a;
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            const errorMessage = ((_a = err.errors[0]) === null || _a === void 0 ? void 0 : _a.message) || "Validation error";
            res.status(400).json({ message: errorMessage });
            return;
        }
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(400).json({ message: errorMessage });
    }
};
exports.validate = validate;

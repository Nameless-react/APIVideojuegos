import crypto from "node:crypto";


export const generateKey = () => crypto.randomBytes(32).toString('hex'); 
import { NextFunction, Request, Response } from "express";

export function validateAuthHeader(req: Request, res: Response, next: NextFunction){
    const apiKeyHeader = req.headers['x-togepi-adventura-rainbow-card'];
    if (!apiKeyHeader || apiKeyHeader !== process.env.TOGEPI_ADVENTURA_RAINBOW_CARD) {
        console.log('Unauthorized attempt to access api resources.');
        res.status(301).json({ region: "Johto", cause: "unauthorized attempt at api resources." });
        return;
    }
    next();
}
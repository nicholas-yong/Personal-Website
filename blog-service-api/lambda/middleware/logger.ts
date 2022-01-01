import { NextFunction, RequestHandler } from "express"
import pino, { Logger } from "pino"

declare global {
	namespace Express {
		export interface Request {
			log: Logger
		}
		export interface Response {}
	}
}

export const loggerMiddleware: RequestHandler = (
	req: Express.Request,
	res: Express.Response,
	next: NextFunction
) => {
	const logger = pino()
	req.log = logger
	next()
}

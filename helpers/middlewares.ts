// Import packages
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Import db & configs
import config from '../config/configSetup';

// Import function files
import { handleResponse } from '../helpers/utility';

export const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
	//this is the url without query params
	const route: any = req.originalUrl.split('?').shift();
	let publicRoutes: string[] = config.PUBLIC_ROUTES!;

	if (publicRoutes.includes(route)) return next();

	let token: any = req.headers.authorization;
	if (!token) return handleResponse(res, 401, false, `Access Denied / Unauthorized request`);

	try {
		token = token.split(' ')[1]; // Remove Bearer from string
		if (token === 'null' || !token) return handleResponse(res, 401, false, `Unauthorized request`);
		let verified: any = jwt.verify(token, config.JWTSECRET);
		if (!verified) return handleResponse(res, 401, false, `Unauthorized request`);
		if (verified.type === 'admin') {
			req.admin = verified;
		} else {
			req.user = verified;
		}
		next();
	} catch (error) {
		handleResponse(res, 400, false, `Token Expired`);
	}
};

export const isAdmin = (roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.admin) return handleResponse(res, 401, false, `Unauthorized access`);
		if (!roles.includes(req.admin.role)) return handleResponse(res, 401, false, `Permission denied`);
		next();
	};
};

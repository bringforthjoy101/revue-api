// Import packages
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

// Import function files
import { successResponse, errorResponse, randId } from '../helpers/utility';
import { FnResponseDataType } from '../helpers/types';
import { Business } from '../services/models/businesses';

// register or create admin
const createBusiness = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { name, email, phone, userId } = req.body;
	const code = randId();
	const businesses = new Business();
	try {
		const { status, message }: FnResponseDataType = await businesses.create({
			name,
			email,
			phone,
			code,
			userId,
		});
		if (!status) return errorResponse(res, message);
		return successResponse(res, message);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// get all documents
const getBusinesses = async (req: Request, res: Response) => {
	const businesses = new Business();
	try {
		const { status, message, data }: FnResponseDataType = await businesses.getAll();
		if (!status) return errorResponse(res, message);
		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// get document details
const getBusinessDetails = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { id } = req.params;
	const businesses = new Business();
	try {
		const { status, message, data }: FnResponseDataType = await businesses.getOne(Number(id));
		if (!status) return errorResponse(res, message);
		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// update document
const updateBusiness = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { id } = req.params;
	const { name, email, phone } = req.body;
	const businesses = new Business();
	try {
		const { status, message }: FnResponseDataType = await businesses.update({
			id: Number(id),
			name,
			email,
			phone,
			userId: req.user.id,
		});
		if (!status) return errorResponse(res, message);
		return successResponse(res, message);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// delete document
const deleteBusiness = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { id } = req.params;
	const businesses = new Business();
	try {
		const { status, message }: FnResponseDataType = await businesses.delete(Number(id));
		if (!status) return errorResponse(res, message);
		return successResponse(res, message);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

export default {
	createBusiness,
	getBusinesses,
	getBusinessDetails,
	updateBusiness,
	deleteBusiness,
};

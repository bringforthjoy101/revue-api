// Import packages
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

// Import function files
import { successResponse, errorResponse } from '../helpers/utility';
import { FnResponseDataType } from '../helpers/types';
import { Staff } from '../services/models/staffs';

// register or create admin
const createStaff = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { names, email, phone, businessId } = req.body;
	const staffs = new Staff();
	try {
		const { status, message }: FnResponseDataType = await staffs.create({
			names,
			email,
			phone,
			businessId,
		});
		if (!status) return errorResponse(res, message);
		return successResponse(res, message);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// get all documents
const getStaffs = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { businessId } = req.body;
	const staffs = new Staff();
	try {
		const { status, message, data }: FnResponseDataType = await staffs.getAll(Number(businessId));
		if (!status) return errorResponse(res, message);
		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// get document details
const getStaffDetails = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { id } = req.params;
	const staffs = new Staff();
	try {
		const { status, message, data }: FnResponseDataType = await staffs.getOne(Number(id));
		if (!status) return errorResponse(res, message);
		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// update document
const updateStaff = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { id } = req.params;
	const { names, email, phone, businessId } = req.body;
	const staffs = new Staff();
	try {
		const { status, message }: FnResponseDataType = await staffs.update({
			id: Number(id),
			names,
			email,
			phone,
			businessId,
		});
		if (!status) return errorResponse(res, message);
		return successResponse(res, message);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// delete document
const deleteStaff = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { id } = req.params;
	const staffs = new Staff();
	try {
		const { status, message }: FnResponseDataType = await staffs.delete(Number(id));
		if (!status) return errorResponse(res, message);
		return successResponse(res, message);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

export default {
	createStaff,
	getStaffs,
	getStaffDetails,
	updateStaff,
	deleteStaff,
};

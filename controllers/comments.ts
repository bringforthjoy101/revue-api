// Import packages
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

// Import function files
import { successResponse, errorResponse } from '../helpers/utility';
import { FnResponseDataType } from '../helpers/types';
import { Comment } from '../services/models/comments';
import { sendCommentEmail } from '../helpers/auth';
import DB from './db';

// register or create admin
const createComment = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { comment, staffId, businessId } = req.body;
	const comments = new Comment();
	try {
		const { status, message }: FnResponseDataType = await comments.create({
			comment,
			staffId,
			businessId,
		});
		if (!status) return errorResponse(res, message);
		const { email, names } = await DB.staffs.findOne({ where: { id: staffId } });
		const sendEmail = await sendCommentEmail({ email, names, comment });
		if (!sendEmail.status) return errorResponse(res, 'An error occured');
		return successResponse(res, message);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// get all documents
const getComments = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { businessId } = req.body;
	const comments = new Comment();
	try {
		const { status, message, data }: FnResponseDataType = await comments.getAll(businessId);
		if (!status) return errorResponse(res, message);
		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// get document details
const getCommentDetails = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { id } = req.params;
	const comments = new Comment();
	try {
		const { status, message, data }: FnResponseDataType = await comments.getOne(Number(id));
		if (!status) return errorResponse(res, message);
		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// update document
const updateComment = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { id } = req.params;
	const { comment, staffId, businessId } = req.body;
	const comments = new Comment();
	try {
		const { status, message }: FnResponseDataType = await comments.update({
			id: Number(id),
			comment,
			staffId,
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
const deleteComment = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { id } = req.params;
	const comments = new Comment();
	try {
		const { status, message }: FnResponseDataType = await comments.delete(Number(id));
		if (!status) return errorResponse(res, message);
		return successResponse(res, message);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

export default {
	createComment,
	getComments,
	getCommentDetails,
	updateComment,
	deleteComment,
};

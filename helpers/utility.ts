import { Request, Response } from 'express';
import { FnResponseDataType } from './types';
import DB from '../controllers/db';

export const handleResponse = (res: any, statusCode: number, status: boolean, message: string, data?: any) => {
	return res.status(statusCode).json({
		status,
		message,
		data,
	});
};

export const successResponse = (res: any, message: string = 'Operation successfull', data?: any) => {
	return res.status(200).json({
		status: true,
		message,
		data,
	});
};

export const errorResponse = (res: any, message: string = 'An error occured', data?: any) => {
	return res.status(400).json({
		status: false,
		message,
		data,
	});
};

export const fnResponse = ({ status, message, data }: FnResponseDataType) => {
	return { status, message, data };
};

export const generateOtp = () => {
	return Math.floor(Math.random() * 999999 + 1);
};

export const addMinutesToDate = (date: Date, minutes: number) => {
	return new Date(date.getTime() + minutes * 60000);
};

export const otpValidity = (a: Date, b: Date) => {
	if (a.getTime() > b.getTime()) return true;
	return false;
};

export const randId = () => {
	return Math.floor(Math.random() * 100000000000 + 1).toString(16);
};

export const getIdentity = (req: Request) => {
	const parameter: { identity?: 'user' | 'admin' | undefined; id?: number } = {};
	if (req.user) {
		(parameter.identity = 'user'), (parameter.id = req.user.id);
	} else {
		parameter.identity = 'admin';
	}
	return parameter;
};

export const saveUserCard = async (data: any) => {
	const insertCardData = {
		type: data.card.type,
		token: data.card.token,
		first6: data.card.first_6digits,
		last4: data.card.last_4digits,
		bank: data.card.issuer,
		gateway: 'flutterwave',
		userId: data.meta.userId,
	};
	const { first6, last4, userId } = insertCardData;
	try {
		const cardExists = DB.cards.findOne({ where: { first6, last4, userId } });
		if (!cardExists) {
			await DB.cards.create(insertCardData);
		}
	} catch (error) {
		console.log(error);
	}
};

export const validateObject = (obj: any) => {
	for (var key in obj) {
		if (obj[key] == null || obj[key] == '') return false;
	}
	return true;
};

export const validateData = (data: string | number, type: 'string' | 'number') => {
	if (typeof data == type && data != '') {
		if (type == 'number' && isNaN(Number(data))) {
			// validateDataErrorMsg(data,type,resource,errorArr,config,rowData);
			return false;
		}
		return data;
	}
	// validateDataErrorMsg(data,type,resource,errorArr,config,rowData);
	return false;
};

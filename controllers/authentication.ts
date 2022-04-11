// Import packages
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Import db & configs
import config from '../config/configSetup';
import DB from './db';

// Import function files
import { handleResponse, successResponse, errorResponse, otpValidity } from '../helpers/utility';
import {
	RegisterDataType,
	TokenDataType,
	typeEnum,
	VerifyOtpDataType,
	FnResponseDataType,
	ChangePasswordDataType,
	channelTypeEnum,
	AuthPayloadDataType,
} from '../helpers/types';
import { activateAccount, login, sendOtp } from '../helpers/auth';
import { Op } from 'sequelize';

export const register = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}

	const { names, phone, email, password } = req.body;

	//Hash password
	const salt: string = await bcrypt.genSalt(15);
	const hashPassword: string = await bcrypt.hash(password, salt);

	let insertData: RegisterDataType = { names, phone, email, password: hashPassword };

	try {
		const userExists: any = await DB.users.findOne({
			where: { [Op.or]: [{ email }, { phone }] },
			include: { model: DB.businesses, attributes: ['id', 'name', 'email', 'code'] },
			attributes: { exclude: ['createdAt', 'updatedAt'] },
		});

		// if user exists, stop the process and return a message
		if (userExists) return handleResponse(res, 400, false, `user with email ${email}  or phone ${phone} already exists`);

		const user: any = await DB.users.create(insertData);

		if (user) {
			await DB.userSettings.create({ userId: user.id });
			const regData = await sendOtp({ channel: email, type: typeEnum.VERIFICATION, channelType: channelTypeEnum.EMAIL });
			if (!regData.status) return errorResponse(res, 'An error occured');
			return successResponse(res, `Registration successfull`, regData.data);
		} else {
			return handleResponse(res, 401, false, `An error occured`);
		}
	} catch (error) {
		console.log(error);
		return handleResponse(res, 401, false, `An error occured - ${error}`);
	}
};

export const preLogin = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}

	const { email, password } = req.body;

	try {
		const user = await DB.users.findOne({
			where: { email },
			attributes: { exclude: ['createdAt', 'updatedAt'] },
			include: { model: DB.userSettings, attributes: { exclude: ['createdAt', 'updatedAt'] } },
		});

		if (user) {
			if (user.userSetting.twoFa) {
				const sendOtpResponse: FnResponseDataType = await sendOtp({
					channel: user.userSetting.twoFaChannel === 'email' ? email : user.phone,
					password,
					type: typeEnum.TWOFA,
					channelType: user.userSetting.twoFaChannel === 'email' ? channelTypeEnum.EMAIL : channelTypeEnum.PHONE,
				});
				if (!sendOtpResponse.status) return errorResponse(res, sendOtpResponse.message);
				const data: TokenDataType = { type: '2fa', token: sendOtpResponse.data };
				return successResponse(res, sendOtpResponse.message, data);
			} else {
				const loginResponse: FnResponseDataType = await login({ email, password });
				if (!loginResponse.status) return errorResponse(res, loginResponse.message);
				return successResponse(res, loginResponse.message, loginResponse.data);
			}
		} else {
			return handleResponse(res, 401, false, `Incorrect Email`);
		}
	} catch (error) {
		console.log(error);
		return handleResponse(res, 401, false, `An error occured - ${error}`);
	}
};

export const resendOtp = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}

	const { email, type } = req.body;
	const user = await DB.users.findOne({ where: { email } });
	if (!user) return errorResponse(res, `User with email ${email} not found!`);
	const otpType = type === typeEnum.VERIFICATION ? typeEnum.VERIFICATION : type === typeEnum.TWOFA ? typeEnum.TWOFA : typeEnum.RESET;
	const regData = await sendOtp({ channel: email, type: otpType, channelType: channelTypeEnum.EMAIL });
	if (!regData.status) return errorResponse(res, 'An error occured');
	return successResponse(res, `Successfull`, regData.data);
};

export const updatePassword = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}

	const { email, oldPassword, newPassword } = req.body;
	try {
		const user = await DB.users.findOne({ where: { email, status: 'active' }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
		if (!user) return errorResponse(res, `user not found!`);
		const validPassword: boolean = await bcrypt.compareSync(oldPassword, user.password);
		if (!validPassword) return errorResponse(res, `Incorrect  old password!`);
		const salt: string = await bcrypt.genSalt(15);
		const hashPassword: string = await bcrypt.hash(newPassword, salt);
		const updatedPassword: any = await user.update({ password: hashPassword });
		if (!updatedPassword) return errorResponse(res, `Unable update password!`);
		return successResponse(res, `Password updated successfully`);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

export const resetPassword = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}

	const { email } = req.body;

	try {
		const user = await DB.users.findOne({
			where: { email },
			attributes: { exclude: ['createdAt', 'updatedAt'] },
		});

		if (user) {
			const sendOtpResponse: FnResponseDataType = await sendOtp({ channel: email, type: typeEnum.RESET, channelType: channelTypeEnum.EMAIL });
			if (!sendOtpResponse.status) return errorResponse(res, sendOtpResponse.message);
			return successResponse(res, sendOtpResponse.message, sendOtpResponse.data);
		} else {
			return errorResponse(res, `Record with email ${email} not found`);
		}
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

export const changePassword = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { token, password }: ChangePasswordDataType = req.body;

	try {
		const decoded: any = jwt.verify(token, config.JWTSECRET);
		if (!decoded) return errorResponse(res, `Invalid verification`);

		const user = await DB.users.findOne({ where: { email: decoded.email, status: 'active' }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
		if (!user) return errorResponse(res, `Account Suspended!, Please contact support!`);
		const salt: string = await bcrypt.genSalt(15);
		const hashPassword: string = await bcrypt.hash(password, salt);
		const updatedPassword: any = await user.update({ password: hashPassword });
		if (!updatedPassword) return errorResponse(res, `Unable update password!`);
		return successResponse(res, `Password changed successfully`);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

export const verifyOtp = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	try {
		var currentdate = new Date();
		const { token, otp, client, type }: VerifyOtpDataType = req.body;
		const decoded: any = jwt.verify(token, config.JWTSECRET);
		if (!decoded) return errorResponse(res, `Invalid verification`);

		if (decoded.client != client) return errorResponse(res, `OTP was not sent to this particular email`);

		const otpInstance = await DB.otp.findOne({ where: { id: decoded.otpId } });

		if (!otpInstance) return errorResponse(res, `OTP does not exists`);
		if (otpInstance.verified) return errorResponse(res, `OTP Already Used`);
		if (!otpValidity(otpInstance.expirationTime, currentdate)) return errorResponse(res, 'OTP Expired');
		if (otp != otpInstance.otp) return errorResponse(res, 'OTP NOT Matched');

		const updateData = { verified: true, verifiedAt: currentdate };
		await otpInstance.update(updateData);

		if (type === typeEnum.TWOFA) {
			const loginResponse: FnResponseDataType = await login({ email: client, password: decoded.password });
			if (!loginResponse.status) return errorResponse(res, loginResponse.message);
			return successResponse(res, 'Login Successful', loginResponse.data);
		} else if (type === typeEnum.RESET) {
			if (decoded.password) return errorResponse(res, 'Suspicious attempt discovered! Pls reset password again');
			return successResponse(res, 'OTP Matched', token);
		} else {
			const accountActivated = await activateAccount(client);
			if (!accountActivated.status) return errorResponse(res, accountActivated.message);
			// Create and assign token
			const { id, email, names, phone, status, businesses } = accountActivated.data;
			let payload: AuthPayloadDataType = {
				id,
				email,
				names,
				phone,
				status,
				businesses,
				type: 'user',
			};
			const encodedToken: string = jwt.sign(payload, config.JWTSECRET);
			const data: TokenDataType = { type: 'token', token: encodedToken, user: payload };
			return successResponse(res, 'Email verified', data);
		}
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

export const updateUserSettings = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { twoFa, twoFaChannel } = req.body;
	const { id } = req.user;

	try {
		const user = await DB.userSettings.findOne({ where: { userId: id } });
		const updateData = {
			twoFa: twoFa ? twoFa : user.twoFa,
			twoFaChannel: twoFaChannel ? twoFaChannel : user.twoFaChannel,
		};
		const updatedSettings: any = await user.update(updateData);
		if (!updatedSettings) return errorResponse(res, `Unable update settings!`);
		return successResponse(res, `Settings updated successfully`);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

export const updateUserProfile = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { names, email, phone } = req.body;
	const { id } = req.user;

	try {
		const user = await DB.users.findOne({ where: { id } });
		const emailOrPhoneExists = await DB.users.findAll({ where: { [Op.or]: [{ email }, { phone }] } });
		if (emailOrPhoneExists.length > 1) return errorResponse(res, `email or phone already registered with another user`);
		const updateData = {
			names: names || user.names,
			email: email === user.email ? email : !email ? user.email : user.email,
			phone: phone === user.phone ? phone : !phone ? user.phone : user.phone,
		};
		const updatedProfile: any = await user.update(updateData);
		if (!updatedProfile) return errorResponse(res, `Unable to update profile!`);
		return successResponse(res, `Profile updated successfully`);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

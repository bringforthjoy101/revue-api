// Import packages
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Import DB and configs
import DB from '../controllers/db';
import config from '../config/configSetup';

// Import types & function files
import { SendOtpDataType, OtpDetailsDataType, LoginDataType, AuthPayloadDataType, TokenDataType, channelTypeEnum } from './types';
import { generateOtp, addMinutesToDate, fnResponse } from './utility';
import { getOtpTemplateData, commentEmailTemplateData } from '../services/mailer/templateData';
import { prepareMail } from '../services/mailer/mailer';
import { mailTemplate } from '../services/mailer/template';
import { getSmsOtpTemplateData } from '../services/sms/templateData';
import { prepareSms } from '../services/sms/sms';

export const sendOtp = async ({ channel, type, password, channelType }: SendOtpDataType) => {
	try {
		//Generate OTP
		const otp: number = generateOtp(),
			now: Date = new Date(),
			expirationTime: Date = addMinutesToDate(now, 10);

		const otpInstance = await DB.otp.create({ otp, expirationTime });

		// Create details object containing the email and otp id
		const otpDetails: OtpDetailsDataType = {
			timestamp: now,
			client: channel,
			password,
			success: true,
			message: 'OTP sent to user',
			otpId: otpInstance.id,
		};

		// Encrypt the details object
		const encoded: string = jwt.sign(JSON.stringify(otpDetails), config.JWTSECRET);

		if (channelType === channelTypeEnum.EMAIL) {
			const { mailSubject, mailBody } = getOtpTemplateData({ otp, type });

			// prepare and send mail
			const sendEmail = await prepareMail({
				mailRecipients: channel,
				mailSubject,
				mailBody: mailTemplate({ subject: mailSubject, body: mailBody }),
				senderName: config.MAIL_FROM_NAME,
				senderEmail: config.MAIL_FROM,
			});

			if (sendEmail.status) return fnResponse({ status: true, message: 'OTP Sent', data: encoded });
			return fnResponse({ status: false, message: 'OTP not sent' });
		} else {
			const { smsBody } = getSmsOtpTemplateData({ otp, type });
			const sendSms = await prepareSms({ phone: channel, text: smsBody });
			if (sendSms.status) return fnResponse({ status: true, message: 'OTP Sent', data: encoded });
			return fnResponse({ status: false, message: 'OTP not sent' });
		}
	} catch (error: any) {
		console.log(error);
		return fnResponse({ status: false, message: `An error occured:- ${error}` });
	}
};

export const sendCommentEmail = async ({ email, names, comment }: { email: string; names: string; comment: string }) => {
	console.log(names, email);
	try {
		const { mailSubject, mailBody } = commentEmailTemplateData({ names, comment });

		// prepare and send mail
		const sendEmail = await prepareMail({
			mailRecipients: email,
			mailSubject,
			mailBody: mailTemplate({ subject: mailSubject, body: mailBody }),
			senderName: config.MAIL_FROM_NAME,
			senderEmail: config.MAIL_FROM,
		});

		if (sendEmail.status) return fnResponse({ status: true, message: 'Mail Sent' });
		return fnResponse({ status: false, message: 'Mail not sent' });
	} catch (error: any) {
		console.log(error);
		return fnResponse({ status: false, message: `An error occured:- ${error}` });
	}
};

export const login = async ({ email, password }: LoginDataType) => {
	try {
		const user = await DB.users.findOne({
			where: { email },
			include: { model: DB.businesses, attributes: ['id', 'name', 'email', 'code'] },
			attributes: { exclude: ['createdAt', 'updatedAt'] },
		});
		console.log(user);
		if (user) {
			const validPass: boolean = await bcrypt.compareSync(password, user.password);
			if (!validPass) return fnResponse({ status: false, message: 'Email or Password is incorrect!' });

			if (user.status === 'inactive') return fnResponse({ status: false, message: 'Account pending activation!, Please contact support!' });

			// Create and assign token
			let payload: AuthPayloadDataType = {
				id: user.id,
				email,
				names: user.names,
				phone: user.phone,
				status: user.status,
				businesses: user.businesses,
				type: 'user',
			};
			const token: string = jwt.sign(payload, config.JWTSECRET);
			const data: TokenDataType = { type: 'token', token, user: payload };
			return fnResponse({ status: true, message: 'Login successfull', data });
		} else {
			return fnResponse({ status: false, message: 'Incorrect Email' });
		}
	} catch (error) {
		console.log(error);
		return fnResponse({ status: false, message: `An error occured - ${error}` });
	}
};

export const activateAccount = async (email: string) => {
	try {
		const user = await DB.users.findOne({
			where: { email },
			include: { model: DB.businesses, attributes: ['id', 'name', 'email', 'code'] },
			attributes: { exclude: ['createdAt', 'updatedAt'] },
		});
		await user.update({ status: 'active' });
		const data = {
			id: user.id,
			email: user.email,
			names: user.names,
			phone: user.phone,
			status: user.status,
			businesses: user.businesses,
		};
		return fnResponse({ status: true, message: 'User Activated', data });
	} catch (error) {
		console.log(error);
		return fnResponse({ status: false, message: `An error occured - ${error}` });
	}
};

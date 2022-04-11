import { body, param } from 'express-validator';
import { ValidOtpType, ValidStatus } from './helpers/types';

const users = (method: string): any => {
	switch (method) {
		case '/register': {
			return [
				body('names').not().isEmpty().isString().withMessage('names is required!'),
				body('email').not().isEmpty().isString().withMessage('Email is required!'),
				body('password').not().isEmpty().isString().withMessage('Password is required!'),
				body('phone').not().isEmpty().isString().withMessage('Phone is required!'),
				body('role').optional().isString().withMessage('role is required'),
			];
		}
		case '/login': {
			return [
				body('email').not().isEmpty().isString().withMessage('Email is required!'),
				body('password').not().isEmpty().isString().withMessage('Password is required!'),
			];
		}
		case '/resend-otp': {
			const validType = [ValidOtpType.VERIFICATION, ValidOtpType.RESET, ValidOtpType.TWOFA];
			return [
				body('email').not().isEmpty().isString().withMessage('Email is required!'),
				body('type')
					.not()
					.isEmpty()
					.custom((value) => validType.includes(value))
					.withMessage(`type can only include ${validType}`),
			];
		}
		case '/update-user-settings': {
			return [
				body('twoFa').optional().isBoolean().withMessage('2fa is required and must be boolean!'),
				body('twoFaChannel').optional().isString().withMessage('twoFaChannel is required and must be boolean!'),
			];
		}
		case '/update-user-profile': {
			return [
				body('email').optional().isString().withMessage('Email is required!'),
				body('names').optional().isString().withMessage('Names is required!'),
				body('phone').optional().isString().withMessage('Phone is required!'),
			];
		}
		case '/update-password': {
			return [
				body('email').not().isEmpty().isString().withMessage('Email is required!'),
				body('oldPassword').not().isEmpty().isString().withMessage('Old password is required!'),
				body('newPassword').not().isEmpty().isString().withMessage('New password is required!'),
			];
		}
		case '/reset-password': {
			return [body('email').not().isEmpty().isString().withMessage('Email is required!')];
		}
		case '/change-password': {
			return [
				body('token').not().isEmpty().isString().withMessage('token is required!'),
				body('password').not().isEmpty().isString().withMessage('password is required!'),
			];
		}
		case '/verify-otp': {
			const validType = [ValidOtpType.VERIFICATION, ValidOtpType.RESET, ValidOtpType.TWOFA];
			return [
				body('token').not().isEmpty().isString().withMessage('token is required!'),
				body('client').not().isEmpty().isString().withMessage('client is required!'),
				body('type')
					.not()
					.isEmpty()
					.custom((value) => {
						return validType.includes(value);
					})
					.withMessage(`type can only include ${validType}`),
				body('otp')
					.not()
					.isEmpty()
					.custom((value) => {
						return Number(value);
					})
					.withMessage('otp is required!'),
			];
		}
		case '/update/status': {
			const validStatus = [ValidStatus.ACTIVATED, ValidStatus.DEACTIVATED];
			return [
				param('id').isInt().withMessage('ID must be a number!'),
				body('status')
					.not()
					.isEmpty()
					.custom((value) => {
						return validStatus.includes(value);
					})
					.withMessage(`status can only include ${validStatus}`),
			];
		}
		case 'id': {
			return [param('id').isInt().withMessage('ID must be a number!')];
		}

		case '/payment/link': {
			return [
				body('bookingId').not().isEmpty().isString().withMessage('Select Data is required!'),
				body('saveCard')
					.not()
					.isEmpty()
					.isString()
					.withMessage('Select Data is required!')
					.isBoolean()
					.withMessage('saveCard be a boolean true or false'),
			];
		}
	}
};

export default users;

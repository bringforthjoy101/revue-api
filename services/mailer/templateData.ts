// Import types
import { StaffOnboardingTemplateData, GetOtpTemplateDataType, typeEnum } from '../../helpers/types';

export const getOtpTemplateData = ({ otp, type }: GetOtpTemplateDataType) => {
	if (type === typeEnum.VERIFICATION) {
		return {
			mailSubject: 'Email Verification',
			mailBody: `
				<p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">Hi, User</p>
				<p>OTP for your email verification is :</p>
				<p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">${otp}</p>
				<p>This OTP is valid for only 10 minutes</p>
			`,
		};
	} else if (type === typeEnum.RESET) {
		return {
			mailSubject: 'Password Reset',
			mailBody: `
				<p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">Hi, User</p>
				<p>OTP for your password reset request is :</p>
				<p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">${otp}</p>
				<p>This OTP is valid for only 10 minutes</p>
			`,
		};
	} else {
		return {
			mailSubject: 'Two Factor Authentication',
			mailBody: `
				<p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">Hi, User</p>
				<p>OTP for your 2FA is :</p>
				<p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">${otp}</p>
				<p>This OTP is valid for only 10 minutes</p>
			`,
		};
	}
};

export const staffOnboardingTemplateData = ({ names, role }: StaffOnboardingTemplateData) => {
	return {
		mailSubject: 'Staff Onboarding',
		mailBody: `
			<p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">Welcome onboard, ${names.split(' ')[0]}</p>
			<p>A ${role} admnistrative account has been registered for you.</p>
			<p>Pls login with your email and the default password.</p>
			<p>You will be prompted to change your account's default's password upon login.</p>
		`,
	};
};

export const commentEmailTemplateData = ({ names, comment }: { names: string; comment: string }) => {
	return {
		mailSubject: 'New Comment',
		mailBody: `
			<p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">Hello, ${names.split(' ')[0]}</p>
			<p>someone droped a comment for you.</p>
			<br/>
			<p>${comment}</p>
		`,
	};
};

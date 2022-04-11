// TYPES
export type RegisterDataType = {
	names: string;
	phone: string;
	email: string;
	password: string;
	role?: string;
};
export type AuthPayloadDataType = {
	id: number;
	names: string;
	phone: string;
	email: string;
	status: string;
	role?: string;
	businesses?: number[];
	type: string;
};
export type TokenDataType = {
	type: 'token' | '2fa';
	token: string;
	user?: AuthPayloadDataType;
	admin?: AuthPayloadDataType;
};
export type SendMailDataType = {
	senderName: string;
	senderEmail: string;
	mailRecipients: string[] | string;
	mailSubject: string;
	mailBody: string;
	mailAttachments?: string;
};
export type PrepareMailDataType = {
	mailRecipients: string[] | string;
	mailSubject: string;
	mailBody: string;
	senderName: string;
	senderEmail: string;
};
export type ContactUsTemplateDataType = {
	name: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
};
export type SubscribeTemplateDataType = {
	firstName: string;
	email: string;
};
export type OtpDetailsDataType = {
	timestamp: Date;
	client: string;
	password?: string;
	success: boolean;
	message: string;
	otpId: number;
};
export type SendOtpDataType = {
	channel: string;
	type: typeEnum;
	password?: string;
	channelType: channelTypeEnum;
};
export type OtpMailTemplateDataType = {
	subject: string;
	body: string;
};
export type GetOtpTemplateDataType = {
	otp: number;
	type: typeEnum;
};
export type VerifyOtpDataType = {
	token: string;
	otp: number;
	client: string;
	type: typeEnum;
};
export type LoginDataType = {
	email: string;
	password: string;
};
export type FnResponseDataType = {
	status: boolean;
	message: string;
	data?: any;
};
export type ChangePasswordDataType = {
	token: string;
	password: string;
};
export type SendSmsDataType = {
	phone: string;
	text: string;
};
export type PrepareSmsDataType = {
	recipents: string;
};

export type StaffOnboardingTemplateData = {
	names: string;
	role: string;
};

export type StaffDataType = {
	id?: number;
	names: string;
	email: string;
	phone: string;
	status?: string;
	businessId?: number;
};

export type CommentDataType = {
	id?: number;
	comment: string;
	staffId?: string;
	businessId?: number;
};

export type BusinessDataType = {
	id?: number;
	name: string;
	email: string;
	phone: string;
	code?: string;
	status?: string;
	userId?: number;
};

// ENUM
export enum typeEnum {
	VERIFICATION = 'verification',
	RESET = 'reset',
	TWOFA = '2fa',
}
export enum channelTypeEnum {
	PHONE = 'phone',
	EMAIL = 'email',
}
export enum AdminRoles {
	CONTROL = 'control',
	SUPPORT = 'support',
}
export enum ValidOtpType {
	VERIFICATION = 'verification',
	RESET = 'reset',
	TWOFA = '2fa',
}
export enum ValidStatus {
	ACTIVATED = 'activate',
	DEACTIVATED = 'deactivate',
}

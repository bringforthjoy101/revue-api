// Import packages
import sgMail from '@sendgrid/mail';

// Import configs
import config from '../../config/configSetup';

// Import function files
import { SendMailDataType, PrepareMailDataType } from '../../helpers/types';

export const sendMail = async ({ senderName, senderEmail, mailRecipients, mailSubject, mailBody, mailAttachments }: SendMailDataType) => {
	try {
		sgMail.setApiKey(config.SENDGRID_API_KEY);

		const msg = {
			to: mailRecipients,
			from: `${senderName} <${senderEmail}>`,
			subject: mailSubject,
			html: mailBody,
		};

		sgMail.send(msg).then(
			() => {},
			(error) => {
				console.error(error);
				return {
					status: false,
					message: `Email not sent ${error}`,
				};
			}
		);
		return {
			status: true,
			message: 'Email sent successfully',
		};
	} catch (error) {
		console.log(error);
		return {
			status: false,
			message: `Email not sent ${error}`,
			email: mailRecipients,
		};
	}
};

export const prepareMail = async ({ mailRecipients, mailSubject, mailBody, senderName, senderEmail }: PrepareMailDataType) => {
	const _sendMail: any = await sendMail({
		senderName,
		senderEmail,
		mailRecipients,
		mailSubject,
		mailBody,
	});
	return { status: _sendMail.status, message: _sendMail.message };
};

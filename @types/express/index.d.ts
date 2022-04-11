export {};

declare global {
	namespace Express {
		interface Request {
			user?: any;
			admin?: any;
		}
	}
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: string;
			PORT: string;
			SSL: string;
			JWTSECRET: string;
			JWT_EXPIRY_TIME: string;
			DBNAME: string;
			DBUSERNAME: string;
			DBPASSWORD: string;
			DBHOST: string;
			DBPORT: string;
			DBDIALECT: string;
			MAIL_FROM: string;
			MAIL_FROM_NAME: string;
			LOGO: string;
			BASE_API_URL: string;
			SENDGRID_API_KEY: string;
			TWILLIO_ACCOUNT_SID: string;
			TWILLIO_AUTH_TOKEN: string;
			TWILLIO_MESSAGE_SERVICE_ID: string;
			WAKANOW_SERVICE_URL: string;
			WAKANOW_GRANT_TYPE: string;
			WAKANOW_USERNAME: string;
			WAKANOW_PASSWORD: string;
			FLUTTERWAVE_BASE_API_URL: string;
			FLUTTERWAVE_SEC_KEY: string;
			SATGURU_SERVICE_URL: string;
			PUBLIC_ROUTES: string;
		}
	}
}

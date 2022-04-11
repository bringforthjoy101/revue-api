import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config/configSetup';
import { isAuthorized } from './helpers/middlewares';

// routes
import routes from './routes';

const app: Application = express();

app.use(morgan('dev'));

// PARSE JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ENABLE CORS AND START SERVER
app.use(cors({ origin: true }));
app.listen(config.PORT, () => {
	console.log(`Server started on port ${config.PORT}`);
});

// Routes
app.all('*', isAuthorized);
app.use(routes);

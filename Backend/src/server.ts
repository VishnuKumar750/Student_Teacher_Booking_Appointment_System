import dotenv from 'dotenv';
import app from './app';

dotenv.config();
import { config } from './config/app.config';
import { connectDB } from './config/db.config';

const PORT = config.PORT;

const startServer = async () => {
	try {
		await connectDB();

		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`)
		})
	} catch(err) {
		console.log('Failed to start server', err);
		process.exit(1);
	}
};

startServer();

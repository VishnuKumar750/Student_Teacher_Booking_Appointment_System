import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import ratelimit from 'express-rate-limit';

const app: Application = express();

// middleware
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = ratelimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'Too many request from this IP, Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.get('/', (req: Request, res: Response) => {
  res.send('hello world');
});

// app.all('*', (req: Request) => {

// })

export default app;

import 'express-async-errors';
import express, { Request, Response, json } from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import router from './routers/index-routes';
import errorHandlingMiddleware from './middlewares/error-handling';

const app = express();

app.use(cors());
app.use(json());
app.use(router);
app.get('/health', (req: Request, res: Response) => {
  res.status(httpStatus.OK).send("I'm Ok");
});
app.use(errorHandlingMiddleware);

export default app;

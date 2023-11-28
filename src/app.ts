import 'express-async-errors';
import express, { json } from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(json());

export default app;

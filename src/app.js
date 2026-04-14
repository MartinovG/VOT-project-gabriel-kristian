import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { router as apiRoutes } from './routes/api.js';

export const app = express();

app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    if(res.headersSent) { return next(err); }
    res.status(500).send('Something broke!');
});

export default app;

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes     from './routes/auth.routes.js';
import driversRoutes  from './routes/drivers.routes.js';
import tripsRoutes    from './routes/trips.routes.js';
import vehiclesRoutes from './routes/vehicles.routes.js';
import routesRoutes   from './routes/routes.routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth',     authRoutes);
app.use('/api/drivers',  driversRoutes);
app.use('/api/trips',    tripsRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/routes',   routesRoutes);

export default app;

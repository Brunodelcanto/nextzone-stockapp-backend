import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import "dotenv/config";
import connectDB from './database.js'
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "res.cloudinary.com"], 
    },
  },
}));

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,               
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api", routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
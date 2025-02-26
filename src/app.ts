import http from 'http';
import express from 'express';
import admin from 'firebase-admin';
import connectDB from './config/db-config';
import snapshotRouter from './routers/snapshot-router';
import cors from 'cors';
import SocketService from './sockets/socket-service';

// Check if the FIREBASE_SERVICE_ACCOUNT environment variable is set.
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set');
}

// Parse the service account JSON from base64 to object.
const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString());
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

let app = express();

app.use(express.json());

app.use(cors({
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
    optionsSuccessStatus: 200
}));

let server = http.createServer(app);

// Connect to MongoDB
connectDB();

app.use('/drawings', snapshotRouter);

const socketService = new SocketService();
socketService.init(server);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
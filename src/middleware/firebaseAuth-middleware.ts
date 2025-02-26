import { Request, Response, NextFunction } from "express";
import admin from 'firebase-admin';

const firebaseMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: Missing token' });
        return;
    }

    const token = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);

        (req as any).user = decodedToken;
        next();
    } catch (e) {
        console.error('Error verifying token:', e);
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
        return;
    }
}

export default firebaseMiddleware;
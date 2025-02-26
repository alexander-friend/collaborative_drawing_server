import { Router } from "express";
import { createSnapshot, getUserSnapshots, updateSnapshot, deleteSnapshot, getSnapshot } from "../controllers/snapshot-controller";
import firebaseAuthMiddleware from "../middleware/firebaseAuth-middleware";

const snapshotRouter = Router();

snapshotRouter.post('/createSnapshot', firebaseAuthMiddleware, createSnapshot);
snapshotRouter.get('/getSnapshots', firebaseAuthMiddleware, getUserSnapshots);
snapshotRouter.get('/getSnapshot', firebaseAuthMiddleware, getSnapshot);
snapshotRouter.put('/updateSnapshot', firebaseAuthMiddleware, updateSnapshot);
snapshotRouter.delete('/deleteSnapshot', firebaseAuthMiddleware, deleteSnapshot);

export default snapshotRouter;
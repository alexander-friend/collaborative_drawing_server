import { Request, Response } from "express";
import Snapshot from "../models/snapshot-model";
import { SnapshotInterface } from "../types/snapshot-interface";

export const createSnapshot = async (req: Request<{}, {}, SnapshotInterface>, res: Response) => {
    try {
        const { name, width, height, version } = req.body;

        const userId = (req as any).user.uid;

        const snapshot = new Snapshot({
            name,
            width,
            height,
            version,
            userId,
        });

        const snapshotDoc = await snapshot.save();

        res.status(201).json({
            message: 'snapshot-created',
            drawingId: snapshotDoc._id,
            snapshot: snapshotDoc,
        });
    } catch (e) {
        console.error('Error creating snapshot:', e);
        res.status(500).json({
            message: 'snapshot-creation-failed',
        });
    }
}

export const getUserSnapshots = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.uid;
        console.log('userId:', userId);
        const snapshots = await Snapshot.find({ userId: userId });
        res.json(snapshots);
    } catch (error) {
        res.status(500).json({ error: 'Server error retrieving snapshots' });
    }
};

export const getSnapshot = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;

        const snapshot = await Snapshot.findOne({ _id: id });

        if (!snapshot) {
            res.status(404).json({ error: 'Snapshot not found' });
        }
        res.json(snapshot);
    } catch (e) {
        res.status(500).json({ error: 'Server error retrieving snapshot' });
    }
};

export const updateSnapshot = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.uid;

        const { id, data } = req.body;

        console.log('data: ', data);
        console.log('id: ', id);

        const snapshot = await Snapshot.findOneAndUpdate({ _id: id, userId: userId }, { data: data }, { new: true, runValidators: true });

        if (!snapshot) {
            res.status(404).json({ error: 'Snapshot not found' });
        }
    } catch (error) {
        console.log('Error updating snapshot:', error);
        res.status(500).json({ error: 'Server error updating snapshot' });
    }
};

export const deleteSnapshot = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.uid;
        const { id } = req.body;

        const snapshot = await Snapshot.findOneAndDelete({ _id: id, userId: userId });

        if (!snapshot) {
            res.status(404).json({ error: 'Snapshot not found' });
        }

        res.json({ message: 'Snapshot deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error deleting snapshot' });
    }
}


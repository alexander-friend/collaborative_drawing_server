import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const PointSchema = new Schema({
    dx: { type: Number, required: true },
    dy: { type: Number, required: true },
});

const LineSchema = new Schema({
    id: { type: String, required: true },
    version: { type: Number, required: true },
    points: { type: [PointSchema], required: true },
})

const snapshotSchema = new Schema({
    name: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    version: { type: Number, required: true },
    userId: { type: String, required: true },
    data: [
        { type: [LineSchema], default: [] },
    ],
}, { timestamps: true });

const Snapshot = model('snapshots', snapshotSchema);
export default Snapshot;
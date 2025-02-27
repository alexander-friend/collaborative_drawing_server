import { DefaultEventsMap, Server, Socket } from 'socket.io';
import http from 'http';
import admin from 'firebase-admin';
import { createRoomError, genericError, joinRoomError, leaveRoomNotInRoomError } from '../errors/error-codes';

interface CustomSocket extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
    user?: admin.auth.DecodedIdToken;
}

const canvasVersions: { [room: string]: number } = {};
const canvasLastLineId: { [room: string]: string } = {};

class SocketService {
    private io!: Server;

    public init(server: http.Server): void {
        this.io = new Server(server, {
            cors: {
                origin: '*',
                methods: ["GET", "POST"]
            },
        });

        this.io.use(async (socket: CustomSocket, next) => {
            console.log('Authenticating socket connection');
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }
            try {
                console.log('Verifying token');
                const decodedToken = await admin.auth().verifyIdToken(token);
                socket.user = decodedToken;
                next();
            } catch (e) {
                console.error("Token verification failed:", e);
                next(new Error('Authentication error: Invalid token'));
            }
        });

        this.io.on("connection", (socket: CustomSocket) => {
            console.log('New WebSocket connection established', socket.id, 'by User: ', socket.user?.uid);

            /**
             * Broadcasts the message to all clients in the room.
             * @param message The message to broadcast.
             * @param room The room to broadcast the message to.
             */
            socket.on('message', (message) => {
                let jsonMessage;
                // Parse the message if it is a string or a buffer into JSON.
                if (typeof message === 'string') {
                    jsonMessage = JSON.parse(message);
                } else if (message instanceof Buffer) {
                    jsonMessage = JSON.parse(message.toString());
                } else {
                    console.error('Unsupported message type:', typeof message);
                    return;
                }
                console.log('Received message from client');

                socket.rooms.forEach(room => {
                    if (room === socket.id) return;
                    if (canvasVersions[room] === undefined) {
                        canvasVersions[room] = 0;
                    }
                    // Check if the message is a canvas update message.
                    if (jsonMessage.a === 'cu') {
                        try {
                            const dataObj = JSON.parse(jsonMessage.data);
                            const newLineId = dataObj.id;
                            // Increment the version number if the line ID is different.
                            if (!canvasLastLineId[room] || canvasLastLineId[room] !== newLineId) {
                                canvasVersions[room]++;
                                canvasLastLineId[room] = newLineId;
                                console.log(`Room ${room}: Incremented version to ${canvasVersions[room]} for new line ID ${newLineId}`);
                            }
                            // Add the version number to the message.
                            jsonMessage.v = canvasVersions[room];
                        } catch (e) {
                            console.error('Error parsing JSON:', e);
                        }
                    }
                    const jsonStringMessage = JSON.stringify(jsonMessage)
                    socket.to(room).emit('message', jsonStringMessage);
                });
            });

            /**
             * Creates a new room and joins the socket to the room.
             * @param room The room to create.
             * @param callback The callback function to acknowledge the success or failure to client.
             */
            socket.on('create_room', (room, callback) => {
                console.log('Room Name', room);
                const existingRoom = this.io.sockets.adapter.rooms.get(room);
                if (existingRoom) {
                    return callback({ error: createRoomError });
                }
                socket.join(room);
                console.log('Created room:', room);
                callback({ success: true, message: `Created room ${room}` });
            });

            /**
             * Joins the socket to the room.
             * @param room The room to join.
             * @param callback The callback function to acknowledge the success or failure to client.
             */
            socket.on('join_room', (room, callback) => {
                const existingRoom = this.io.sockets.adapter.rooms.get(room);
                if (!existingRoom) {
                    return callback({ error: joinRoomError });
                }
                socket.join(room);
                console.log('Joined room:', room);
                callback({ success: true, message: `Joined room ${room}` });
            });

            /**
             * Disconnects the socket from the room.
             * @param room The room to leave.
             * @param callback The callback function to acknowledge the request back to the client.
             */
            socket.on('leave_room', (room, callback) => {
                // Check if the room exists
                const existingRoom = this.io.sockets.adapter.rooms.get(room);
                if (!existingRoom) {
                    return callback({ error: genericError(`Room ${room} does not exist`) });
                }

                // Check if the socket is in the room
                if (!socket.rooms.has(room)) {
                    return callback({ error: leaveRoomNotInRoomError });
                }

                socket.leave(room);
                console.log('Left room:', room);
                this.cleanupRoom(room);
                callback({ success: true, message: `Left room ${room}` });
            });

            socket.on('disconnect', () => {
                const rooms = Array.from(socket.rooms).filter(
                    (room) => room !== socket.id
                );
                // Schedule cleanup after disconnection.
                setTimeout(() => {
                    rooms.forEach((room) => {
                        this.cleanupRoom(room);
                    });
                }, 0);
                console.log('User disconnected:', socket.user?.uid);
            });
        });
    }

    /**
 * Cleans up the room if there are no more clients in the room.
 * @param room The room to clean up.
 */
    cleanupRoom(room: string) {
        // Get the room set from the adapter.
        const roomSockets = this.io.sockets.adapter.rooms.get(room);
        if (!roomSockets || roomSockets.size === 0) {
            delete canvasVersions[room];
            delete canvasLastLineId[room];
            console.log(`Cleaned up room: ${room}`);
        }
    }

}

export default SocketService;
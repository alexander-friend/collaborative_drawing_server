export enum SocketErrorCodes {
    ROOM_ALREADY_EXISTS = 'ROOM_ALREADY_EXISTS',
    ROOM_DOES_NOT_EXIST = 'ROOM_DOES_NOT_EXIST',
    NOT_IN_ROOM = 'NOT_IN_ROOM',
    AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
    GENERIC_ERROR = 'GENERIC_ERROR'
}

export interface SocketError {
    code: SocketErrorCodes;
    message: string;
}

export const createRoomError: SocketError = {
    code: SocketErrorCodes.ROOM_ALREADY_EXISTS,
    message: 'Room already exists.'
};

export const joinRoomError: SocketError = {
    code: SocketErrorCodes.ROOM_DOES_NOT_EXIST,
    message: 'Room does not exist.'
};

export const leaveRoomNotInRoomError: SocketError = {
    code: SocketErrorCodes.NOT_IN_ROOM,
    message: 'You are not in this room.'
};

export const authenticationError: SocketError = {
    code: SocketErrorCodes.AUTHENTICATION_ERROR,
    message: 'Authentication failed or token is invalid.'
};

export const genericError = (msg: string): SocketError => ({
    code: SocketErrorCodes.GENERIC_ERROR,
    message: msg,
});
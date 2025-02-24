# Collaborative Drawing Server

This project is a collaborative drawing server that uses an Express backend with Socket.IO for real-time communication and Firebase Admin for user authentication. The server listens on port 8080 and serves static files while providing WebSocket-based canvas updates.

## Features

- **Real-Time Drawing Updates:** Clients can send canvas updates and receive versioned messages for synchronization.
- **Room-Based Collaboration:** Supports creating, joining, and leaving rooms for isolated drawing sessions.
- **Firebase Authentication:** Uses [Firebase Admin SDK](https://firebase.google.com/docs/admin) for verifying client tokens.
- **Docker Support:** Includes both development and production Docker configurations.

## Getting Started

### Prerequisites
- [Node.js 20](https://nodejs.org/) (Alpine version used in Docker)
- [Firebase Service Account Key](https://firebase.google.com/docs/admin/setup)

### Installation

1. Clone the repository:

```
   git clone https://github.com/alexander-friend/collaborative_drawing_server.git
   cd collaborative_drawing_server
```

2. Install dependencies:

```
   npm install
```

3. Set the environment variable for Firebase Service Account:

```
   export FIREBASE_SERVICE_ACCOUNT=<base64-encoded-json>
```

### Running the Server

#### Development Mode

Start the server in development mode with hot-reloading:

```
   npm run start:dev
```

#### Production Mode

1. Build the project:

```
   npm run build
```

2. Run the production server:

```
   npm run serve
```

### Docker

#### Production Docker Build & Run

Build the production Docker image and run it:

```
   npm run docker-build
   npm run docker-run
```

#### Development Docker Build & Run

Build the development Docker image and run it:

```
   npm run docker-build:dev
   npm run docker-run:dev
```

### Deployment

A GitHub Actions workflow is set up under [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) to build and push the Docker image to Docker Hub when merging into the main branch.

## Project Structure

- **src/app.ts:** Main server code that sets up Express, Socket.IO, and Firebase authentication.
- **Dockerfile & Dockerfile.dev:** Docker configurations for production and development.
- **package.json:** Contains scripts for development, building, running, and Docker operations.
- **tsconfig.json:** TypeScript configuration.

## See Also

This is the backend proejct for the Collaborative Drawing Platform project. The front-end client project can be found [here](https://github.com/alexander-friend/collaborative_drawing_platform/)
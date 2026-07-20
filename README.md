# Merged Frontend

This is the frontend application for **Merged**, a real-time chat and networking platform. It's built with modern web technologies including **Vue 3**, **Vite**, **TailwindCSS v4**, **Pinia**, and **Socket.io**.

## Features

- **User Authentication**: Secure login and registration.
- **Real-Time Chat**: Live messaging powered by Socket.io and real-time backend updates.
- **Profile Management**: View and edit user profiles.
- **Dynamic Routing**: Client-side routing managed by Vue Router.
- **Responsive UI**: Modern, clean interface styled with TailwindCSS v4.

## Tech Stack

- **Framework:** Vue 3 (Composition API)
- **Bundler:** Vite
- **Styling:** TailwindCSS v4
- **State Management:** Pinia
- **Routing:** Vue Router
- **WebSockets:** socket.io-client

## Project Structure

- `src/components/`: Vue components including Chat, Sidebar, Navbar, and Home.
- `src/auth/`: Authentication utilities and state.
- `src/router/`: Vue Router configurations.
- `src/websockets/`: Socket.io client setup and configuration.
- `src/assets/`: Global CSS and static assets.

## Environment Variables

To run the application properly, you will need a `.env` file in the root directory.

```env
VITE_BACKEND_API=
```

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Prerequisites

Ensure you have the following installed on your local machine before setting up the project:
- **Node.js**: `v22.18.0` or `>= v24.12.0` (as specified in package.json)
- **npm** (comes with Node.js) or **yarn** / **pnpm**

## Getting Started

Follow these steps to set up the project locally.

### 1. Cloning Project

```sh
git clone https://github.com/gmhazza/Megred-front.git
cd Megred-front
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Start Development Server

```sh
npm run dev
```
The application should now be running locally, typically on `http://localhost:5173`.


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


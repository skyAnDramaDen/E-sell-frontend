# E-Sell Frontend (Mobile/Web)

The client-side application for the E-Sell marketplace, built with Expo and React Native. This app features a robust real-time communication system for buyers and sellers.

## 🚀 Key Features
- **Real-time Chat:** Integrated with Socket.io for instant messaging between users.
- **Marketplace Logic:** Browse listings, manage profiles, and upload images.
- **Cross-Platform:** Developed using Expo for seamless performance on iOS, Android, and Web.
- **Type Safety:** Built with TypeScript to ensure reliable data handling from the API.

## 🛠 Tech Stack
- **Framework:** Expo (React Native)
- **State & Logic:** React Hooks, Context API
- **Real-time:** Socket.io-client
- **Navigation:** Expo Router (File-based)
- **Styling:** NativeWind / Tailwind CSS

## 📡 Real-time Implementation
The app utilizes a Socket.io-client to establish a persistent connection with the Express server.
- Handles `join_room` and `send_message` events.
- Optimistic UI updates for a lag-free user experience.

## ⚙️ Setup
1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
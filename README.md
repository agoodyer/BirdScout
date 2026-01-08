# 🐦 BirdScout

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

**BirdScout** is an AI-powered mobile companion designed for birdwatchers of all skill levels. By combining computer vision with a seamless cloud-native experience, BirdScout allows users to identify, log, and discover avian species in real-time.

Built as part of the **SFWRENG 3AA4 (Software Design II)** course at McMaster University.

---

## ✨ Key Features

* 📸 **AI Species Identification**: Snap a photo and leverage LLM-integrated vision models for high-accuracy bird classification.
* 📓 **Digital Field Journal**: Keep a permanent, searchable history of your sightings with timestamps and location data.
* ☁️ **Cloud Synchronization**: Real-time data persistence across devices powered by Supabase.
* ⚡ **Edge Intelligence**: High-performance image ingestion and classification via serverless Edge Functions.
* 🧭 **Community Discoveries**: Explore a global feed of bird sightings from other "Scouts" (In-Development).

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [Expo](https://expo.dev/) & [React Native](https://reactnative.dev/)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (Type-safe, file-based routing)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: NativeWind / Flexbox for responsive mobile layouts

### Backend & Infrastructure
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Storage**: Supabase Storage for high-resolution bird photography
- **Auth**: Supabase Auth (Email/Password & OAuth)
- **Functions**: Supabase Edge Functions for handling AI logic and metadata processing

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS)
- [Expo Go](https://expo.dev/go) app on your mobile device (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/agoodyer/BirdScout.git
   cd BirdScout
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Start the App**
   ```bash
   npx expo start
   ```

---

## 📂 Project Structure

```text
├── api/             # Supabase client and Edge Function calls
├── app/             # Main application screens (Expo Router logic)
├── assets/          # Static assets (logos, bird icons)
├── components/      # Reusable UI components (Modals, Buttons, Cards)
├── constants/       # Theme configuration and API constants
├── hooks/           # Custom React hooks (Auth, Sighting Logic)
├── store/           # Global state management
└── supabase/        # Database schemas and migration files
```
---

## 👥 Contributors

This project was developed by a team of software engineering students at **McMaster University**:

- **Aidan Goodyer** - [agoodyer](https://github.com/agoodyer)
- **Hamza Abou Jaib** - [HamzaAbouJaib](https://github.com/HamzaAbouJaib)
- **May Yan** - [mayyan531](https://github.com/mayyan531)
- **Muhammad Zaka** - [zakamm](https://github.com/zakamm)
- **Nawaal Fatima** - [NawaalFatima](https://github.com/NawaalFatima)
- **Aravin Shankar** - [aravin04](https://github.com/aravin04)
---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<p align="center">
  Made with ❤️ by the BirdScout Team
</p>

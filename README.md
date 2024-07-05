# PWA Burton

PWA Burton is a Progressive Web Application developed for the Pakistan Welfare Association in Burton Upon Trent. It aims to improve community engagement by providing a unified platform where users can access information on the association's activities, services, and membership guidelines. Built with Next.js for server-side rendering, Firebase for authentication and data persistence, and styled using Tailwind CSS, this application promises a seamless, app-like experience across different devices, with a special emphasis on performance and SEO.

## Overview

The architecture of PWA Burton is designed to harness the benefits of the Next.js framework, enhancing SEO and performance through server-side rendering, while Firebase Auth and Firestore support authentication and data management, respectively. The application is bifurcated into a client-side responsible for UI interactions and a server-side managed by Next.js that takes care of rendering, routing, and server-side logic. Styling is maintained with Tailwind CSS, ensuring responsiveness and a consistent design language. The project uses Node.js and the Firebase CLI for development and deployment, leveraging modern web technologies to deliver a robust user experience.

## Features

PWA Burton includes several key features aimed at enhancing user engagement within the community:

- **User Authentication via Google**: Secure sign-in with Google accounts using Firebase Auth.
- **Community Services Display**: Information on community aid and funeral services.
- **Membership Information**: Details on joining the association, including fees and the registration process.
- **Contact Details**: Easily accessible contact information, enhancing user support.
- **Interactive Homepage**: Dynamic buttons and gradient text for a more engaging interface.
- **Responsive Design and Styling**: Consistent visual presentation across devices thanks to Tailwind CSS.
- **Offline Capabilities**: Aimed at improving accessibility and usability even without an internet connection.

## Getting started

### Requirements

To run PWA Burton on your machine, you need the following technologies installed:
- Node.js (latest version recommended)
- Firebase CLI

These setups are necessary for setting up, developing, and deploying the application.

### Quickstart

Follow these steps to get the project running on your local machine:

1. **Clone the repository**:
```
git clone https://example.com/pwa-burton.git
cd pwa-burton
```

2. **Install dependencies**:
```
npm install
```

3. **Set up Firebase**:
- Ensure the Firebase CLI is installed globally.
- Log in to Firebase using `firebase login`.
- Update the `.env.local` file with your Firebase project credentials.

4. **Run the application**:
```
npm run dev
```
This command starts the Next.js development server, making the app accessible at `http://localhost:3000`.

### License

Copyright (c) 2024.

All rights reserved. This application and its source code are proprietary, owned by the Pakistan Welfare Association, Burton Upon Trent. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.
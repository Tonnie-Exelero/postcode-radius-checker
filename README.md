# 🎓 Radius Eligibility Checker

![Radius Eligibility Checker](/screenshot.png)

A React TypeScript application that determines whether students from specific Australian postcodes are eligible to take courses based on their distance from a Radius-based location.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [License](#license)

## 🔍 Overview

The Radius Eligibility Checker helps educational institutions determine if students from specific postcodes are eligible to take courses based on their proximity to Radius-based locations. The application fetches location data for Australian postcodes, calculates the distance to the selected Radius-based, and visually represents this information on a map.

## ✨ Features

- **Postcode Validation**: Verify if an Australian postcode is within an allowable radius from a Radius-based
- **Radius-based Selection**: Choose from common Australian universities or use a custom location
- **Adjustable Radius**: Set the allowable distance radius (1-50 km)
- **Interactive Map**: Visual representation of Radius-based location, radius circle, and postcode location
- **Detailed Results**: View exact distance calculations and eligibility status
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Beautiful UI**: Modern interface built with Material UI components

## 🎬 Demo

![Application Demo](https://placeholder.svg?height=400&width=800)

## 💻 Installation

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Google Maps API key

### Steps

1. Clone the repository:

```bash
git clone https://github.com/yourusername/Radius-based-eligibility-checker.git
cd Radius-based-eligibility-checker
```

2. Install dependencies:

```bash
pnpm install
# or
yarn install
# or
npm install
```

3. Create a `.env.local` file in the root directory and add your Google Maps API key:

```plaintext
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

4. Start the development server:

```bash
pnpm run dev
# or
yarn dev
# or
npm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Dependencies

- **Next.js**: React framework for server-rendered applications
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed superset of JavaScript
- **Material UI**: React component library implementing Google's Material Design
- **Axios**: Promise-based HTTP client for making API requests
- **@googlemaps/react-wrapper**: React wrapper for Google Maps JavaScript API

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

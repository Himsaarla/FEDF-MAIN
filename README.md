
Readme · MD
# ✈️ RGIA Wayfinder
 
An interactive airport navigation web app built for **Rajiv Gandhi International Airport (RGIA), Hyderabad**. Helps passengers locate gates, lounges, restaurants, parking, and other facilities through a visual, interactive map.
 
> **Project Review — Subject Expo**
> Team 1 · Himesh (2520030317) · Chegireddy Thanvi (2520030214)
> Under the guidance of **Dr. Nirmala Jyothi**, Associate Professor, CSE
> Koneru Lakshmaiah Education Foundation (KLH), Hyderabad
 
---
 
## 🗺️ About the Project
 
Large airports are notoriously difficult to navigate, especially for first-time travelers. RGIA Wayfinder provides a digital wayfinding solution that:
 
- Renders an interactive, multi-floor airport map
- Lets users search for Points of Interest (gates, lounges, restaurants, parking)
- Highlights the shortest route from current location to destination
- Simulates live queue times and QR-based navigation
- Includes an accessibility mode (high-contrast, larger text)
- Allows saving favorite locations
---
 
## 🧩 Modules
 
| Module | Description |
|---|---|
| **Map Renderer** | Displays the airport floor layout |
| **Search POI** | Search for gates, lounges, restaurants, etc. |
| **Route Highlight** | Computes and displays the shortest path |
| **Floor Selector** | Switch between airport floors |
| **Gate Info** | Shows gate details and status |
| **Live Queue Mock** | Simulates real-time waiting times |
| **Favorites** | Save frequently visited locations |
| **QR Scan Mock** | Simulates QR-code-based navigation |
| **Accessibility Toggle** | High-contrast mode and larger text |
| **Admin Update** | Update map data and location info |
 
---
 
## 🛠️ Tech Stack
 
- **Frontend:** React 18, Tailwind CSS, Vite
- **HTTP Client:** Axios
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3 with PostCSS & Autoprefixer
---
 
## 🚀 Getting Started
 
### Prerequisites
 
- Node.js ≥ 18
- npm ≥ 9
### Installation
 
```bash
# Clone the repository
git clone <repo-url>
cd rgia-wayfinder-frontend
 
# Install dependencies
npm install
```
 
### Running the Dev Server
 
```bash
npm run dev
```
 
The app runs at **http://localhost:3000** by default.
 
### Building for Production
 
```bash
npm run build
```
 
Output is placed in the `dist/` folder.
 
### Preview Production Build
 
```bash
npm run preview
```
 
---
 
## 📁 Project Structure
 
```
rgia-wayfinder-frontend/
├── index.html          # App entry point
├── src/
│   ├── main.jsx        # React root
│   └── ...             # Components, pages, assets
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```
 
---
 
## 📄 License
 
Academic project — KLH, FED Department, 2025–26.

# 🐍 GitSnake

A modern, responsive implementation of the classic Snake game built with vanilla JavaScript, HTML5 Canvas, and CSS3.

![GitSnake Preview](https://img.shields.io/badge/Game-Snake-green?style=for-the-badge&logo=javascript)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-blue?style=for-the-badge&logo=github)
![Mobile Friendly](https://img.shields.io/badge/Mobile-Friendly-orange?style=for-the-badge&logo=mobile)

## 🎮 Play Now

**[🚀 Play GitSnake Live](https://geekneuron.github.io/GitSnake)**

## ✨ Features

- **Classic Gameplay** - The timeless Snake game experience
- **Mobile Responsive** - Touch controls for mobile devices
- **Score System** - Track your current and best scores
- **Progressive Speed** - Game gets faster as you grow
- **Modern Design** - Beautiful glassmorphism UI with animations
- **Visual Effects** - Smooth animations and visual feedback
- **Local Storage** - Best score persistence
- **Multiple Controls** - Arrow keys, WASD, and touch support
- **Performance Optimized** - Smooth 60fps gameplay
- Keyboard (WASD / Arrow keys) and touch controls
- Ocean-dark theme with grain texture and glassmorphism
- Endless Mode: board expands as score increases
- Power-ups: Speed Boost (yellow) and Score Bonus (green)
- Eat-effect particles (visual burst)
- Eat / Game Over sound effects
- Best score saved in browser via `localStorage`
- Works offline (Service Worker)
- Installable on desktop/mobile (PWA)

## 🎯 How to Play

1. **Start**: Press `SPACE` to begin
2. **Move**: Use arrow keys or `WASD` to control the snake
3. **Mobile**: Swipe in the direction you want to move
4. **Goal**: Eat the red food to grow and increase your score
5. **Avoid**: Don't hit the walls or your own body!

## 🚀 Quick Start

### Option 1: Play Online
Simply visit [GitSnake Live](https://geekneuron.github.io/GitSnake) and start playing!

### Option 2: Run Locally
```bash
# Clone the repository
git clone https://github.com/GeekNeuron/GitSnake.git

# Navigate to project directory
cd GitSnake

# Open index.html in your browser
# Or use a local server (recommended)
python -m http.server 8000
# Then visit http://localhost:8000
```

## 🛠️ Technologies Used

- **HTML5** - Canvas API for game rendering
- **CSS3** - Modern styling with glassmorphism effects
- **JavaScript ES6+** - Game logic and interactions
- **Local Storage API** - Score persistence
- **Touch Events API** - Mobile support

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Screenshots

### Desktop View
![Desktop Screenshot](https://none)

### Mobile View
![Mobile Screenshot](/screenshots/GitSnake.jpg)

## 🏗️ Project Structure

```
GitSnake/
├── index.html              # Main entry HTML
├── style.css               # Theme + layout styles
├── script.js               # Main logic, imports all modules
├── manifest.json           # PWA config
├── sw.js                   # Service worker for offline
├── favicon.ico             # Icon
├── README.md               # Project documentation
├── LICENSE                 # MIT License
└── js/
     ├── engine.js           # Snake movement, food generation
     ├── controls.js         # Keyboard and touch input
     ├── ui.js               # Score, timer, sounds
     ├── powerups.js         # Power-up system
     └── particles.js        # Food particles effect
```

## 🎮 Game Controls

| Action | Desktop | Mobile |
|--------|---------|--------|
| Move Up | ↑ or W | Swipe Up |
| Move Down | ↓ or S | Swipe Down |
| Move Left | ← or A | Swipe Left |
| Move Right | → or D | Swipe Right |
| Start/Restart | Space | Tap Screen |

## 🏆 Scoring System

- **Food**: +10 points per item
- **Speed**: Increases progressively
- **Best Score**: Automatically saved locally

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Ideas for Contributions
- Sound effects
- Online leaderboard
- Themes and skins
- Power-ups
- Statistics tracking

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**GeekNeuron**
- GitHub: [@GeekNeuron](https://github.com/GeekNeuron)
- Project: [GitSnake](https://github.com/GeekNeuron/GitSnake)

## 🙏 Acknowledgments

- Inspired by the classic Nokia Snake game
- Built with modern web technologies
- Designed for both retro gaming enthusiasts and new players

## 📈 Stats

![GitHub stars](https://img.shields.io/github/stars/GeekNeuron/GitSnake?style=social)
![GitHub forks](https://img.shields.io/github/forks/GeekNeuron/GitSnake?style=social)
![GitHub issues](https://img.shields.io/github/issues/GeekNeuron/GitSnake)
![GitHub license](https://img.shields.io/github/license/GeekNeuron/GitSnake)

---

## 🎮 Controls

**Desktop:**
- Move: Arrow keys or WASD
- Pause/Resume: Spacebar
- Toggle Theme: `T`

**Mobile:**
- Swipe to move
- Tap to start or restart

---

## 📲 Offline + Installation (PWA)

GitSnake is a fully installable Progressive Web App.

- **Desktop:** Click "Install" in browser address bar
- **Mobile:** Tap "Add to Home Screen" via browser menu
- Offline mode enabled after first load

---

## 🚀 Getting Started

1. Fork or clone this repository
2. Enable GitHub Pages (source: `main`, root `/`)
3. Visit your published URL to play the game

---

## 🛠 Build (Optional)

To bundle or optimize, you can use:
- Vite
- Parcel
- ESBuild

---

⭐ **If you enjoyed GitSnake, please give it a star!** ⭐

🐍 **Happy Gaming!** 🎮

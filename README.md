# 🃏 Set! Web Game

A fully interactive, browser-based version of the classic **Set!** card game built with **JavaScript**, **HTML**, and **CSS**.  
This project dynamically generates randomized cards, tracks sets found, manages a countdown timer, and provides instant feedback — all within a clean, responsive UI.

---

## 🎮 Gameplay Overview

In **Set!**, each card has four attributes:

| Attribute | Options |
|------------|----------|
| **Style** | solid, outline, striped |
| **Color** | red, green, purple |
| **Shape** | diamond, oval, squiggle |
| **Count** | 1, 2, 3 |

A **Set** consists of **three cards** where, for *each attribute*, the values are either **all the same** or **all different**.

### 🧩 Example
✅ These three cards form a set because:
- All have the same **count**
- Each has a different **style**, **color**, and **shape**

❌ The following three cards are *not* a set because two share the same color and one doesn’t.

---

## ⚙️ Features

- 🧠 **Dynamic board generation** for Easy (9 cards) and Standard (12 cards) modes  
- ⏱️ **Timer system** with selectable countdown durations  
- 💡 **Interactive gameplay** — select, deselect, and validate card sets in real time  
- 🖼️ **Smooth UI updates** using DOM manipulation and event listeners  
- 🔄 **Refresh board** button to start fresh anytime  
- ✅ **CSE 154 code quality compliant** — modular JS, ESLint, and strict mode

---

## 🏗️ Technologies Used

- **HTML5** — page structure and views  
- **CSS3** — layout and styling (provided by the course)  
- **JavaScript (ES6)** — core logic, interactivity, and timer control  
- **GitLab / GitHub** — version control and CI/CD testing  
- **ESLint** — static analysis for clean, consistent code  

---

## 🚀 Getting Started

### Clone the Repository!
```bash
git clone https://github.com/ntran685/set-web-game.git
cd set-web-game

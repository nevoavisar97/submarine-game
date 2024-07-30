
# Submarine Strategy Game

## Overview

The Submarine Strategy Game is a strategic turn-based game where two players compete by moving submarines on a game board. Each player aims to reach their target destination while avoiding obstacles and the opponent's submarines. The game features both human and computer players and employs advanced pathfinding algorithms to enhance gameplay.

## Project Structure

- `index.html`: Main HTML file that sets up the game board and includes necessary scripts and styles.
- `styleSheet.css`: CSS file that defines the styles for the game board and its elements.
- `script.js`: Main JavaScript file that initializes the game and handles user interactions.
- `game.js`: Contains the game logic, including player moves, submarine placement, and pathfinding.
- `player.js`: Defines the Player class with attributes and methods related to player actions.
- `submarine.js`: Defines the Submarine class with attributes and methods related to submarine actions.
- `utils.js`: Utility functions including the A* algorithm for pathfinding.

## How to Play

1. **Setup**: Open `index.html` in a web browser to start the game.
2. **Game Modes**:
   - **Computer vs Computer**: Click the "Computer vs Computer" button to watch two computer players compete.
   - **Human vs Computer**: Click the "Human vs Computer" button to play against the computer.
3. **Controls**:
   - **Select Submarine**: Click on a submarine to select it.
   - **Move Submarine**: Use the arrow keys (Up, Down, Left, Right) to move the selected submarine.
   - **Objective**: Reach your target destination before your opponent.

## Features

- **Dynamic Game Board**: A responsive and interactive 10x10 grid where submarines and players are displayed.
- **Player Movement**: Players can move their submarines in four directions (up, down, left, right) during their turn.
- **Pathfinding**: Utilizes the A* algorithm to calculate the shortest path for each player to their target.
- **Turn Management**: Manages turns between players, including computer-controlled moves.
- **Victory Conditions**: The first player to reach their target wins the game.

## Algorithms

### A* Algorithm
- **Description**: An algorithm for finding the shortest path between two points on a grid. It uses a heuristic function to estimate the distance from the current point to the target.
- **Usage**: Used to determine the shortest path for each player from their starting position to their target, considering the positions of submarines on the board.

### Move Optimization
- **Description**: An algorithm to calculate the optimal move for a submarine based on the shortest path and possible moves.
- **Usage**: Evaluates all possible moves for a submarine and selects the one that provides the greatest advantage to the current player.

## Project Requirements

- **Dynamic Game Board**: A 10x10 grid that displays submarines, players, and targets.
- **Player Movement**: Players can move their submarines in all four directions.
- **Victory Condition**: The game ends when a player reaches their target destination first.
- **User Interface**: Displays progress messages, victory, or defeat notifications.

## Additional Libraries

- **SweetAlert**: Used for displaying attractive notifications and alerts, enhancing the user experience.

## Contributors

- Shay Eini
- Kfir Koren
- Daniel Azulay
- Nevo Avishar

## Links

- [Presentation Video](https://youtu.be/UTL9gkRGjnE?si=1NNCLVZjzRKNShEL)
- [Gameplay Video](https://youtu.be/PNBPIbppokE?si=6Z77txcK5uxDvI08)

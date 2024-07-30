import { Player } from './player.js';
import { aStar } from './utils.js';
import { Submarine } from './submarine.js';

//מחלקת משחק
export class Game {
    constructor(boardElement) {
        this.boardElement = boardElement;
        this.cells = [];
        this.players = [];
        this.grid = Array(10).fill().map(() => Array(10).fill(false));
        this.submarines = [];
        this.currentPlayerIndex = 0; // תור השחקן הנוכחי
        this.counterSwitches=0; 
    }

    //בניית לוח המשחק
    buildBoard() {
        const board = document.getElementById('gameBoard');
        board.innerHTML = "";
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.id = `${x},${y}`;
                // cell.textContent= cell.id;
                this.boardElement.appendChild(cell);
                this.cells.push(cell);
            }
        }
    }
    
    //מיקומי השחקנים והיעדים שלהם
    setPositions(isComputer) {
        this.cells.forEach(cell => cell.classList.remove('player', 'target', 'submarine'));

        let player1 = new Player('Player 1', { x: 1, y: 1 }, { x: 8, y: 8 },true);
        let player2 = new Player(isComputer ?'Player 2':'בן אדם', { x: 1, y: 8 }, { x: 8, y: 1 },isComputer);

        this.players = [player1, player2];

        document.getElementById(`${player1.getPosition().x},${player1.getPosition().y}`).classList.add('player');
        document.getElementById(`${player1.getPosition().x},${player1.getPosition().y}`).textContent="P1";
        document.getElementById(`${player2.getPosition().x},${player2.getPosition().y}`).classList.add('player');
        player2.getIsComputer() ? document.getElementById(`${player2.getPosition().x},${player2.getPosition().y}`).textContent="P2": document.getElementById(`${player2.getPosition().x},${player2.getPosition().y}`).textContent="P2 Human" ;
        document.getElementById(`${player1.getTarget().x},${player1.getTarget().y}`).classList.add('target');
        document.getElementById(`${player1.getTarget().x},${player1.getTarget().y}`).textContent="P1 Target";
        document.getElementById(`${player2.getTarget().x},${player2.getTarget().y}`).classList.add('target');
        document.getElementById(`${player2.getTarget().x},${player2.getTarget().y}`).textContent="P2 Target";
    }
    
    //מיקום הצוללות על הלוח
    placeSubmarinesRandomly() {
        let isValid = false;
    
        while (!isValid) {
            this.cells.forEach(cell => cell.classList.remove('submarine'));
            this.grid = Array(10).fill().map(() => Array(10).fill(false));
            this.submarines = this.getRandomSubmarines();
    
            if (this.isValidPlacement(this.submarines)) {
                this.submarines.forEach(submarine => {
                    submarine.getPosition().forEach(pos => {
                        document.getElementById(`${pos.x},${pos.y}`).classList.add('submarine');
                        this.grid[pos.x][pos.y] = true;
                    });
                });
                isValid = true;
            }
        }
    }

    //פונקצית עזר למיקום הצוללות
    getRandomSubmarines() {
        const submarines = [ ];
        const occupiedPositions = new Set();

        while (submarines.length < 4) {
            const x = Math.floor(Math.random() * 4) + 3; // בטורים 3-6
            const y = Math.floor(Math.random() * 9);

            const pos1 = `${x},${y}`;
            const pos2 = `${x},${y + 1}`;

            if (!occupiedPositions.has(pos1) && !occupiedPositions.has(pos2) && y + 1 < 10) {
                submarines.push(new Submarine([{ x, y }, { x, y: y + 1 }], 2));
                occupiedPositions.add(pos1);
                occupiedPositions.add(pos2);
            }
        }

        return submarines;
    }

    //ולידציה להנחת הצוללות
    isValidPlacement(submarines) {
        this.grid = Array(10).fill().map(() => Array(10).fill(false));
        const occupiedPositions = new Set();
    
        for (let submarine of submarines) {
            for (let pos of submarine.getPosition()) {
                if (occupiedPositions.has(`${pos.x},${pos.y}`)) {
                    return false;
                }
                this.grid[pos.x][pos.y] = true;
                occupiedPositions.add(`${pos.x},${pos.y}`);
            }
        }
    
        const player1Path = aStar(this.players[0].getPosition(), this.players[0].getTarget(), this.grid);
        const player2Path = aStar(this.players[1].getPosition(), this.players[1].getTarget(), this.grid);
    
        if (!player1Path || !player2Path) {
            return false;
        }
        if (player1Path.length === player2Path.length) {

            player1Path.forEach(node => {
                document.getElementById(`${node.x},${node.y}`).classList.add('player1-path');
            });
            player2Path.forEach(node => {
                document.getElementById(`${node.x},${node.y}`).classList.add('player2-path');
            });
        }

    
        return player1Path.length === player2Path.length;
    }


    //מהלך תור משחק בין 2 שחקני מחשב
    switchTurnComputerVSComputer(){
        if(this.counterSwitches==2){
            this.winGame();
            document.getElementById('startButtonComputerVsComputer').disabled = false;
            document.getElementById('startButtonHumanVsComputer').disabled = false;
            return;
        }
        this.counterSwitches++;
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 2; // מעבר לשחקן הבא
        alert(`תור השחקן: ${this.getCurrentPlayer().name}`);
        setTimeout(() => {
            this.moveBestSubmarine();
            
        }, 1500);

        setTimeout(() => {
            this.switchTurnComputerVSComputer();            
        }, 3000);
        

    }


    //מהלך תור משחק בין מחשב לבין בנאדם 
    switchTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 2; // מעבר לשחקן הבא
        alert(`תור השחקן: ${this.getCurrentPlayer().name}`);
        console.log(this.getCurrentPlayer())
        if(this.getCurrentPlayer().isComputer){
            setTimeout(() => {
            this.moveBestSubmarine();
            // this.switchTurn(); 
            
        }, 1500);

        setTimeout(() => {
            this.winGame();
            document.getElementById('startButtonComputerVsComputer').disabled = false;
            document.getElementById('startButtonHumanVsComputer').disabled = false;           
             // this.switchTurn(); 
        }, 1500);

        }  
        else{
                ////ממתינים לשחקן
             let p=document.getElementById('in');
             p.textContent="בחר צוללת והזז באמצעות מקשי החצים"   
        }
    }
   

    //פונקצית תחילת משחק
    startGame(isComputer) {
        let p=document.getElementById('in');
        p.textContent="" ;
        this.counterSwitches=0;
        this.buildBoard();
        this.setPositions(isComputer);
        this.placeSubmarinesRandomly();
        this.boardElement.focus();
    }


    //החזרת השחקן שתורו
    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }


    //הזזת הצוללת למיקום האופטימלי
    moveBestSubmarine() {
        // שלב 1: קביעת השחקן הנוכחי
        const currentPlayer = this.getCurrentPlayer();

        // שלב 2: מציאת המהלך האופטימלי להזזת הצוללת בעזרת Alpha-beta pruning
        const bestMove = this.findBestMove(currentPlayer);
    
        if (bestMove) {
            // שלב 3: ביצוע המהלך
            const { submarine, newPosition } = bestMove;
            // console.log(bestMove)
            const oldPositions = submarine.getPosition();
    
            // עדכון מיקום הצוללת
            submarine.setPosition(newPosition);
            
            // שלב 4: עדכון לוח המשחק
            this.updateBoard(oldPositions, newPosition);
            this.updatePaths();

            // סימון שהצוללת הוזזה
            submarine.hasMoved = true;
        }
    }

    //פונקצית עזר למציאת התזוזה האופטימלית
    findBestMove(player) {
        let bestMove = null;
        let bestScore = -Infinity;
    
        for (let submarine of this.submarines) {
            if (!submarine.hasMoved) {
                 console.log("old")
                 console.log(submarine.getPosition())
                const possibleMoves = this.getPossibleMoves(submarine);
    
                for (let move of possibleMoves) {
                    // חישוב ציון למהלך הנוכחי
                    // console.log("Move")
                    // console.log(move)
                    const score = this.evaluateMove(player, submarine, move,submarine.getPosition());
                    console.log(`Submarine ID: ${submarine.id}, Move: ${JSON.stringify(move)}, Score: ${score}`);
    
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = { submarine, newPosition: move };
                    }
                }
            }
        }
    
        return bestMove;
    }

    // פונקציה עזר להחזרת מהלכים אפשריים לצוללת
    getPossibleMoves(submarine) {
    const possibleMoves = [];
    const directions = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
    ];

    for (let dir of directions) {
        const newPositions = submarine.getPosition().map(pos => ({
            x: pos.x + dir.x,
            y: pos.y + dir.y
        }));
        if (this.isValidMove(newPositions, submarine.getPosition())) {
            possibleMoves.push(newPositions);
        }
    }

    return possibleMoves;
}

    //בדיקת ולידציה להזזת הצוללות
isValidMove(newPositions, currentPositions) {
    return newPositions.every(pos => 
        pos.x >= 0 && pos.x < 10 && pos.y >= 0 && pos.y < 10 && (!this.grid[pos.x][pos.y] || currentPositions.some(currPos => currPos.x === pos.x && currPos.y === pos.y))
    );
}

    //מתן ניקוד לתזוזת צוללת
evaluateMove(player, submarine, newPosition,old) {

    const opponent = this.players[(this.currentPlayerIndex + 1) % 2];

    // שמירה של המיקום הנוכחי של הצוללת לשחזור מאוחר יותר
    const originalPosition = old;

    old.forEach(pos => {
        this.grid[pos.x][pos.y] = false;
    });
    newPosition.forEach(pos => {
        this.grid[pos.x][pos.y] = true;
    });

    // עדכון מיקום הצוללת למיקום החדש
    submarine.setPosition(newPosition);

    // חישוב מסלול חדש לשחקן הנוכחי וליריב בעזרת A*
    const playerPath = aStar(player.getPosition(), player.getTarget(), this.grid);
    const opponentPath = aStar(opponent.getPosition(), opponent.getTarget(), this.grid);

      newPosition.forEach(pos => {
        this.grid[pos.x][pos.y] = false;
    });
    originalPosition.forEach(pos => {
        this.grid[pos.x][pos.y] = true;
    });

    // שחזור מיקום הצוללת למיקום המקורי
    submarine.setPosition(originalPosition);

    // אם לא נמצא מסלול לשחקן הנוכחי או ליריב, ציון נמוך מאוד
    if (!playerPath || !opponentPath) {
        return -Infinity;
    }

    // חישוב הציון: הפרש המסלולים
    const score = (opponentPath.length - playerPath.length);
    return score;

}

    //עדכון הלוח לאחר שינוי מיקומי הצוללות
updateBoard(oldPositions, newPositions) {
    // הסרת הצוללת מהמיקום הישן בלוח
    oldPositions.forEach(pos => {
        this.grid[pos.x][pos.y] = false;
        document.getElementById(`${pos.x},${pos.y}`).classList.remove('submarine');
    });

    // הוספת הצוללת למיקום החדש בלוח
    newPositions.forEach(pos => {
        this.grid[pos.x][pos.y] = true;
        document.getElementById(`${pos.x},${pos.y}`).classList.add('submarine');
    });
}


    //עדכון מסלולים הקצרים לכל שחקן לאחר הזזת הצוללות 
updatePaths() {
    // ניקוי מסלולים קודמים
    this.cells.forEach(cell => {
        cell.classList.remove('player1-path');
        cell.classList.remove('player2-path');
    });

    // חישוב מסלול חדש לשחקן 1
    const player1Path = aStar(this.players[0].getPosition(), this.players[0].getTarget(), this.grid);
    if (player1Path) {
        player1Path.forEach(node => {
            document.getElementById(`${node.x},${node.y}`).classList.add('player1-path');
        });
    }

    // חישוב מסלול חדש לשחקן 2
    const player2Path = aStar(this.players[1].getPosition(), this.players[1].getTarget(), this.grid);
    if (player2Path) {
        player2Path.forEach(node => {
            document.getElementById(`${node.x},${node.y}`).classList.add('player2-path');
        });
    }
}


    //פונקציה לבדיקת מנצח המשחק
    winGame(){
        let p = document.getElementById('in');
        const player1Path = aStar(this.players[0].getPosition(), this.players[0].getTarget(), this.grid);
        const player2Path = aStar(this.players[1].getPosition(), this.players[1].getTarget(), this.grid);
        if (player1Path.length < player2Path.length) {
            player1Path.forEach(node => {
                document.getElementById(`${node.x},${node.y}`).classList.add('win');
            });
            p.innerHTML = `Player One Wins!<br>Player One Length: ${player1Path.length}<br>Player Two Length: ${player2Path.length}`;
        } else if (player1Path.length === player2Path.length) {
            p.innerHTML = "Tie";
        } else {
            player2Path.forEach(node => {
                document.getElementById(`${node.x},${node.y}`).classList.add('win');
            });
            p.innerHTML = `Player Two Wins!<br>Player Two Length: ${player2Path.length}<br>Player One Length: ${player1Path.length}`;
        }
    }
    
    



}


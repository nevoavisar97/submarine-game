import { Game } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
    // הגדרת משתנים
    let selectedSubmarine = null;
    let selectedSubmarinePositions = null;
    
    // יצירת HTML בצורה דינמית
    const body = document.body;
    const board = document.getElementById('gameBoard');
    const startButtonComputerVsComputer = document.createElement('button');
    startButtonComputerVsComputer.id = 'startButtonComputerVsComputer';
    startButtonComputerVsComputer.textContent = 'Computer vs Computer';
    const startButtonHumanVsComputer = document.createElement('button');
    startButtonHumanVsComputer.id = 'startButtonHumanVsComputer';
    startButtonHumanVsComputer.textContent = 'Human vs Computer';

    const divButtons = document.createElement('div');
    divButtons.appendChild(startButtonComputerVsComputer);
    divButtons.appendChild(startButtonHumanVsComputer);
    divButtons.id='buttonsDiv';
    
    const divInstructions = document.createElement('div');
    const p = document.createElement('p');
    p.id='in'
    divInstructions.appendChild(p);
    body.insertBefore(divButtons, board);
    body.insertBefore(divInstructions, board);

    // יצירת אובייקט המשחק
    const game = new Game(board);

    // התחלת משחק בין שני שחקני מחשב
    startButtonComputerVsComputer.addEventListener('click', () => {
        game.startGame(true);
        document.getElementById('startButtonComputerVsComputer').disabled = true;
        document.getElementById('startButtonHumanVsComputer').disabled = true;
        game.switchTurnComputerVSComputer();
    });

    // התחלת משחק בין שחקן מחשב לבין בנאדם 
    startButtonHumanVsComputer.addEventListener('click', () => {
        game.startGame(false); 
        document.getElementById('startButtonComputerVsComputer').disabled = true;
        document.getElementById('startButtonHumanVsComputer').disabled = true;
        game.switchTurn();
    });

    // בחירת צוללת באמצעות קליק בעכבר
    board.addEventListener('click', (event) => {
        const currentPlayer = game.getCurrentPlayer();

        // אם זה תור המחשב, לא עושים כלום
        if (currentPlayer.isComputer) {
            return;
        }

        const target = event.target;
        const [x, y] = target.id.split(',').map(Number);

        // אם צוללת נבחרה, לא נזיז אותה
        if (selectedSubmarine) {
            selectedSubmarinePositions.forEach(pos => {
                document.getElementById(`${pos.x},${pos.y}`).classList.remove('selected-submarine');
            });
            selectedSubmarine = null;
            selectedSubmarinePositions = null;
        }

        // נבדוק אם יש צוללת בלחיצה ונבחר אותה
        const submarine = game.submarines.find(sub => sub.getPosition().some(pos => pos.x === x && pos.y === y) && !sub.hasMoved);

        if (submarine) {
            // אם יש צוללת אחרת שנבחרה, נבטל את הבחירה בה
            if (selectedSubmarine) {
                selectedSubmarinePositions.forEach(pos => {
                    document.getElementById(`${pos.x},${pos.y}`).classList.remove('selected-submarine');
                });
            }

            // נבחר את הצוללת החדשה
            selectedSubmarine = submarine;
            selectedSubmarinePositions = submarine.getPosition();
            selectedSubmarinePositions.forEach(pos => {
                document.getElementById(`${pos.x},${pos.y}`).classList.add('selected-submarine');
            });
        }
    });

    // האזנה לאירועי מקלדת להזזת הצוללת
    document.addEventListener('keydown', (event) => {
        const currentPlayer = game.getCurrentPlayer();

        // אם זה תור המחשב, לא עושים כלום
        if (currentPlayer.isComputer || !selectedSubmarine) {
            return;
        }
        
        let direction = null;

        switch (event.key) {
            case 'ArrowUp':
                direction = { x: 0, y: -1 };
                break;
            case 'ArrowDown':
                direction = { x: 0, y: 1 };
                break;
            case 'ArrowLeft':
                direction = { x: -1, y: 0 };
                break;
            case 'ArrowRight':
                direction = { x: 1, y: 0 };
                break;
            default:
                return; // אם זה לא אחד מהחיצים, לא עושים כלום
        }

        const newPositions = selectedSubmarinePositions.map(pos => ({
            x: pos.x + direction.x,
            y: pos.y + direction.y
        }));

        if (game.isValidMove(newPositions, selectedSubmarinePositions)) {
            selectedSubmarinePositions.forEach(pos => {
                document.getElementById(`${pos.x},${pos.y}`).classList.remove('selected-submarine');
            });
            game.updateBoard(selectedSubmarinePositions, newPositions);
            selectedSubmarine.setPosition(newPositions);
            selectedSubmarine.hasMoved = true;
            selectedSubmarine = null;
            selectedSubmarinePositions = null;
            p.textContent = "";
            game.switchTurn();
        } else {
            alert("צעד לא חוקי");
        }
    });
});

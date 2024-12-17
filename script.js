// List of possible features to implement:

// Piece Move Transitions: Add smooth animations for piece movement and captures
// Undo Move: Enable the option to undo the last move
// AI Opponent: Implement an AI opponent for single-player mode
// Timer: Add a timer for each player's turn
// Scoreboard: Display the score and captured pieces
// Theme Selection: Allow players to choose different board themes
// Sound Effects: Implement sounds for moves, captures, and background music
// Replay: Allow players to replay previous games
// Custom Rules: Allow players to customize game rules
// Leaderboard: Display the top players and rankings

// Added Features:
// Highlight Moves: Highlight possible moves for selected pieces
// Board Rotation: Rotate the board after each turn
// Piece King: King a piece if it reaches the last row
// Toggle Rotation: Toggle board rotation on/off
// Piece Jump: Add logic for jumping over opponent's pieces
// Piece Capture: Capture opponent's pieces by jumping over them
// Multiple Captures: Allow multiple captures in a single turn
// Check Win: Check for a win condition after each move

// Spelregels:
// 2. Wit begint altijd.
// 3. Schijf: 1 vakje schuin vooruit.
// 4. Schijf kan vooruit en achteruit slaan.
// 5. Schijf wordt dam bij bereiken overkant, tenzij terug moet slaan.
// 6. Dam: schuift meerdere vakjes schuin, vooruit/achteruit.
// 7. Dam kan vooruit/achteruit slaan, hoeft niet direct achter geslagen schijf te staan.
// 8. Slaan is verplicht.
// 9. Meerslag (meeste stukken slaan) gaat voor.
// 10. Bij gelijk aantal slagen (dam/schijf), vrije keuze.
// 11. Geslagen stukken na slag van bord halen.
// 12. Geen zet mogelijk = verlies.
// 13. Niemand kan winnen = remise (ook met ongelijk aantal stukken).

const Board = document.getElementById('board');

function createBoard() {
    for (let i = 0; i < 100; i++) {
        const BoardSquare = document.createElement('div');
        BoardSquare.classList.add('board-square');
        Board.appendChild(BoardSquare);
        BoardSquare.id = i + 1;

        const row = Math.floor(i / 10);
        const col = i % 10;

        if ((row + col) % 2 == 0) {
            BoardSquare.style.backgroundColor = "#D8C29B"; // Light square
            BoardSquare.classList.add('lightSquare');
        } else {
            BoardSquare.style.backgroundColor = "#8E5B3D"; // Dark square
            BoardSquare.classList.add('darkSquare');

            if (row < 4) {
                const PieceBlack = document.createElement('div');
                PieceBlack.classList.add('pieceBlack');
                BoardSquare.appendChild(PieceBlack);
            } else if (row > 5) {
                const PieceWhite = document.createElement('div');
                PieceWhite.classList.add('pieceWhite');
                BoardSquare.appendChild(PieceWhite);
            }
        }
    }
}
createBoard();

let isWhiteTurn = true;
let SelectedPiece = null;
let rotation = 0;
let stopRotating = false;

// function to validate a move
function isMoveValid(fromSquare, toSquare, isWhiteTurn) {
    const diff = Math.abs(fromSquare - toSquare);
    const isForwardMove = isWhiteTurn ? fromSquare > toSquare : fromSquare < toSquare;

    // Regular move distances: 9 or 11 (one square diagonal)
    return (diff === 9 || diff === 11) && isForwardMove;
}

// Moves the piece to a valid square
function movePiece() {
    Board.addEventListener('click', (event) => {
        const square = event.target.closest('.board-square');

        // Selects the piece
        if (square && square.children.length > 0) {
            const piece = square.querySelector('.pieceWhite, .pieceBlack');
            if ((isWhiteTurn && piece.classList.contains('pieceWhite')) || 
                (!isWhiteTurn && piece.classList.contains('pieceBlack'))) {
                if (SelectedPiece) {
                    SelectedPiece.style.border = "";
                }
                SelectedPiece = square.firstChild;
                SelectedPiece.style.border = "3px solid red";
            }
        } 
        // Moves the piece to a valid square
        else if (SelectedPiece && square && square.children.length === 0 && square.classList.contains('darkSquare')) {
            const fromSquare = parseInt(SelectedPiece.parentElement.id);
            const toSquare = parseInt(square.id);

            if (isMoveValid(fromSquare, toSquare, isWhiteTurn)) {
                square.appendChild(SelectedPiece);
                kingPiece();
                checkForWin();
                
                SelectedPiece.style.border = "";
                SelectedPiece = null;
                isWhiteTurn = !isWhiteTurn;
                if (stopRotating === false) {
                    setTimeout(spinBoard, 0); // Spin the board at the very last
                }
            }
        }
    });
}
movePiece();

// Highlights movable pieces and tracks the selected piece
function showHighlights() {

}

// Jump logic placeholder
function jumpPiece() {}

// Multi-capture logic placeholder
function multipleCapture() {}

// Rotates the board for the next turn
function spinBoard() {
    rotation += 180;
    Board.style.transform = `rotate(${rotation}deg)`;
    Board.style.transition = "transform 1s ease-in-out, filter 1s ease-in-out";
    Board.style.filter = "blur(2px)";
    setTimeout(() => Board.style.filter = "none", 600);

    const kings = document.querySelectorAll('.kingWhite, .kingBlack');
    kings.forEach(king => {
        king.style.transform = `rotate(${-rotation}deg)`;
        king.style.transition = "transform 1s ease-in-out";
    });
}

function toggleBoardRotation() {
    document.getElementById('stopRotate').addEventListener('click', () => {
        stopRotating = !stopRotating;
        if (!stopRotating) {
            if ((isWhiteTurn && rotation % 360 !== 0) || (!isWhiteTurn && rotation % 360 === 0)) {
                spinBoard();
            }
        }
    });
}
toggleBoardRotation();

// Kings a piece if it reaches the last row
function kingPiece() {
    const id = SelectedPiece.parentElement.id;
    if ((isWhiteTurn && id <= 10) || (!isWhiteTurn && id >= 90)) {
        SelectedPiece.classList.add(isWhiteTurn ? 'kingWhite' : 'kingBlack');
        SelectedPiece.style.transform = `rotate(${-rotation}deg)`;
    }
}

// Checks if one player has won
function checkForWin() {
    if (document.getElementsByClassName('pieceBlack').length === 0) {
        alert("White wins!");
    } else if (document.getElementsByClassName('pieceWhite').length === 0) {
        alert("Black wins!");
    }
}
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

// Highlights movable pieces and tracks the selected piece
function showHighlights() {
    const darkSquares = document.querySelectorAll('.darkSquare');
    darkSquares.forEach(square => {
        square.addEventListener('click', () => {
            const piece = square.querySelector('.pieceWhite, .pieceBlack');
            if (piece && ((isWhiteTurn && piece.classList.contains('pieceWhite')) ||
                (!isWhiteTurn && piece.classList.contains('pieceBlack')))) {

                piece.style.border = "3px solid red";
                if (SelectedPiece) SelectedPiece.style.border = "";
                SelectedPiece = piece;
            }
        });
    });
}
showHighlights();

// Moves the piece to a valid square
function movePiece() {
    Board.addEventListener('click', (event) => {
        const square = event.target.closest('.board-square');
        if (SelectedPiece && square && square.children.length === 0 && square.classList.contains('darkSquare')) {
            const fromSquare = SelectedPiece.parentElement.id;
            const toSquare = square.id;

            if ((isWhiteTurn && (fromSquare - toSquare == 9 || fromSquare - toSquare == 11)) ||
                (!isWhiteTurn && (toSquare - fromSquare == 9 || toSquare - fromSquare == 11))) {
                square.appendChild(SelectedPiece);
                kingPiece();
                checkForWin();
                spinBoard();
                SelectedPiece.style.border = "";
                SelectedPiece = null;
                isWhiteTurn = !isWhiteTurn;
            }
        }
    });
}
movePiece();

// Jump logic placeholder
function jumpPiece() {}

// Double jump logic placeholder
function checkDoubleJump() {}

// Rotates the board for the next turn
let rotation = 0;
function spinBoard() {
    rotation += 180;
    Board.style.transform = `rotate(${rotation}deg)`;
    Board.style.transition = "transform 1s ease-in-out, filter 1s ease-in-out";
    Board.style.filter = "blur(2px)";
    setTimeout(() => Board.style.filter = "none", 600);
}

// Kings a piece if it reaches the last row
function kingPiece() {
    if (isWhiteTurn && SelectedPiece.parentElement.id <= 10) {
        SelectedPiece.classList.add('kingWhite');
    } else if (!isWhiteTurn && SelectedPiece.parentElement.id >= 90) {
        SelectedPiece.classList.add('kingBlack');
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
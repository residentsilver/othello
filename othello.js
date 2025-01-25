const board = document.getElementById('board');
const status = document.getElementById('status');

// ゲーム状態の管理
// 0: 空, 1: 黒, -1: 白
let gameState = Array(8).fill().map(() => Array(8).fill(0));
let currentPlayer = 1; // 1: 黒, -1: 白
let canPlay = true;

// 初期配置
gameState[3][3] = -1;
gameState[3][4] = 1;
gameState[4][3] = 1;
gameState[4][4] = -1;

// 方向ベクトル（8方向）
const DIRECTIONS = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
];

// 石を置けるかチェック
function isValidMove(row, col, player) {
    if (gameState[row][col] !== 0) return false;
    
    for (const [dx, dy] of DIRECTIONS) {
        let x = row + dx;
        let y = col + dy;
        let flips = [];
        
        while (x >= 0 && x < 8 && y >= 0 && y < 8 && gameState[x][y] === -player) {
            flips.push([x, y]);
            x += dx;
            y += dy;
        }
        
        if (flips.length > 0 && x >= 0 && x < 8 && y >= 0 && y < 8 && gameState[x][y] === player) {
            return true;
        }
    }
    return false;
}

// 石を裏返す
function flipStones(row, col, player) {
    gameState[row][col] = player;
    
    for (const [dx, dy] of DIRECTIONS) {
        let x = row + dx;
        let y = col + dy;
        let flips = [];
        
        while (x >= 0 && x < 8 && y >= 0 && y < 8 && gameState[x][y] === -player) {
            flips.push([x, y]);
            x += dx;
            y += dy;
        }
        
        if (flips.length > 0 && x >= 0 && x < 8 && y >= 0 && y < 8 && gameState[x][y] === player) {
            for (const [flipX, flipY] of flips) {
                gameState[flipX][flipY] = player;
                const index = flipX * 8 + flipY;
                const cell = board.children[index];
                if (player === 1) {
                    makeBlack(cell);
                } else {
                    makeWhite(cell);
                }
            }
        }
    }
}

// 有効な手があるかチェック
function hasValidMoves(player) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (isValidMove(i, j, player)) {
                return true;
            }
        }
    }
    return false;
}

// ゲーム終了判定
function checkGameEnd() {
    if (!hasValidMoves(1) && !hasValidMoves(-1)) {
        const blackCount = gameState.flat().filter(cell => cell === 1).length;
        const whiteCount = gameState.flat().filter(cell => cell === -1).length;
        let message = `ゲーム終了!\n黒: ${blackCount} 白: ${whiteCount}\n`;
        message += blackCount > whiteCount ? '黒の勝ち!' : 
                  blackCount < whiteCount ? '白の勝ち!' : '引き分け!';
        setTimeout(() => alert(message), 100);
        canPlay = false;
    }
}

// 石を作成する関数
function makeBlack(masu) {
    masu.innerHTML = '<div class="stone black"></div>';
}

function makeWhite(masu) {
    masu.innerHTML = '<div class="stone white"></div>';
}

// ボードの作成
for (let i = 0; i < 64; i++) {
    const masu = document.createElement('div');
    const row = Math.floor(i / 8);
    const col = i % 8;
    
    // 初期配置
    if ((row === 3 && col === 3) || (row === 4 && col === 4)) {
        makeWhite(masu);
    } else if ((row === 3 && col === 4) || (row === 4 && col === 3)) {
        makeBlack(masu);
    }
    
    masu.addEventListener('click', () => {
        if (!canPlay) return;
        
        if (isValidMove(row, col, currentPlayer)) {
            if (currentPlayer === 1) {
                makeBlack(masu);
            } else {
                makeWhite(masu);
            }
            
            flipStones(row, col, currentPlayer);
            currentPlayer = -currentPlayer;
            
            // 次のプレイヤーが打てる手があるかチェック
            if (!hasValidMoves(currentPlayer)) {
                currentPlayer = -currentPlayer;
                if (!hasValidMoves(currentPlayer)) {
                    checkGameEnd();
                } else {
                    alert('パスします');
                }
            }
            
            status.textContent = `${currentPlayer === 1 ? '黒' : '白'}の番です`;
        }
    });

    board.append(masu);
}
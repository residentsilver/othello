const board = document.getElementById('board')

let count = 0

const game = []

// よく使いそうな処理は関数にする
function makeBlack(masu) {
    masu.textContent = '●'
    masu.classList.add('black')
}

function makeWhite(masu) {
    masu.textContent = '●'
    masu.classList.add('white')
}


for (let i = 0; i < 64; i++) {
    const masu = document.createElement('div');

    if (i === 27 || i === 36) {
        makeBlack(masu)
    } else if (i === 28 || i === 35) {
        makeWhite(masu)
    } else {
        masu.addEventListener('click', () => {
            if (count % 2 === 0) {
                makeBlack(masu)
            } else {
                makeWhite(masu)
            }
            count++
        }, {
            once: true
        })
    }


    board.append(masu);
}
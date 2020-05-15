/*----- constants -----*/
const playerLookup = {
    '1': 'Player 1',
    '-1': 'Opponent',
    'null': 'transparent' 
  };
const pieces = [5, 4, 3, 3, 2];
const compPieces = [2, 3, [2 + 1], 4, 5];
const numOfRows = 9;
const xCoordinates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
const yCoordinates = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

/*----- app's state (variables) -----*/

let guessArray = [];

let player = {
    playerBoard: [],
    playerAttempts: [],
    hitFive: [],
    hitFour: [],
    hitFirstThree: [],
    hitSecondThree: [],
    hitTwo: []
};

let opponent = {
    compBoard: [],
    compAttempts: [],
    hitFive: [],
    hitFour: [],
    hitFirstThree: [],
    hitSecondThree: [],
    hitTwo: [],
    sunkShipPegs: [],
};

let turn;
let winner;

let allPiecesSet;


/*----- cached element references -----*/

let msgEl = document.getElementById('main-title');
let guessEl = document.getElementById('guess');
let playerGuessEl = document.getElementById('message');
let sunkShipsEl = document.getElementById('sunk-ships');
let opponentMessageEl = document.getElementById('opponent-important-messages');
let playerMessageEl = document.getElementById('player-important-messages');

/*----- event listeners -----*/
$('#last').click(function(evt){
    $("#shot").prop('disabled', false);
    allPiecesSet = true;
    $('#shot-input-letter').focus();
})

$('#randomize').click(function(evt){
    $("#set-board > div:not(:last)").hide();
    $("#shot").prop('disabled', false);
    allPiecesSet = true;
    autoSetBoard(player.playerBoard);
    renderPlayerBoard();
    $('#randomize').hide();
    $('#shot-input-letter').focus();
})

$('.direction').on('keyup touchend', (function(event) { 
    if (event.keyCode === 13) { 
        $(this).siblings('.setpiece').click();
     } 
})
); 

$('.setpiece').on('click', function(evt) {
    $('#randomize').hide();
    let shipPlaced = false;

    let $a = yCoordinates.indexOf($(this).closest('div').find('input[class="number"]').val());
    let $b = xCoordinates.indexOf($(this).closest('div').find('input[class="letter"]').val().toUpperCase());
    let $c = parseInt($(this).closest('div').find('input[class="direction"]').val());
    
    let piece = (parseInt($(this).closest('div').attr('class')));
    
    let valid = validateInput($a, $b, $c);
    if (valid === true){
        let nums = [$a, $b, $c];
        let avail = checkSpace(player.playerBoard, piece, nums);
        
        if (avail === true) {
            setPiece(player.playerBoard, piece, nums);
            shipPlaced = true;
        } else if (avail === false) {
        $(this).closest('div').append(`<p id="warning">Hmmm... it looks like there's a ship there already!</p>`);
        $(this).closest('div').find('input').val('');
        $(this).closest('div').find('.letter').focus();
        }

        if (shipPlaced === true) {
        renderPlayerBoard();
        $(this).closest('div').hide();
        $(this).closest('div').next().show();
        $(this).closest('div').next().find('.letter').focus();
        }
    } else if (valid === false){
        $(`<p id="warning">Please submit a valid input</p>`).appendTo($(this).closest('div')).delay(2000).fadeOut();
        $(this).closest('div').find('input').val('');
        $(this).closest('div').find('.letter').focus();
    }
})

$('#shot-input-number').on('keyup touchend', (function(event) { 
    if (allPiecesSet === true) {
    if (event.keyCode === 13) { 
        $("#shot").click(); 
     } 
    }
  }) 
);

$('#shot').click(function(evt) {

    let $a = yCoordinates.indexOf($(this).closest('div').find('input[class="number"]').val());
    let $b = xCoordinates.indexOf($(this).closest('div').find('input[class="letter"]').val().toUpperCase());

    let valid = validateInput($a, $b, 1);
    if (valid === true){
        $('#warning').remove();
        $('#message').html(`<p id="message">Bombs away</p>`);
        takeShot($a, $b, player.playerAttempts, opponent.compBoard, player);
        turn *= -1;
    } else if (valid === false){
        $('#message').html(`<p style="color:red;">Please submit a valid input</p>`);
    }
    $('#shot-input-letter').val('');
    $('#shot-input-number').val('');
    $('#shot-input-letter').focus();
    render();
})

$('input').keypress(function(event){
    $(this).next('input').focus();
})


/*----- functions -----*/



function init() {
    player = {
        name: 'Player1',
        shots: 0,
        hits: 0,
        misses: 0, 
        playerBoard: [
            [null, null, null, null, null, null, null, null, null, null, null], 
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null]
        ], 
        playerAttempts: [
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null]
        ],
        hitFive: [],
        hitFour: [],
        hitFirstThree: [],
        hitSecondThree: [],
        hitTwo: []
    };
    opponent = {
        name: 'Computer',
        shots: 0,
        hits: 0,
        misses: 0,
        compBoard: [
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null]
        ],
        compAttempts: [
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null]
        ],
        hitFive: [],
        hitFour: [],
        hitFirstThree: [],
        hitSecondThree: [],
        hitTwo: [],
        sunkShipPegs: []
    };
    turn = 1;
    winner = 0;
    allPiecesSet = false;
    renderPlayerBoard();
    
    $("#set-board > div:not(:first)").hide();
    $("#shot").prop('disabled', true);

    autoSetBoard(opponent.compBoard);
}


function generateRand(){
    let a = Math.floor(Math.random() * 9); // will return 0 - 8; this chooses which array on compBoard
    let b = Math.floor(Math.random() * 11); // will return 0-10; this chooses which item on array[a] on compBoard
    let c = Math.floor(Math.random() * 2) + 1; // will return either 1 (horizontal) or 2 (vertical)
    return [a, b, c];
}

function checkSpace(board, piece, nums){
    let a = nums[0]; 
    let b = nums[1]; 
    let direction = nums[2];
    let potentialPlacement = [];
    if (direction === 1 && (board[a].length - b) >= piece) {
        for (let i = 0; i < piece; i++) {
            potentialPlacement.push(board[a][b + i]);
        }
    } else if (direction === 1 && (board[a].length - b) < piece) {
        for (let i = 0; i < piece; i++) {
            potentialPlacement.push(board[a][b - i]);
        } 
    } else if (direction === 2 && (numOfRows - a) >= piece) {
        for (let i = 0; i < piece; i++) {
            potentialPlacement.push(board[a + i][b]);
        } 
    } else if (direction === 2 && (numOfRows - a) < piece) {
        for (let i = 0; i < piece; i++) {
            potentialPlacement.push(board[a - i][b]);
        } 
    } else {
            console.log('error');
        }
    return potentialPlacement.every(square => square === null);
}

function setPiece(board, piece, nums){
    let a = nums[0]; 
    let b = nums[1];
    let direction = nums[2];
    if (direction === 1 && (board[a].length - b) >= piece) {
        for (let i = 0; i < piece; i++) {
            board[a][b + i] = piece + compPieces.indexOf(piece);
        }
    } else if (direction === 1 && (board[a].length - b) < piece) {
        for (let i = 0; i < piece; i++) {
            board[a][b - i] = piece + compPieces.indexOf(piece);
        } 
    } else if (direction === 2 && (numOfRows - a) >= piece) {
        for (let i = 0; i < piece; i++) {
            board[a + i][b] = piece + compPieces.indexOf(piece);
        } 
    } else if (direction === 2 && (numOfRows - a) < piece) {
        for (let i = 0; i < piece; i++) {
            board[a - i][b] = piece + compPieces.indexOf(piece);
        } 
    }
}

function attemptPlaceShip(board, piece){
    let nums = generateRand(); 
    let avail = checkSpace(board, piece, nums); 
    if (avail === true) {
        setPiece(board, piece, nums);
    } else if (avail === false) {
        attemptPlaceShip(board, piece);
    } 
}
function autoSetBoard(board){
    compPieces.forEach(function(piece) {
        attemptPlaceShip(board, piece);
    });
}
function validateInput($a, $b, $c){
    if ($a >= 0 && $a <= 8 && 
        $b >= 0 && $b <= 10 && 
        $c >= 1 && $c <= 2 && 
        Number.isInteger($a) === true && 
        Number.isInteger($b) === true && 
        Number.isInteger($c) === true) {
            return true;
        } else {
            return false;
        }
}

function takeShot($a, $b, attemptBoard, targetBoard, person){
    let val = targetBoard[$a][$b];
    if (val === 9) {
        targetBoard[$a][$b] += 1;
        person.hitFive.push(val);
        checkTheWinner(val, person); 

        person.shots += 1;
        person.hits += 1;
        attemptBoard[$a][$b] = targetBoard[$a][$b];
        if (turn === -1) {optimizeCompAI()};

    } else if (val === 7) {

        targetBoard[$a][$b] += 1;
        person.hitFour.push(val);
        checkTheWinner(val, person);

        person.shots += 1;
        person.hits += 1;
        attemptBoard[$a][$b] = targetBoard[$a][$b];
        if (turn === -1) {optimizeCompAI()};

    } else if (val === 4) {
   
        targetBoard[$a][$b] += 1;
        person.hitFirstThree.push(val);
        checkTheWinner(val, person);

        person.shots += 1;
        person.hits += 1;
        attemptBoard[$a][$b] = targetBoard[$a][$b];
        if (turn === -1) {optimizeCompAI()};

    } else if (val === "32") {
     
        targetBoard[$a][$b] += 1;
        person.hitSecondThree.push(val);
        checkTheWinner(val, person);

        person.shots += 1;
        person.hits += 1;
        attemptBoard[$a][$b] = targetBoard[$a][$b];
        if (turn === -1) {optimizeCompAI()};

    } else if (val === 2) {

        targetBoard[$a][$b] += 1;
        person.hitTwo.push(val);
        checkTheWinner(val, person);

        person.shots += 1;
        person.hits += 1;
        attemptBoard[$a][$b] = targetBoard[$a][$b];
        if (turn === -1) {optimizeCompAI()};

    } else if (val === null) {

        targetBoard[$a][$b] = -1;
        person.shots += 1;
        person.misses += 1;
        attemptBoard[$a][$b] = targetBoard[$a][$b];

    } else {
        if (turn === 1) {
        $('#message').html(`<p style="color:red;">You've already taken that shot!</p>`);
        turn *= -1; 
    } else if (turn === -1) {
        compShot();
        turn *= -1; 
      }
    }
}

function checkTheWinner(val, person){
    renderPlayerAttempts();
    renderPlayerBoard();

    if (val === 9){
        if (person.hitFive.length >= 5){
            if (turn === -1){
                guessArray = [];
                $(`<p id="temporary">The enemy sunk your Carrier!</p>`).appendTo(opponentMessageEl).delay(2000).fadeOut();
            }
            if (turn === 1){
                $(`<p id="temporary">You sunk a Carrier!</p>`).appendTo(playerMessageEl).delay(2000).fadeOut();
                $(`<img src="https://i.imgur.com/bHRgbHf.png" alt="Sunk Carrier">`).appendTo(sunkShipsEl);
            }
        }
    } else if (val === 7){
        if (person.hitFour.length >= 4){
            if (turn === -1){
                guessArray = [];
                $(`<p id="temporary">The enemy sunk your Battleship!</p>`).appendTo(opponentMessageEl).delay(2000).fadeOut();
            }
            if (turn === 1){
                $(`<p id="temporary">You sunk a Battleship!</p>`).appendTo(playerMessageEl).delay(2000).fadeOut();
                $(`<img src="https://i.imgur.com/mLBmRrz.png?1" alt="Sunk Battleship">`).appendTo(sunkShipsEl);
            }
        }
    } else if (val === 4){
        if (person.hitFirstThree.length >= 3){
            if (turn === -1){
                guessArray = [];
                $(`<p id="temporary">The enemy sunk your Cruiser!</p>`).appendTo(opponentMessageEl).delay(2000).fadeOut();
            }
            if (turn === 1){
                $(`<p id="temporary">You sunk a Cruiser!</p>`).appendTo(playerMessageEl).delay(2000).fadeOut();
                $(`<img src="https://i.imgur.com/ffXJSQV.png?1" alt="Sunk Cruiser">`).appendTo(sunkShipsEl);
            }
        }
    } else if (val === "32"){
        if (person.hitSecondThree.length >= 3){
            if (turn === -1){
                guessArray = [];
                $(`<p id="temporary">The enemy sunk your Submarine!</p>`).appendTo(opponentMessageEl).delay(2000).fadeOut();
            }
            if (turn === 1){
                $(`<p id="temporary">You sunk a Submarine!</p>`).appendTo(playerMessageEl).delay(2000).fadeOut();
                $(`<img src="https://i.imgur.com/ffXJSQV.png?1" alt="Sunk Submarine">`).appendTo(sunkShipsEl);
            }
        }
    } else if (val === 2){
        if (person.hitTwo.length >= 2){
            if (turn === -1){
                guessArray = [];
                $(`<p id="temporary">The enemy sunk your Destroyer!</p>`).appendTo(opponentMessageEl).delay(2000).fadeOut();
            }
            if (turn === 1){
                $(`<p id="temporary">You sunk a Destroyer!</p>`).appendTo(playerMessageEl).delay(2000).fadeOut();
                $(`<img src="https://i.imgur.com/GxIhmve.png?1" alt="Sunk Destroyer">`).appendTo(sunkShipsEl);
        }
    } 
    }
    if (person.hitFive.length === 5 && person.hitFour.length === 4 && person.hitFirstThree.length === 3 && person.hitSecondThree.length === 3 && person.hitTwo.length === 2){
        if (person === player) {$('#main-title > img').attr('src', 'https://i.imgur.com/6bbElny.png')};
        if (person === opponent) {$('#main-title > img').attr('src', 'https://i.imgur.com/f8TavA5.png')};
    }
}

function renderPlayerBoard() {
    let rowId = -1;
    player.playerBoard.forEach(function(row){
        let cellId = -1;
        rowId+= 1;
        row.forEach(function(cell){
            cellId+= 1;
         if (cell === 10 || cell === 8 || cell === 5 || cell === "321" || cell === 3){
            $(`#playerBoard > #${xCoordinates[cellId]}${yCoordinates[rowId]} > div`).css('background-color', 'red');
            $(`#playerBoard > #${xCoordinates[cellId]}${yCoordinates[rowId]}`).css('background-color', 'gray');
        } else if (cell >= 1){
            $(`#${xCoordinates[cellId]}${yCoordinates[rowId]}`).css('background-color', 'gray');
            $(`#playerBoard > #${xCoordinates[cellId]}${yCoordinates[rowId]} > div`).css('background-color', 'rgba(0, 0, 0, 0.5)');
        } else if (cell === -1){
            $(`#playerBoard > #${xCoordinates[cellId]}${yCoordinates[rowId]} > div`).css('background-color', 'white');
        } 
    })
  })
}

function renderPlayerAttempts() {
    let rowId = -1;
    player.playerAttempts.forEach(function(row){
        let cellId = -1;
        rowId+= 1;
        row.forEach(function(cell){
            cellId+= 1;

        if (cell === 10 || cell === 8 || cell === 5 || cell === "321" || cell === 3){
            $(`#playerAttempts > #${xCoordinates[cellId]}${yCoordinates[rowId]} > div`).css('background-color', 'red');
        } if (cell === -1){
            $(`#playerAttempts > #${xCoordinates[cellId]}${yCoordinates[rowId]} > div`).css('background-color', 'white');
        } 
    })
  })
}

function compShot(){

    if (opponent.hits >= 1 && opponent.hits - opponent.sunkShipPegs.length > 0 && guessArray.length > 0){ //need to figure out how to get this to stop going after we sunk a ship; 
        
        $a = guessArray[0][0];
        $b = guessArray[0][1];
        guessArray.shift(); // guess array is "optimizing" and then shifting so it slices off the wrong one;
        takeShot($a, $b, opponent.compAttempts, player.playerBoard, opponent);
        turn *= -1;
        render();

    } else {
        $a = Math.floor(Math.random() * 9); 
        $b = Math.floor(Math.random() * 11);
        takeShot($a, $b, opponent.compAttempts, player.playerBoard, opponent);
        turn *= -1;
        render(); 
    }
};


function cleanUp(person, board) {
    if (person.hitFive.length === 5){
        board.forEach(function(row){
            row.forEach(function(cell, i) {
                if (cell === 10) {
                    row[i] = 'X';
                    opponent.sunkShipPegs.push(row[i]);
                }
            })
        })
    }

    if (person.hitFour.length === 4){
        board.forEach(function(row){
            row.forEach(function(cell, i) {
                if (cell === 8) {
                    row[i] = 'X';
                    opponent.sunkShipPegs.push(row[i]);
                }
            })
        })
    }

    if (person.hitFirstThree.length === 3){
        board.forEach(function(row){
            row.forEach(function(cell, i) {
                if (cell === 5) {
                    row[i] = 'X';
                    opponent.sunkShipPegs.push(row[i]);
                }
            })
        })
    }

    if (person.hitSecondThree.length === 3){
        board.forEach(function(row){
            row.forEach(function(cell, i) {
                if (cell === "321") {
                    row[i] = 'X';
                    opponent.sunkShipPegs.push(row[i]);
                }
            })
        })
    }

    if (person.hitTwo.length === 2){
        board.forEach(function(row){
            row.forEach(function(cell, i) {
                if (cell === 3) {
                    row[i] = 'X';
                    opponent.sunkShipPegs.push(row[i]);
                }
            })
        })
    }
}

function getTarget() {
    const isHit = (element) => parseInt(element) > 1;
    let targetArray = [];
    
    opponent.compAttempts.forEach(function(row, idx){ 
        for(i = 0; i < row.length; i++) {
            if (row[i] > 0) {
              targetArray.push([idx, i]);
            }
        }
      })
        return (targetArray);
    }


  function getGuessArray(targetArray){

    if (targetArray.length > 1 && targetArray[0][0] === targetArray[1][0]) {
        targetArray.forEach(function(pair){
            let $a = pair[0];
            let $b = pair[1];
            guessArray.unshift([$a, ($b + 1)], [$a, ($b - 1)]); // row 
          })
    } else if (targetArray.length > 1 && targetArray[0][1] === targetArray[1][1]) {
        targetArray.forEach(function(pair){
            let $a = pair[0];
            let $b = pair[1];
            guessArray.unshift([($a + 1), $b], [($a - 1), $b]); // column 
          })
    } else {
      targetArray.forEach(function(pair){
      let $a = pair[0];
      let $b = pair[1];
      guessArray.unshift([($a + 1), $b], [$a, ($b + 1)], [$a, ($b - 1)], [($a - 1), $b]); // standard
    })

    }

    guessArray.forEach(function(set, i){
        let valid = validateInput(set[0], set[1], 1);
            if (valid === false) {
                guessArray.splice(i, 1);
                }
            })
        return guessArray;
    }


function optimizeCompAI() {
    cleanUp(opponent, opponent.compAttempts);
    if (opponent.hits > 0 && opponent.hits - opponent.sunkShipPegs.length > 0) { //need to figure out how to get this to stop going after we sunk a ship;
    getGuessArray(getTarget());
    }
}




function render() {
    renderPlayerAttempts();
    renderPlayerBoard();

    $('#opponent-shots').text(`Opponent's Shots: ${opponent.shots}`);
    $('#opponent-hits').text(`Opponent's Hits: ${opponent.hits}`);
    $('#opponent-misses').text(`Opponent's Misses: ${opponent.misses}`);

    $('#player-shots').text(`Player's Shots: ${player.shots}`);
    $('#player-hits').text(`Player's Hits: ${player.hits}`);
    $('#player-misses').text(`Player's Misses: ${player.misses}`);


    if (allPiecesSet === true){
    }   

    if (turn === -1) {
        $("#guess").show();
        $("#message").hide();

        compShot();

    } else if (turn === 1) {
        $("#guess").hide();
        $("#message").show();
    } 
}

$('#reset').click(function(evt){
    init();
    render();
    $(`.dot`).css('background-color', 'transparent');
    $(`#playerBoard > div:not(.label)`).css('background-color', 'transparent');
    $(`#playerAttempts > div:not(.label)`).css('background-color', 'transparent');
    $("#set-board > div").show();
    $("#set-board > div:not(:first)").hide();
    $("#sunk-ships").empty();
    $('#warning').remove();
    $("#sunk-ships").append('<p>Sunk Ships</p>');
    $('#message').html(`<p id="message">Bombs away</p>`);
    $('#main-title > img').attr('src', 'https://i.imgur.com/A46zxx7.jpg');
    $('#randomize').show();
})













init();
console.log(opponent.compBoard);
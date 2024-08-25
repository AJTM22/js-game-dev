// console.log("Hello World!");

// Declare our variable for our 2D array, score, row, and columns.
let board;
let score = 0;
let rows = 4;
let columns = 4;
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

// Create a function to set the game
// start of setGame()
function setGame() {
    // Initialize the 4x4 game board with all tiles set to 0.
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];


    // Create the gameboard on the HTML document
    // 0 < 4 (Y)
    // 1 < 4 (Y)
    // 2 < 4 (Y)
    // 3 < 4 (Y)
    // 4 < 4 (N)

    // First loop is to create rows, second loop is to create columns
    // inner loop will be executed first before outer loop
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // console.log(`[r${r}-c${c}]`);

            // create div element representing a tile
            let tile = document.createElement("div");

            // set a unique id for each tile based on its coordinate.
            // 2-3
            // "+" is use to concatenate values if dealing with String.
            tile.id = r.toString() + "-" + c.toString();

            // get the number from the board
            // wherein the board is currently set to 0
            let num = board[r][c];

            // Update the tile's apperance based on the value.
            updateTile(tile, num);

            // Place the tile inside the grid (board), in the right row and column.
            document.getElementById("board").append(tile);

        }
    }

    // Random Tile
    setTwo();
    setTwo();
}

// function should be invoke to execute codes.
// setGame();
// end of setGame()

// start of updateTile()
function updateTile(tile, num) {
    // clear the tile text
    tile.innerText = "";

    // clear the classList to avoid multiple classes
    tile.classList.value = "";

    // add class named "tile" to the classList of the tile, for the styling.
    tile.classList.add("tile");

    // to check if the current num parameter is not zero
    if (num > 0) {
        // set the tile's text to the number based on the num value.
        tile.innerText = num.toString();

        // example: num = 128, the class "x128" will be added to the tile.
        //  8192 <= 4096 (N)
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        }
        else {
            // if number is greater than 4096, a special class "x8192" will be added.
            tile.classList.add("x8192");
        }
    }
}
// end of updateTile()

// start of window.onload
// event that triggers when a webpage finished loading.
window.onload = function () {
    setGame();
}
// end of window.onload

// start of handleSlide()
// "e" represents the event object, which contains information about the event occured.
function handleSlide(e) {
    // check the keydown event.
    console.log(e.code);

    // Check if the pressed key's code is one of the arrow keys.
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {

        // prevent default behavior, to avoid scrolling on keydown.
        e.preventDefault();

        // (=) assignment operator (to assing/change value of a variable), (==) operator to compare if value from left to right are equal.
        if (e.code == "ArrowLeft") {
            slideLeft();
            setTwo();
        }
        else if (e.code == "ArrowRight") {
            slideRight();
            setTwo();
        }
        else if (e.code == "ArrowUp") {
            slideUp();
            setTwo();
        }
        else if (e.code == "ArrowDown") {
            slideDown();
            setTwo();
        }

        document.getElementById("score").innerText = score;

        // use setTimeout to delay the alert
        setTimeout(() => {
            if(hasLost()) {
                alert("Game Over! You have lost the game. Game will restart.")
                // reset the game
                restartGame();
                alert("Press any arrow key to restart.");
            }
            else{
                checkWin();
            }
        }, 100); //delay time in miliseconds
    }

    
}

// When any key is pressed, the handleSlide() is called to handle the key press.
document.addEventListener("keydown", handleSlide);
// end of handleSlide()

// start of filterZero(tiles)
// removing empty tiles
function filterZero(tiles) {
    // create new array removing the zeroes
    return tiles.filter(num => num != 0);
}
// end of filterZero(tiles)

// start of slide(tiles)
// function for sliding and merging tiles
function slide(tiles) {
    // [0,2,2,2]
    // [2,2,2] -> get rid of zeroes
    tiles = filterZero(tiles);

    for (let i = 0; i < tiles.length; i++) {

        // if two adjacent numbers are equal.
        // [2,2,2]
        //  0 1 2
        // tiles[0] == tiles[0+1]
        // 2 == 2
        if (tiles[i] == tiles[i + 1]) {
            // merge them by doubling the first one
            tiles[i] *= 2;
            // set the second one to zero
            tiles[i + 1] = 0;
            // result: [2,2,2] -> [4,0,2]
            score += tiles[i];
        }
    }

    // [4,0,2] -> [4,2]
    tiles = filterZero(tiles);

    // Add zeroes back
    while (tiles.length < 4) {
        // add zero on the end of the array
        tiles.push(0);
        // [4,2,0,0]
    }

    // [4,2,0,0]
    return tiles;
}
// end of slide(tiles)

// start of slideLeft()
function slideLeft() {
    for (let r = 0; r < rows; r++) {

        // store current row in the row variable
        let row = board[r]; // r = 0: [0,2,2,2]

        // Line for animation
        // Copy the content of the original row
        let originalRow = row.slice();

        // slide() function will return a new value for a specific row. (merging of tiles)
        row = slide(row);

        // Updated value in the board.
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            // Line for animation
            if(originalRow[c] !== num && num !== 0){
                // Specify the animation style and duration
                tile.style.animation = "slide-from-right 0.3s";

                // Remove the animation class after animation completion
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }

            updateTile(tile, num);
        }
    }
}
// end of slideLeft()

// start of slideRight()
function slideRight() {
    for (let r = 0; r < rows; r++) {

        // store current row in the row variable
        let row = board[r]; // r = 0: [0,2,2,2]

        // Line for animation
        // Copy the content of the original row
        let originalRow = row.slice();

        // reverse the row array since it is sliding to right
        // r = 0: [0,2,2,2] -> [2,2,2,0]
        row.reverse();

        // slide() function will return a new value for a specific row. (merging of tiles)
        row = slide(row); // [4,2,0,0]

        row.reverse(); // [0,0,2,4]

        // Updated value in the board.
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            // Line for animation
            if (originalRow[c] !== num && num !== 0) {
                // Specify the animation style and duration
                tile.style.animation = "slide-from-left 0.3s";

                // Remove the animation class after animation completion
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }

            updateTile(tile, num);
        }
    }
}
// end of slideRight()

// start of slideUp()
function slideUp() {
    for (let c = 0; c < columns; c++) {

        // create a temporary array col that represents the column from top to bottom
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

        let originalCol = col.slice();

        col = slide(col);

        for (let r = 0; r < rows; r++) {
            // set the values of board array back to the values of the modified col.
            board[r][c] = col[r];

            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            // If statement to apply animation
            if(originalCol[r] !== num && num !== 0){
                tile.style.animation = "slide-from-bottom 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }

            updateTile(tile, num);
        }
    }
}
// end of slideUp()

// start of slideDown()
function slideDown() {
    for (let c = 0; c < columns; c++) {

        // create a temporary array col that represents the column from top to bottom
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

        col.reverse();
        col = slide(col);
        let originalCol = col.slice();
        col.reverse();

        for (let r = 0; r < rows; r++) {
            // set the values of board array back to the values of the modified col.
            board[r][c] = col[r];

            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            // If statement to apply animation
            if (originalCol[r] !== num && num !== 0) {
                tile.style.animation = "slide-from-top 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }

            updateTile(tile, num);
        }
    }
}
// end of slideDown()

// start of hasEmptyTile
// check whether game board contains any empty space (0) tiles.
// Return a boolean value (true/false)

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // Check if current tile == 0, if yes it will return true
            if (board[r][c] == 0) {
                return true;
            }
        }
    }

    // no tile == 0
    return false;
}
// end of hasEmptyTile

// start of setTwo()

// add a new random "2" tile in the game board.
function setTwo() {
    // check if hasEmptyTile is false.
    // ! - opposite of the boolean
    if (!hasEmptyTile()) {
        return;
    }

    // Declare a value found tile
    let found = false;

    // this will run until random empty tile is found.
    while (!found) {

        // Math.random() - generates random number base on the given condition
        // Math.floor() - rounds down to the nearest integer.
        // To get a random value for r and c from 1 - 4.
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        // If the position values is 0, set the value to 2
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");

            // Set the found variable to tre.
            found = true;
        }

    }

}

// end of setTwo()

// start of checkWin()
function checkWin() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // check if the current tile is a winning tile
            // once 2048 already exist the alert message will only pop once.
            if (board[r][c] == 2048 && is2048Exist == false) {
                alert("You Win! You got 2048.");
                is2048Exist = true;
            }
            else if (board[r][c] == 4096 && is4096Exist == false) {
                alert("You are unstoppable at 4096! You are fantastically unstoppable!");
                is4096Exist = true;
            }
            else if (board[r][c] == 8192 && is8192Exist == false) {
                alert("Victory! You have reached 8192! You are incredibly awesome!");
                is8192Exist = true;
            }
        }
    }
}
// end of checkWin()

// start of hasLost()
// check if the board is full
function hasLost() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // found an empty tile, user has not lost
            if (board[r][c] == 0) {
                return false;
            }

            const currentTile = board[r][c];

            // check if the adjacent (up, down, left, right) cells have possible merge
            if (
                r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile
            ){
                // Found adjacent cells with the same value, user has not lost.
                return false;
            }
        }
    }

    // No possible moves left or empty tiles, user lost
    return true;
}
// end of hasLost()

// start of restartGame()
// RestartGame by replacing all values into zero.
function restartGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    setTwo();   // new tile
    score = 0;  

}
// end of restartGame()

// For MOBILE devices

// Declare variable for touch input
let startX = 0, startY = 0;

// Event listener to capture touch in the screen and assigns the x and y coordinates in the startX and startY variable
document.addEventListener("touchstart", (e) =>{
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    
    // console.log(startX);
    // console.log(startY);
})

// Event listener to check where you touch the screen and prevents scrolling. Input targets any element that includes the word tile
document.addEventListener("touchmove", (e) =>{
    if(!e.target.className.includes("tile")){
        return
    }
    e.preventDefault();
}, {passive: false});

// Listen for the touchend event on the entire document
document.addEventListener("touchend", (e) =>{
    // Check if the element triggered has a class name "tile"
    if(!e.target.className.includes("tile")){
       return; // Exit the function
    }

    // Calculate the difference between the initial touch position and the final touch
    let diffX = startX - e.changedTouches[0].clientX;
    let diffY = startY - e.changedTouches[0].clientY;

    console.log(diffX);
    console.log(diffY);

    // Check if the swipe is for horizontal or vertical
    // Horizontal is greater than vertical
    if(Math.abs(diffX) > Math.abs(diffY)){
        // Horizontal swipe
        if(diffX > 0){
            slideLeft();
            setTwo();
        }
        else{
            slideRight();
            setTwo();
        }
    }
    else{
        // Vertical swipe
        if(diffY > 0){
            slideUp();
            setTwo();
        }
        else{
            slideDown();
            setTwo();
        }
    }
    document.getElementById("score").innerText = score;
    // use setTimeout to delay the alert
    setTimeout(() => {
        if (hasLost()) {
            alert("Game Over! You have lost the game. Game will restart.")
            // reset the game
            restartGame();
            alert("Tap anywhere on the screen to restart.");
        }
        else {
            checkWin();
        }
    }, 100); //delay time in miliseconds
})
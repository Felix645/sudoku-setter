let checkRow = function(grid, number, row_index, column_index) {
    let row_valid = true;

    let row = grid[row_index];

    row.forEach(function(item, index) {
        if( index === column_index ) {
            return;
        }

        if( item === number ) {
            row_valid = false;
        }
    });

    return row_valid;
}


let checkColumn = function(grid, number, row_index, column_index) {
    let column_valid = true;
    let column = [];

    grid.forEach(function(row) {
        row.forEach(function(item, index) {
            if( index === column_index ) {
                column.push(item);
            }
        });
    });

    column.forEach(function(item, index) {
        if( index === row_index ) {
            return;
        }

        if(item === number) {
            column_valid = false;
        }
    });

    return column_valid;
};


let getBoxNumbers = function(grid, number, row_index, column_index) {
    let row_from, row_to, col_from, col_to;

    if( row_index <= 2 && column_index <= 2 ) {
        row_from = 0;
        row_to = 2;
        col_from = 0;
        col_to = 2;
    } else if( row_index <= 5 && column_index <= 2 ) {
        row_from = 3;
        row_to = 5;
        col_from = 0;
        col_to = 2;
    } else if( row_index <= 8 && column_index <= 2 ) {
        row_from = 6;
        row_to = 8;
        col_from = 0;
        col_to = 2;
    } else if( row_index <= 2 && column_index <= 5 ) {
        row_from = 0;
        row_to = 2;
        col_from = 3;
        col_to = 5;
    } else if( row_index <= 5 && column_index <= 5 ) {
        row_from = 3;
        row_to = 5;
        col_from = 3;
        col_to = 5;
    } else if( row_index <= 8 && column_index <= 5 ) {
        row_from = 6;
        row_to = 8;
        col_from = 3;
        col_to = 5;
    } else if( row_index <= 2 && column_index <= 8 ) {
        row_from = 0;
        row_to = 2;
        col_from = 6;
        col_to = 8;
    } else if( row_index <= 5 && column_index <= 8 ) {
        row_from = 3;
        row_to = 5;
        col_from = 6;
        col_to = 8;
    } else if( row_index <= 8 && column_index <= 8 ) {
        row_from = 6;
        row_to = 8;
        col_from = 6;
        col_to = 8;
    }

    let boxNumbers = [];

    grid.forEach(function(row, current_row_index) {
        if( current_row_index < row_from || current_row_index > row_to ) {
            return;
        }

        boxNumbers[current_row_index] = [];
        row.forEach(function(item, current_col_index) {
            if( current_col_index < col_from || current_col_index > col_to ) {
                return;
            }

            boxNumbers[current_row_index][current_col_index] = item;
        });
    });

    return boxNumbers;
};


let checkBox = function(grid, number, row_index, column_index) {
    let boxValid = true;
    let box = getBoxNumbers(grid, number, row_index, column_index);

    box.forEach(function(row, current_row_index) {
        row.forEach(function(item, current_col_index) {
            if( row_index === current_row_index && column_index === current_col_index ) {
                return;
            }

            if( item === number ) {
                boxValid = false;
            }
        });
    });

    return boxValid;
};


let checkNumber = function(grid, number, row, column) {
    let rowValid = checkRow(grid, number, row, column);
    let columnValid = checkColumn(grid, number, row, column);
    let boxValid = checkBox(grid, number, row, column);

    return rowValid && columnValid && boxValid;
};


let getRandomNumber = function() {
    return Math.floor(Math.random() * (8 + 1));
}


let eraseNumber = function(numberToErase, grid) {
    let erased_grid = grid;
    grid.forEach(function(row, row_index) {
        row.forEach(function(number, col_index) {
            if( number === numberToErase ) {
                erased_grid[row_index][col_index] = 0;
            }
        });
    });

    return erased_grid;
}


let placeNumber = function(grid, number, total_tries, retries = 0) {

    console.log('------------------------------------------------------')
    console.log('total tries: '+total_tries);
    console.log('placing number: ' + number);
    console.log('retries: ' + retries);

    if( total_tries > 300000000000 ) {
        throw "Too many tries (placeNumber): "+total_tries;
    }

    if( number < 1 ) {
        return {
            grid: grid,
            tries: total_tries,
            placed_number: number
        };
    }

    let tries = 0;
    let amount_placed = 0;

    while(amount_placed < 9 && tries < 100000) {
        total_tries++;
        tries++;

        let row = getRandomNumber();
        let column = getRandomNumber();

        let oldNumber = grid[row][column];

        if( oldNumber !== 0 || oldNumber === number ) {
            continue;
        }

        grid[row][column] = number;

        if( !checkNumber(grid, number, row, column) ) {
            grid[row][column] = oldNumber;
            continue;
        }

        amount_placed++;
    }

    console.log('amount of tries: '+tries);
    console.log('numbers placed: '+amount_placed);

    let result;
    if (amount_placed < 9) {
        console.log('Not enough numbers placed');
        grid = eraseNumber(number, grid);

        if( retries < 200 ) {
            result = placeNumber(grid, number, total_tries, retries + 1);
        } else {
            result = placeNumber(grid, number - 1, total_tries, 0);
        }

        grid = result.grid;
        total_tries = total_tries + result.tries;

        return {
            grid: grid,
            tries: total_tries,
            placed_number: number
        };
    }

    console.log('total tries: '+total_tries);

    return {
        grid: grid,
        tries: total_tries,
        placed_number: number
    };
};


// const numbers = [1, 2, 3, 4, 5, 6, 7, 8 ,9];
const numbers = [1, 2, 3, 4, 5, 6, 7, 8];

let grid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

let total_tries = 0;
for( let number = 1; number <= 9; number++) {
    if( total_tries > 300000000000 ) {
        throw "Too many tries (parent): "+total_tries;
    }

    let result = placeNumber(grid, number, total_tries);

    grid = result.grid;
    total_tries = result.tries;

    number = result.placed_number;
}


console.log('------------------------------------------------------')
console.log('DONE, total tries: '+total_tries);

grid.forEach(function(row, row_index) {
    row.forEach(function(number, column_index) {
        let cell = document.querySelector('[data-row="'+row_index+'"] [data-col="'+column_index+'"]');

        if( number !== 0 ) {
            cell.innerText = number;
        }
    });
});

// console.log(grid);

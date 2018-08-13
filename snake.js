var snake = [ [6,3], [8, 3], [10, 3]];
var apple = [3, 9];

function initPlayfield(n = 20) {
    console.log(n);
    var n = 20;
    const cell_count = n * n;
    for (i=0;i<cell_count;i++) {
        temp = document.createElement('div');
        temp.className = 'cell';
        temp.id = i;
        temp.innerHTML = i;
        document.getElementById('playfield').appendChild(temp);
    }

    getCell(3, 9).style.backgroundColor = "green";
    for (i=0;i<snake.length;i++)
        getCell(snake[i][0], snake[i][1]).style.backgroundColor = "red";

}

function generateEat(snake) {
    x = Math.floor(Math.random() * (39 - 0 + 1) + 0);
    y = Math.floor(Math.random() * (9 - 0 + 1) + 0);
    console.log(x);
    console.log(y);
    apple = [x, y];
    console.log(apple);
    colorizeCell(apple, "green");

    //for (i=0; i<snake.size; i++) {
    //    console.log(snake[i]);
    //    if (snake[i][0] != x && snake[i][1] != y) {
    //        apple = [x, y];
    //        console.log(apple);
    //        colorizeCell(apple, "green");
    //    }
    //}
}

var eat_consumed = false;

function eatApple(apple, snake_head) {
    console.log(snake_head);
    console.log(apple);
    if (parseInt(snake_head[0]) == apple[0] && parseInt(snake_head[1]) == apple[1])  {
        snake.push(snake[snake.length-1]);
        generateEat(snake);
        eat_consumed = true;
    }
}

function checkBite(head_coord) {
    //
}

function checkBorders(head_coord, new_head_coord) {
    head_coord = parseInt(head_coord.join(""));
    console.log(new_head_coord);
    if (new_head_coord > 399 || new_head_coord < 0) {
        confirm("You lose!");
        gameOver();
    }

    if (head_coord % 20 == 0 && new_head_coord[1] == 9 ||
        head_coord % 10 == 9 && parseInt(new_head_coord.join("")) % 20 == 0) {
        confirm("You lose!");
        gameOver();
    }
}

function colorizeCell(cell, color="red") {
    getCell(cell[0], cell[1]).style.backgroundColor = color;
}

function _move(_direction, snake, offset) {
    head = snake[0];
    head_coord = parseInt(head.join(""));
    new_head_coord = String(head_coord + offset);
    if (new_head_coord.length > 2) {
        new_head_coord = [parseInt(new_head_coord.slice(0, 2)), parseInt(new_head_coord.slice(-1))];
        checkBorders(head, new_head_coord);
        eatApple(apple, new_head_coord);
        snake.unshift(new_head_coord);
    }
    else if (new_head_coord.length < 2) {
        new_head_coord = [0, parseInt(new_head_coord.slice(-1))];
        checkBorders(head, new_head_coord);
        eatApple(apple, new_head_coord);
        snake.unshift(new_head_coord);
    }
    else {
        new_head_coord = [parseInt(new_head_coord.slice(0, 1)), parseInt(new_head_coord.slice(-1))];
        checkBorders(head, new_head_coord);
        eatApple(apple, new_head_coord);
        snake.unshift(new_head_coord);
    }

    try {
        getCell(snake[0][0], snake[0][1]).style.backgroundColor = 'red';
    }
    catch (e) {
        gameOver();
    }
    el = snake.pop();
    getCell(el[0], el[1]).style.backgroundColor = 'blue';
}

function gameOver() {
    confirm("You lose!");
    window.location.reload(false);
}


var left_locked = false;
var right_locked = false;
var up_locked = false;
var down_locked = false;

function move(_direction, snake) {
    switch (_direction) {
    case 'left':
        if (!left_locked) {
            _move(_direction, snake, -1);
            up_locked = false;
            right_locked = true;
            down_locked = false;
        } else {
            direction = 'right';
            _move(_direction, snake, 1);
        }
        break;
    case 'right':
        if (!right_locked) {
            _move(_direction, snake, 1);
            up_locked = false;
            down_locked = false;
            left_locked = true;
        } else {
            direction = 'left';
            _move(_direction, snake, -1);
        }
        break;
    case 'up':
        if (!up_locked) {
            _move(_direction, snake, -20);
            down_locked = true;
            right_locked = false;
            left_locked = false;
        } else {
            direction = 'down';
            _move(_direction, snake, 20);
        }
        break;
    case 'down':
        if (!down_locked) {
            _move(_direction, snake, 20);
            right_locked = false;
            left_locked = false;
            up_locked = true;
        }
        else {
            direction = 'up';
            _move(_direction, snake, -20);
        }
        break;
    }
}


document.onkeydown = function(e) {
    switch (e.keyCode) {
    case 37:
    case 65:
        direction = 'left';
        break;
    case 38:
    case 87:
        console.log('up');
        direction = 'up';
        break;
    case 39:
    case 68:
        console.log('right');
        direction = 'right';
        break;
    case 40:
    case 83:
        console.log('down');
        direction = 'down';
        break;
    }
};

function getCell(x, y) {
    x = String(x);
    y = String(y);
    if (x==0) {
        cell = document.getElementById(y);
    }
    else {
        cell = document.getElementById(x + y);
    }
    return cell;
}

var interval_setted = false;
function set_interval() {
    if (!interval_setted) {
        interval_setted = true;
        setInterval(onTimerTick, 150);
    }
}

var direction = 'up';
down_locked = true;
var pause = false;
function onTimerTick() {
    if (!pause)
        move(direction, snake);
}

function pauseToggle() {
    if (pause) {
        pause = false;
        document.getElementById("pause-game").innerHTML = "Pause!";
    } else {
        pause = true;
        document.getElementById("pause-game").innerHTML = "Resume!";
    }
}

if (document.readyState !== 'loading') {
    initPlayfield();
    document.getElementById("start-game").onclick = set_interval;
    document.getElementById("pause-game").onclick = pauseToggle;
}
else
{
    document.addEventListener('DOMContentLoaded', initPlayfield);
    document.getElementById("start-game").onclick = set_interval;
    document.getElementById("pause-game").onclick = pauseToggle;
}

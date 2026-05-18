const game = document.getElementById("game");
const start = document.getElementById("start");
const totaltime = document.getElementById("totaltime");
const playertime = document.getElementById("playertime");
const red = document.getElementById("redpts");
const blue = document.getElementById("bluepts");
const ghost = document.getElementById("ghost");
const stopper = document.getElementById("stopper");

const rows = 12;
const cols = 6;

red.style.color = "red";

let running = false;
let min = 3;
let sec = 0;

let playersec = 15;
let bool = true;
let firstclicks = 0;

let redpts = 0;
let bluepts = 0;

ghost.style.display = "none";
ghost.dataset.value = 0;
ghost.dataset.cap = 100;

stopper.style.display = "none";

const contmatrix1 = [2, 3, 3, 3, 3, 2];
const contmatrix2 = [3, 4, 4, 4, 4, 3];

const updateScore = () => {
    red.textContent = `Red:- ${redpts}`;
    blue.textContent = `Blue:- ${bluepts}`;
};

const entry = function (btn) {

    switch (btn.dataset.value) {

        case "0":
            btn.textContent = "";
            break;

        case "1":
            btn.innerHTML = "●";
            break;

        case "2":
            btn.innerHTML = "●●";
            break;

        case "3":
            btn.innerHTML = "●●<br>●";
            break;

        case "4":
            if (bool) {
                btn.innerHTML = "●●●●";
            } else {
                btn.innerHTML = "●●<br>●●";
            }
            break;
    }
};

const setColor = () => {

    const allBtns = document.querySelectorAll("button");

    allBtns.forEach((btn) => {

        if (btn.dataset.belongs === "red") {
            btn.style.color = "red";
        }

        else if (btn.dataset.belongs === "blue") {
            btn.style.color = "blue";
        }
    });
};

stopper.onclick = function () {

    if (running) {

        running = false;
        stopper.innerText = "resume";
    }

    else {

        running = true;
        stopper.innerText = "pause";

        timer();
        playertimer();
    }
};

start.onclick = function () {

    if (!running) {

        running = true;

        stopper.style.display = "";
        start.style.display = "none";

        timer();
        playertimer();
    }
};

const wincheck = function () {

    if (firstclicks < 2) return;

    let reds = document.querySelectorAll('[data-belongs="red"]').length;
    let blues = document.querySelectorAll('[data-belongs="blue"]').length;

    if (reds === 0) {

        alert("Blue Wins!");
        running = false;
        stopper.style.display = "none";
    }

    if (blues === 0) {

        alert("Red Wins!");
        running = false;
        stopper.style.display = "none";
    }
};

const explode = function (btn) {

    btn.dataset.belongs = "";

    let [i, j] = btn.id.split(",").map(Number);

    btn.dataset.value = 0;

    entry(btn);

    let up, down, left, right;

    if (i === 0) {
        up = ghost;
    } else {
        up = document.getElementById(`${i - 1},${j}`);
    }

    if (i === 11) {
        down = ghost;
    } else {
        down = document.getElementById(`${i + 1},${j}`);
    }

    if (j === 0) {
        left = ghost;
    } else {
        left = document.getElementById(`${i},${j - 1}`);
    }

    if (j === 5) {
        right = ghost;
    } else {
        right = document.getElementById(`${i},${j + 1}`);
    }

    const arr = [up, down, left, right];

    arr.forEach((cell) => {

        if (bool) {
            cell.dataset.belongs = "red";
        } else {
            cell.dataset.belongs = "blue";
        }

        cell.dataset.value = Number(cell.dataset.value) + 1;
    });

    if (bool) {
        redpts += Number(btn.dataset.cap);
    } else {
        bluepts += Number(btn.dataset.cap);
    }

    arr.forEach((cell) => {

        if (cell.dataset.value == cell.dataset.cap) {
            explode(cell);
        }

        entry(cell);
    });

    ghost.dataset.value = 0;
};

const fclick = function (btn) {

    if (
        (btn.dataset.belongs === "red" && bool) ||
        (btn.dataset.belongs === "blue" && !bool)
    ) {

        explode(btn);
    }

    else {

        btn.dataset.value = Number(btn.dataset.cap) - 1;

        entry(btn);

        if (bool) {

            btn.dataset.belongs = "red";
            btn.style.color = "red";

            redpts += Number(btn.dataset.value);
        }

        else {

            btn.dataset.belongs = "blue";
            btn.style.color = "blue";

            bluepts += Number(btn.dataset.value);
        }

        updateScore();

        timerreset();
    }
};

const click = function (btn) {

    if (
        (btn.dataset.belongs === "red" && bool) ||
        (btn.dataset.belongs === "blue" && !bool)
    ) {

        btn.dataset.value = Number(btn.dataset.value) + 1;

        if (bool) {
            redpts++;
        } else {
            bluepts++;
        }

        if (btn.dataset.value == btn.dataset.cap) {
            explode(btn);
        }

        entry(btn);

        timerreset();

        updateScore();

        setColor();

        wincheck();
    }
};

const turner = function () {

    if (bool) {

        red.style.color = "aliceblue";
        blue.style.color = "blue";

        bool = false;
    }

    else {

        red.style.color = "red";
        blue.style.color = "aliceblue";

        bool = true;
    }
};

const timerreset = function () {

    playersec = 15;
    turner();
};

for (let i = 0; i < rows; i++) {

    for (let j = 0; j < cols; j++) {

        const btn = document.createElement("button");

        btn.id = `${i},${j}`;

        btn.dataset.belongs = "";
        btn.dataset.value = 0;

        if (i === 0 || i === 11) {
            btn.dataset.cap = contmatrix1[j];
        }

        else {
            btn.dataset.cap = contmatrix2[j];
        }

        btn.onclick = function () {

            if (running) {

                if (firstclicks < 2) {

                    firstclicks++;
                    fclick(btn);
                }

                else {
                    click(btn);
                }
            }
        };

        game.appendChild(btn);
    }
}

const playertimer = function () {

    if (!running) return;

    playertime.textContent =
        `Player Time:- 0:${playersec < 10 ? "0" : ""}${playersec}`;

    playersec--;

    if (playersec < 0) {
        timerreset();
    }

    setTimeout(playertimer, 1000);
};

const timer = function () {

    if (!running) return;

    if (sec === 0) {

        if (min > 0) {

            min--;
            sec = 59;
        }
    }

    else {
        sec--;
    }

    totaltime.textContent =
        `Time:- ${min}:${sec < 10 ? "0" : ""}${sec}`;

    if (min === 0 && sec === 0) {

        running = false;

        timeout();

        return;
    }

    setTimeout(timer, 1000);
};

const timeout = function () {

    if (redpts > bluepts) {
        alert("Red Wins!");
    }

    else if (bluepts > redpts) {
        alert("Blue Wins!");
    }

    else {
        alert("It's a tie!");
    }

    stopper.style.display = "none";
};
let count = 0;
let gameInAction = true;

window.addEventListener("load", () => {
  if (!checkPath()) {
    return null;
  };
  document.getElementById("input1-div").className = "input hidden";
  document.getElementById("input2-div").className = "input hidden";
  const board = document.getElementById("board");
  board.setAttribute("style", "background-color: black; width: 70vmin; height: 70vmin;")
  startGame();
  const gameRestart = document.getElementById("restart-game");
  gameRestart.addEventListener("click", startGame);
});

function checkPath() {
  const path = location.pathname;
  if (path === "/games/tictactoe") {return true};
}
function startGame() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  gameInAction = true;
  document.getElementById("info").textContent = "";
  count = 0;
  for (let i = 0 ; i < 3 ; i++) {
    const tr = document.createElement("tr");
    for (let j = 0 ; j < 3 ; j++) {
      const td = `
      <td class="cell" id="c${i}${j}"></td>`
      tr.insertAdjacentHTML("beforeend", td);
    }
    board.appendChild(tr);
  }
  board.onclick = tick_cell;
}
function tick_cell(e) {
  if (e.target.textContent == "" && gameInAction) {
    count = ++count;
    e.target.textContent = (count % 2 == 0) ? "X" : "O";
    checkWinner(e);
  }
}
function checkWinner(e) {
  let row = e.target.id.slice(1,2);
  let column = e.target.id.slice(2,3);
  let cellrc = document.getElementById("c" + row + column).textContent;

  let cellr0 = document.getElementById("c" + row + "0").textContent;
  let cellr1 = document.getElementById("c" + row + "1").textContent;
  let cellr2 = document.getElementById("c" + row + "2").textContent;

  let cell0c = document.getElementById("c" + "0" + column).textContent;
  let cell1c = document.getElementById("c" + "1" + column).textContent;
  let cell2c = document.getElementById("c" + "2" + column).textContent;

  let cell00 = document.getElementById("c" + "0" + "0").textContent;
  let cell11 = document.getElementById("c" + "1" + "1").textContent;
  let cell22 = document.getElementById("c" + "2" + "2").textContent;

  let cell02 = document.getElementById("c" + "0" + "2").textContent;
  let cell20 = document.getElementById("c" + "2" + "0").textContent;
  
  switch (true) {
    case cellr0 == cellr1 && cellr0 == cellr2:
      endGame(cellrc); break;
    case cell0c == cell1c && cell0c == cell2c:
      endGame(cellrc); break;
    case row == column && (cell00 == cell11 && cell00 == cell22):
      endGame(cellrc); break;
    case Number(row) + Number(column) == 2 && (cell02 == cell11 && cell02 == cell20):
      endGame(cellrc); break;
  }
}
function endGame(e) {
  document.getElementById("info").textContent = e + " Wins!!";
  gameInAction = false;
}
  
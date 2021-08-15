import { showContents } from "./utils/displayStyles.js";

window.addEventListener("load", () => {
  if (!checkPath()) {
    return null;
  }
  "use strict";
  showContents(getShowContentsIds());
  hideContents();
  let gameRestartBtn = document.getElementById("restart-game");
  let board = document.getElementById("board");
  let gameTimer = NaN;
  prepareGame();
  startGame();
  gameRestartBtn.onclick = startGame;

  function startGame() {
    let select1 = Number(document.getElementById("select1").value);
    let firstClick = false;
    let tiles = [];
    prepareBoard(tiles);
    prepareContents();

    function prepareBoard(tiles) {
      board.innerHTML = "";
      for (let i = 0 ; i < select1 ; i++) {
        let tr = document.createElement("tr");
        for (let j = 0 ; j < select1 ; j++) {
          let index = i * select1 + j
          let td = document.createElement("td");
          td.className = "tile";
          td.index = index;
          td.style.height = `${75 / select1}vmin`;
          td.style.width = `${75 / select1}vmin`;
          td.style.fontSize = `${120 / select1}px`;
          td.id = "tile" + (index + 1);
          td.textContent = index == (select1 * select1 - 1) ? "" : (index + 1);
          td.onclick = click;
          tr.appendChild(td);
          tiles.push(td)
        }
        board.appendChild(tr);
      }
      for (let i = 0 ; i < 1000 + (select1 * select1 * select1) ; i++) {
        click({ srcElement: {index: Math.floor(Math.random() * (select1 * select1))}})
      }
      firstClick = true;
    }
    function prepareContents() {
      gameRestartBtn.textContent = "RESTART";
      clearInterval(gameTimer);
      document.getElementById("timer").textContent = `00:00:00`;
      document.getElementById("info1").textContent = "";
    }
    function click(e) {
      if (firstClick) {
        startTimer();
        firstClick = false;
      }
      let clicked = e.srcElement.index;
      let blank = document.getElementById(`tile${select1 * select1}`).index;
      let distance = blank - clicked;
      if (Math.floor(clicked / select1) == Math.floor(blank / select1)) {// clickedとblankが同じ行なら
        for (let k = 0 ; k < Math.abs(distance) ; k++) {
          swap(blank, blank - Math.sign(distance));
          blank = document.getElementById(`tile${select1 * select1}`).index;
        }
        judge();
      } else if (clicked % select1 == blank % select1) {
        for (let k = 0 ; k < Math.abs(distance) / select1 ; k++) {// clickedとblankが同じ列なら
          swap(blank, blank - Math.sign(distance) * select1);
          blank = document.getElementById(`tile${select1 * select1}`).index;
        }
        judge();
      }
    }
    function swap(i, j) {
      let tileI = tiles[i];
      let tileJ = tiles[j];
      let tmpTextContent = tileI.textContent;
      let tmpId = tileI.id;
      tileI.textContent = tileJ.textContent;
      tileI.id = tileJ.id;
      tileJ.textContent = tmpTextContent;
      tileJ.id = tmpId;
    }
    function judge() {
      let goal = 0
      tiles.forEach( function(tile) {
        if (tile.textContent == (tile.index + 1) ||
            (tile.textContent == "" && tile.index == (select1 * select1 - 1))) {
          goal = goal;
        } else {
          goal = goal + 1;
        }
      })
      if (goal == 0) {
        clearInterval(gameTimer);
        document.getElementById("info1").textContent = " You've DONE IT!!";
      }
    }
  }
  function startTimer() {
    let elapsedTime = 0;
    gameTimer = setInterval(() => {
      elapsedTime ++;
      let hour = Math.floor(elapsedTime / 3600);
      let minute = Math.floor(elapsedTime / 60);
      let second = Math.floor(elapsedTime % 60);
      hour = ("0" + hour).slice(-2);
      minute = ("0" + minute).slice(-2);
      second = ("0" + second).slice(-2);
      document.getElementById("timer").textContent = `${hour}:${minute}:${second}`;
    }, 1000);
  }
  function prepareGame() {
    gameRestartBtn.textContent = "START";
    document.getElementById("select1-message").textContent = "※マス目の数を指定（○×○マス）"
    document.getElementById("select1").value = 4
    document.getElementById("inputs-wrapper").style.height = "65px";
  }
  function checkPath() {
    const path = location.pathname;
    if (path === "/games/15puzzle") {return true};
  }
  function hideContents() {
    document.getElementById("select2-div").style.display = "none";
    document.getElementById("input-info").style.display = "none";
  }
});

function getShowContentsIds() {
  return [
    "top-btn-wrapper",
    "inputs-wrapper",
    "select-boxes-wrapper",
    "game-info-wrapper"
  ]
}

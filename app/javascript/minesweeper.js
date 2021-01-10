window.addEventListener("load", () => {
  if (!checkPath()) {
    return null;
  }
  "use strict";
  revealContents();
  let helperBtn = document.getElementById("helper-btn");
  const select1 = document.getElementById("select1");
  const select2 = document.getElementById("select2");
  let plowBtn = document.getElementById("game-btn1");
  let acornBtn = document.getElementById("game-btn2");
  let easyBtn = document.getElementById("difficulty1");
  let mediumBtn = document.getElementById("difficulty2");
  let hardBtn = document.getElementById("difficulty3");
  let clearMessage = document.getElementById("clear-message");
  let helperMessage = document.getElementById("helper-btn-message");
  let clearImage = document.getElementById("clear-image");
  let difficulty = "EASY";
  let difficultyValue = 0.123;
  let acornModeCode = false;
  let gameTimer = NaN;

  let tiles = [];
  let acorns = [];
  let firstClick = true;
  let gameInAction = true;
  let remainingAcorns = select2.value;
  initializeGame();
  restartGame();
  document.getElementById("restart-game").onclick = restartGame;

  function restartGame() {
    let board = document.getElementById("board");
    tiles = [];
    acorns = [];
    remainingAcorns = select2.value;
    gameInAction = true;
    firstClick = true;
    document.getElementById("show-settings-check").checked = false;
    prepareContents();
    prepareBoard(tiles);
    changeRemainingAcorns();
    buryAcorns(acorns);
    countNearbyAcorns(tiles, acorns);
    helperBtn.onclick = firstStep;

    function prepareContents() {
      clearInterval(gameTimer);
      document.getElementById("timer").textContent = `00:00:00`;
      helperBtn.className = "";
      helperMessage.textContent = "";
      clearMessage.textContent = "";
      clearImage.className = "hidden squirrel-happy";
    }
    function prepareBoard(tiles) {
      board.innerHTML = "";
      board.className = "minesweeper-board";
      for (let i = 0; i < Number(select1.value); i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < Number(select1.value); j++) {
          let index = i * Number(select1.value) + j
          let td = document.createElement("td");
          td.className = "tile-closed";
          td.index = index;
          td.id = `tile${index}`
          td.style.height = `${65 / Number(select1.value)}vmin`;
          td.style.width = `${65 / Number(select1.value)}vmin`;
          td.onclick = click;
          tr.appendChild(td);
          tiles.push(td)
        }
        board.appendChild(tr);
      }
    }
    function buryAcorns(acorns) {
      let tileIndexes = [];
      for (let i = 0; i < Number(select1.value) * Number(select1.value); i++) {
        tileIndexes.push(i);
      }
      for (let i = 0; i < select2.value; i++) {
        let random = Math.floor(Math.random() * tileIndexes.length);
        let buriedTile = tileIndexes[random];
        tileIndexes.splice(random, 1);
        acorns.push(buriedTile);
      }
      acorns.forEach((acorn) => {
        tiles[acorn].value = "A"
      });
    }
    function countNearbyAcorns(tiles, acorns) {
      tiles.forEach((tile, i) => {
        if (tile.value == "A") {
          return null;
        }
        const isTopTile = Math.floor(i / Number(select1.value)) == 0;
        const isBottomTile = Math.floor(i / Number(select1.value)) == (Number(select1.value) - 1);
        const isLeftMostTile = Math.floor(i % Number(select1.value)) == 0;
        const isRightMostTile = Math.floor(i % Number(select1.value)) == (Number(select1.value) - 1);

        let adjacentAcorns = 0;
        if (!isTopTile && acorns.includes(i - Number(select1.value))) {// 一番上でない → 上を見る
          adjacentAcorns++;
        }
        if (!isBottomTile && acorns.includes(i + Number(select1.value))) {// 一番下でない → 下を見る
          adjacentAcorns++;
        }
        if (!isLeftMostTile && acorns.includes(i - 1)) {// 一番左でない → 左を見る
          adjacentAcorns++;
        }
        if (!isRightMostTile && acorns.includes(i + 1)) {// 一番右でない → 右を見る
          adjacentAcorns++;
        }
        if (!isTopTile && !isLeftMostTile && acorns.includes(i - Number(select1.value) - 1)) {// 一番上でなく、左でもない → 左上を見る
          adjacentAcorns++;
        }
        if (!isTopTile && !isRightMostTile && acorns.includes(i - Number(select1.value) + 1)) {// 一番上でなく、右でもない → 右上を見る
          adjacentAcorns++;
        }
        if (!isBottomTile && !isLeftMostTile && acorns.includes(i + Number(select1.value) - 1)) {// 一番下でなく、左でもない → 左下を見る
          adjacentAcorns++;
        }
        if (!isBottomTile && !isRightMostTile && acorns.includes(i + Number(select1.value) + 1)) {// 一番下でなく、右でもない → 右下を見る
          adjacentAcorns++;
        }
        if (adjacentAcorns != 0) {
          tile.textContent = adjacentAcorns;
          tile.value = adjacentAcorns;
        }
      });
    }
  }
  function click(e) {
    if (firstClick) {
      startTimer();
      firstClick = false;
    }
    if (acornModeCode) {
      rightClick(e);
      return null;
    }
    if (!gameInAction) {
      return null;
    }
    let clicked = e.srcElement;
    if (clicked.className == "tile-open" || clicked.className == "acorn-mark") {
      return null;
    } else if (clicked.value == "A") {
      clicked.className = "tile-broken";
      gameOver();
    } else if (clicked.value != null) {
      clicked.className = "tile-open";
      clicked.style.fontSize = `${35 / Number(select1.value)}vmin`;
      judge();
    } else if (clicked.value == null) {
      clicked.className = "tile-open";
      clicked.style.fontSize = `${35 / Number(select1.value)}vmin`;
      clickBlank(clicked);
    }
  }
  function clickBlank(clicked) {
    let i = clicked.index;
    let array = [];
    const isTopTile = Math.floor(i / Number(select1.value)) == 0;
    const isBottomTile = Math.floor(i / Number(select1.value)) == (Number(select1.value) - 1);
    const isLeftMostTile = Math.floor(i % Number(select1.value)) == 0;
    const isRightMostTile = Math.floor(i % Number(select1.value)) == (Number(select1.value) - 1);
    if (!isTopTile && tiles[i - Number(select1.value)].className != "tile-open") {// 一番上でない → 上をクリック
      array.push(tiles[i - Number(select1.value)]);
    }
    if (!isBottomTile && tiles[i + Number(select1.value)].className != "tile-open") {// 一番下でない → 下をクリック
      array.push(tiles[i + Number(select1.value)]);
    }
    if (!isLeftMostTile && tiles[i - 1].className != "tile-open") {// 一番左でない → 左をクリック
      array.push(tiles[i - 1]);
    }
    if (!isRightMostTile && tiles[i + 1].className != "tile-open") {// 一番右でない → 右をクリック
      array.push(tiles[i + 1]);
    }
    if (!isTopTile && !isLeftMostTile && tiles[i - Number(select1.value) - 1].className != "tile-open") {// 一番上でなく、左でもない → 左上をクリック
      array.push(tiles[i - Number(select1.value) - 1]);
    }
    if (!isTopTile && !isRightMostTile && tiles[i - Number(select1.value) + 1].className != "tile-open") {// 一番上でなく、右でもない → 右上をクリック
      array.push(tiles[i - Number(select1.value) + 1]);
    }
    if (!isBottomTile && !isLeftMostTile && tiles[i + Number(select1.value) - 1].className != "tile-open") {// 一番下でなく、左でもない → 左下をクリック
      array.push(tiles[i + Number(select1.value) - 1]);
    }
    if (!isBottomTile && !isRightMostTile && tiles[i + Number(select1.value) + 1].className != "tile-open") {// 一番下でなく、右でもない → 右下をクリック
      array.push(tiles[i + Number(select1.value) + 1]);
    }
    array.forEach(tile => {
      if (tile.className == "tile-open" || tile.className == "acorn-mark") {
        return null;
      } else if (tile.value != null) {
        tile.className = "tile-open";
        tile.style.fontSize = `${35 / Number(select1.value)}vmin`;
      } else if (tile.value == null) {
        tile.className = "tile-open";
        tile.style.fontSize = `${35 / Number(select1.value)}vmin`;
        clickBlank(tile);
      }
    })
    judge();
  }
  function rightClick(e) {
    if (firstClick) {
      startTimer();
      firstClick = false;
    }
    if (!gameInAction) {
      return null;
    }
    let clicked = e.srcElement;
    if (clicked.className == "tile-open") {
      return null;
    } else if (clicked.className == "acorn-mark") {
      clicked.className = "tile-closed";
      remainingAcorns++;
      changeRemainingAcorns();
    } else {
      clicked.className = "acorn-mark";
      remainingAcorns--;
      changeRemainingAcorns();
      judge();
    }
  }
  function changeRemainingAcorns() {
    document.getElementById("info1").textContent = `残りのどんぐりの数 ${remainingAcorns}`;
  }
  function judge() {
    let closedTiles = document.getElementsByClassName("tile-closed");
    if (closedTiles.length == 0 && remainingAcorns == 0) {
      clearInterval(gameTimer);
      clearMessage.textContent = "おめでとう！リスも大喜び";
      clearImage.className = "squirrel-happy";
      board.className = "minesweeper-board-clear"
    }
  }
  function gameOver() {
    clearInterval(gameTimer);
    clearMessage.textContent = "どんぐり踏んじゃった";
    gameInAction = false;
  }
  function firstStep(e) {
    plowBtn.click();
    document.getElementById("show-settings-check").checked = false;
    if (tiles.find(tile => tile.value == null) != null) {
      e.srcElement.className = "hidden";
      let random = Math.floor(Math.random() * tiles.length);
      if (tiles[random].value == null) {
        tiles[random].click();
      } else {
        firstStep(e);
      }
    } else {
      helperMessage.textContent = "ごめんなさい。どんぐりが多すぎて、お力になれません。";
    }
  }
  function initializeGame() {
    helperBtn.textContent = "はじめの第一歩"
    document.getElementById("select1-message").textContent = "※1辺のマスの数";
    document.getElementById("select2-message").textContent = "※どんぐりの数";
    select1.value = 9;
    select2.value = 10;
    plowBtn.className = "plow-btn game-btn-on";
    document.getElementById("game-btn-text1").innerHTML = "<span>Z：</span>畑を耕す";
    acornBtn.className = "acorn-btn game-btn-off";
    document.getElementById("game-btn-text2").innerHTML = "<span>X：</span>印をつける";
    easyBtn.onclick = easyMode;
    mediumBtn.onclick = mediumMode;
    hardBtn.onclick = hardMode;
    plowBtn.onclick = plowMode;
    acornBtn.onclick = acornMode;
    document.addEventListener("keydown", pressKey);
    select1.addEventListener("input", () => {
      document.getElementById("input-info").textContent = `どんぐり${Math.floor(select1.value * select1.value * difficultyValue)}個で難易度${difficulty}`
    });
  }
  function startTimer() {
    let elapsedTime = 0;
    gameTimer = setInterval(() => {
      elapsedTime++;
      let hour = Math.floor(elapsedTime / 3600);
      let minute = Math.floor(elapsedTime / 60);
      let second = Math.floor(elapsedTime % 60);
      hour = ("0" + hour).slice(-2);
      minute = ("0" + minute).slice(-2);
      second = ("0" + second).slice(-2);
      document.getElementById("timer").textContent = `${hour}:${minute}:${second}`;
    }, 1000);
  }
  function easyMode() {
    select1.value = 9;
    select2.value = 10;
    difficulty = "EASY";
    difficultyValue = 0.123;
    document.getElementById("input-info").textContent = ""
    restartGame();
  }
  function mediumMode() {
    select1.value = 16;
    select2.value = 40;
    difficulty = "MEDIUM";
    difficultyValue = 0.15625;
    document.getElementById("input-info").textContent = ""
    restartGame();
  }
  function hardMode() {
    select1.value = 22;
    select2.value = 99;
    difficulty = "HARD";
    difficultyValue = 0.2045;
    document.getElementById("input-info").textContent = ""
    restartGame();
  }
  function pressKey(e) {
    if (e.key == "z") {
      plowMode();
    } else if (e.key == "x") {
      acornMode();
    }
  }
  function plowMode(e) {
    acornModeCode = false;
    plowBtn.className = "plow-btn game-btn-on";
    acornBtn.className = "acorn-btn game-btn-off";
  }
  function acornMode(e) {
    acornModeCode = true;
    plowBtn.className = "plow-btn game-btn-off";
    acornBtn.className = "acorn-btn game-btn-on";
  }
  function checkPath() {
    const path = location.pathname;
    if (path === "/games/minesweeper") { return true };
  }
  function revealContents() {
    document.getElementById("top-btn-wrapper").style.display = "";
    document.getElementById("inputs-wrapper").style.display = "";
    document.getElementById("difficulty-btns-wrapper").style.display = "";
    document.getElementById("select-boxes-wrapper").style.display = "";
    document.getElementById("game-btn-wrapper").style.display = "";
    document.getElementById("game-info-wrapper").style.display = "";
    document.getElementById("clear-image").style.display = "";
  }
});
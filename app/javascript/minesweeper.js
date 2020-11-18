window.addEventListener("load", () => {
  if (!checkPath()) {
    return null;
  }
  "use strict";
  let gameRestart = document.getElementById("restart-game");
  let helperBtn = document.getElementById("helper-btn");
  let select1 = document.getElementById("select1");
  let select2 = document.getElementById("select2");
  let plowBtn = document.getElementById("game-btn1");
  let acornBtn = document.getElementById("game-btn2");
  let easyBtn = document.getElementById("difficulty1");
  let mediumBtn = document.getElementById("difficulty2");
  let hardBtn = document.getElementById("difficulty3");
  let difficulty = "EASY";
  let difficultyValue = 1.12;
  let acornModeCode = false;
  let gameTimer = NaN;
  revealContents();
  prepareGame();
  
  gameRestart.addEventListener("click", () => {
    let board = document.getElementById("board");
    let select1Value = Number(document.getElementById("select1").value);
    let select2Value = Number(document.getElementById("select2").value);
    let helperMessage = document.getElementById("helper-btn-message");
    let clearMessage = document.getElementById("clear-message");
    let clearImage = document.getElementById("clear-image");
    let tiles = [];
    let acorns = [];
    let acornCount = select2.value;
    let gameInAction = true;
    let firstClick = true;
    prepareContents();
    prepareBoard(tiles);
    clearInterval(gameTimer);
    changeAcornCount();
    buryAcorns(acorns);
    countNearbyAcorns(tiles, acorns);
    helperBtn.onclick = firstStep;
    plowBtn.onclick = plowMode;
    acornBtn.onclick = acornMode;
    
    function prepareContents() {
      gameRestart.textContent = "RESTART";
      document.getElementById("timer").textContent = `00:00:00`;
      helperBtn.className = "";
      helperMessage.textContent = "";
      clearMessage.textContent = "";
      clearImage.className = "hidden squirrel-happy";
    }
    function prepareBoard(tiles) {
      board.innerHTML = "";
      board.className = "minesweeper-board";
      for (let i = 0 ; i < select1Value ; i++) {
        let tr = document.createElement("tr");
        for (let j = 0 ; j < select1Value ; j++) {
          let index = i * select1Value + j
          let td = document.createElement("td");
          td.className = "tile-closed";
          td.index = index;
          td.id = `tile${index}`
          td.style.height = `${65 / select1Value}vmin`;
          td.style.width = `${65 / select1Value}vmin`;
          td.style.fontSize = `${35 / select1Value}vmin`;
          td.onclick = click;
          // td.oncontextmenu = rightClick;
          tr.appendChild(td);
          tiles.push(td)
        }
        board.appendChild(tr);
      }
    }
    function changeAcornCount() {
      document.getElementById("info1").textContent = `残りのどんぐりの数 ${acornCount}`;
    }
    function buryAcorns(acorns) {
      let tileIndexes = [];
      for (let i = 0 ; i < select1Value * select1Value ; i++) {
        tileIndexes.push(i);
      }
      for (let i = 0 ; i < select2Value ; i++) {
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
        let acornCount = 0;
        if (Math.floor(i / select1Value) != 0 && acorns.includes(i - select1Value)) {// 一番上でない → 上を見る
          acornCount++;
        }
        if (Math.floor(i / select1Value) != (select1Value - 1) && acorns.includes(i + select1Value)) {// 一番下でない → 下を見る
          acornCount++;
        }
        if (Math.floor(i % select1Value) != 0 && acorns.includes(i - 1)) {// 一番左でない → 左を見る
          acornCount++;
        }
        if (Math.floor(i % select1Value) != (select1Value - 1) && acorns.includes(i + 1)) {// 一番右でない → 右を見る
          acornCount++;
        }
        if (Math.floor(i / select1Value) != 0 && Math.floor(i % select1Value) != 0 && acorns.includes(i - select1Value - 1)) {// 一番上でなく、左でもない → 左上を見る
          acornCount++;
        }
        if (Math.floor(i / select1Value) != 0 && Math.floor(i % select1Value) != (select1Value - 1) && acorns.includes(i - select1Value + 1)) {// 一番上でなく、右でもない → 右上を見る
          acornCount++;
        }
        if (Math.floor(i / select1Value) != (select1Value - 1) && Math.floor(i % select1Value) != 0 && acorns.includes(i + select1Value - 1)) {// 一番下でなく、左でもない → 左下を見る
          acornCount++;
        }
        if (Math.floor(i / select1Value) != (select1Value - 1) && Math.floor(i % select1Value) != (select1Value - 1) && acorns.includes(i + select1Value + 1)) {// 一番下でなく、右でもない → 右下を見る
          acornCount++;
        }
        if (acornCount != 0) {
          tile.textContent = acornCount;
          tile.value = acornCount;
        }
      });
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
        judge();
      } else if (clicked.value == null) {
        clicked.className = "tile-open";
        clickBlank(clicked);
      }
    }
    function clickBlank(clicked) {
      let i = clicked.index;
      if (Math.floor(i / select1Value) != 0 && tiles[i - select1Value].className != "tile-open") {// 一番上でない → 上をクリック
        tiles[i - select1Value].click();
      }
      if (Math.floor(i / select1Value) != (select1Value - 1) && tiles[i + select1Value].className != "tile-open") {// 一番下でない → 下をクリック
        tiles[i + select1Value].click();
      }
      if (Math.floor(i % select1Value) != 0 && tiles[i - 1].className != "tile-open") {// 一番左でない → 左をクリック
        tiles[i - 1].click();
      }
      if (Math.floor(i % select1Value) != (select1Value - 1) && tiles[i + 1].className != "tile-open") {// 一番右でない → 右をクリック
        tiles[i + 1].click();
      }
      if (Math.floor(i / select1Value) != 0 && Math.floor(i % select1Value) != 0 && tiles[i - select1Value - 1].className != "tile-open") {// 一番上でなく、左でもない → 左上をクリック
        tiles[i - select1Value - 1].click();
      }
      if (Math.floor(i / select1Value) != 0 && Math.floor(i % select1Value) != (select1Value - 1) && tiles[i - select1Value + 1].className != "tile-open") {// 一番上でなく、右でもない → 右上をクリック
        tiles[i - select1Value + 1].click();
      }
      if (Math.floor(i / select1Value) != (select1Value - 1) && Math.floor(i % select1Value) != 0 && tiles[i + select1Value - 1].className != "tile-open") {// 一番下でなく、左でもない → 左下をクリック
        tiles[i + select1Value - 1].click();
      }
      if (Math.floor(i / select1Value) != (select1Value - 1) && Math.floor(i % select1Value) != (select1Value - 1) && tiles[i + select1Value + 1].className != "tile-open") {// 一番下でなく、右でもない → 右下をクリック
        tiles[i + select1Value + 1].click();
      }
    }
    function rightClick(e) {
      if (firstClick) {
        startTimer();
        firstClick = false;
      }
      if (!acornModeCode) {
        click(e);
        return null;
      }
      if (!gameInAction) {
        return null;
      }
      let clicked = e.srcElement;
      if (clicked.className == "tile-open") {
        return null;
      } else if (clicked.className == "acorn-mark") {
        clicked.className = "tile-closed";
        acornCount++;
        changeAcornCount();
      } else {
        clicked.className = "acorn-mark";
        acornCount--;
        changeAcornCount();
        judge();
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

    function gameOver() {
      clearInterval(gameTimer);
      clearMessage.textContent = "どんぐり踏んじゃった";
      gameInAction = false;
    }
    function judge() {
      let closedTiles = document.getElementsByClassName("tile-closed");
      if (closedTiles.length == 0 && acornCount == 0) {
        clearInterval(gameTimer);
        clearMessage.textContent = "おめでとう！リスも大喜び";
        clearImage.className = "squirrel-happy";
        board.className = "minesweeper-board-clear"
      }
    }
  })
  function prepareGame() {
    gameRestart.textContent = "START";
    helperBtn.textContent = "はじめの第一歩"
    document.getElementById("select1-message").textContent = "※1辺のマスの数";
    document.getElementById("select2-message").textContent = "※どんぐりの数";
    select1.value = 9;
    select2.value = 10;
    plowBtn.className = "plow-btn game-btn-on";
    document.getElementById("game-btn-text1").textContent = "畑を耕す";
    acornBtn.className = "acorn-btn game-btn-off";
    document.getElementById("game-btn-text2").textContent = "印をつける";
    easyBtn.onclick = easyMode;
    mediumBtn.onclick = mediumMode;
    hardBtn.onclick = hardMode;
    select1.addEventListener("input", () => {
      document.getElementById("input-info").textContent = `どんぐり${Math.floor(select1.value * difficultyValue)}個で難易度${difficulty}`
    });
  }
  function easyMode() {
    select1.value = 9;
    select2.value = 10;
    difficulty = "EASY";
    difficultyValue = 1.12;
    gameRestart.click();
  }
  function mediumMode() {
    select1.value = 16;
    select2.value = 40;
    difficulty = "MEDIUM";
    difficultyValue = 2.5;
    gameRestart.click();
  }
  function hardMode() {
    select1.value = 22;
    select2.value = 99;
    difficulty = "HARD";
    difficultyValue = 4.5;
    gameRestart.click();
  }
  function checkPath() {
      const path = location.pathname;
      if (path === "/games/minesweeper") {return true};
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
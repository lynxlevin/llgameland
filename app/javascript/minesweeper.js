window.addEventListener("load", () => {
  if (!checkPath()) {
    return null;
  }
  "use strict";
  revealContents();
  let gameRestartBtn = document.getElementById("restart-game");
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
  prepareGame();
  startGame();
  gameRestartBtn.onclick = startGame;

  function startGame() {
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
    let holdTimer;
    let holdTime = 0;
    document.getElementById("show-settings-check").checked = false;
    prepareContents();
    prepareBoard(tiles);
    changeAcornCount();
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
          td.addEventListener("mousedown", mouseDown);
          td.addEventListener("touchstart", mouseDown);
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
          click(tiles[random]);
        } else {
          firstStep(e);
        }
      } else {
        helperMessage.textContent = "ごめんなさい。どんぐりが多すぎて、お力になれません。";
      }
    }
    function mouseDown(e) {
      e.preventDefault();
      e.srcElement.addEventListener("mouseup", mouseUp);
      e.srcElement.addEventListener("mouseleave", mouseLeave);
      e.srcElement.addEventListener("touchend", mouseUp);
      e.srcElement.addEventListener("touchmove", mouseLeave);
      holdTime = 0;
      let originalClass = e.srcElement.className;
      if (originalClass != "tile-open" && gameInAction) {
        holdTimer = setInterval( () => {
          holdTime++;
          if (holdTime == 28) {
            e.srcElement.className = `${originalClass} tile-holded`;
          }
        }, 10);
      }
    }
    function mouseUp(e) {
      e.srcElement.removeEventListener("touchend", mouseUp);
      e.srcElement.removeEventListener("touchmove", mouseLeave);
      e.srcElement.removeEventListener("mouseup", mouseUp);
      e.srcElement.removeEventListener("mouseleave", mouseLeave);
      clearInterval(holdTimer);
      if (holdTime >= 28) {
        e.srcElement.className = e.srcElement.className.split(' ')[0];
        rightClick(e.srcElement);
      } else {
        click(e.srcElement);
      }
    }
    function mouseLeave(e) {
      e.srcElement.removeEventListener("touchend", mouseUp);
      e.srcElement.removeEventListener("touchmove", mouseLeave);
      e.srcElement.removeEventListener("mouseup", mouseUp);
      e.srcElement.removeEventListener("mouseleave", mouseLeave);
      clearInterval(holdTimer);
      if (holdTime >= 28) {
        e.srcElement.className = e.srcElement.className.split(' ')[0];
      }
    }
    function click(clicked) {
      if (firstClick) {
        startTimer();
        firstClick = false;
      }
      if (acornModeCode) {
        rightClick(clicked);
        return null;
      }
      if (!gameInAction) {
        return null;
      }
      if (["tile-open", "acorn-mark"].includes(clicked.className)) {
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
        click(tiles[i - select1Value]);
      }
      if (Math.floor(i / select1Value) != (select1Value - 1) && tiles[i + select1Value].className != "tile-open") {// 一番下でない → 下をクリック
        click(tiles[i + select1Value]);
      }
      if (Math.floor(i % select1Value) != 0 && tiles[i - 1].className != "tile-open") {// 一番左でない → 左をクリック
        click(tiles[i - 1]);
      }
      if (Math.floor(i % select1Value) != (select1Value - 1) && tiles[i + 1].className != "tile-open") {// 一番右でない → 右をクリック
        click(tiles[i + 1]);
      }
      if (Math.floor(i / select1Value) != 0 && Math.floor(i % select1Value) != 0 && tiles[i - select1Value - 1].className != "tile-open") {// 一番上でなく、左でもない → 左上をクリック
        click(tiles[i - select1Value - 1]);
      }
      if (Math.floor(i / select1Value) != 0 && Math.floor(i % select1Value) != (select1Value - 1) && tiles[i - select1Value + 1].className != "tile-open") {// 一番上でなく、右でもない → 右上をクリック
        click(tiles[i - select1Value + 1]);
      }
      if (Math.floor(i / select1Value) != (select1Value - 1) && Math.floor(i % select1Value) != 0 && tiles[i + select1Value - 1].className != "tile-open") {// 一番下でなく、左でもない → 左下をクリック
        click(tiles[i + select1Value - 1]);
      }
      if (Math.floor(i / select1Value) != (select1Value - 1) && Math.floor(i % select1Value) != (select1Value - 1) && tiles[i + select1Value + 1].className != "tile-open") {// 一番下でなく、右でもない → 右下をクリック
        click(tiles[i + select1Value + 1]);
      }
    }
    function rightClick(clicked) {
      if (firstClick) {
        startTimer();
        firstClick = false;
      }
      if (!gameInAction) {
        return null;
      }
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
  }
  
  function prepareGame() {
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
    plowBtn.onclick = plowMode;
    acornBtn.onclick = acornMode;
    select1.addEventListener("input", () => {
      document.getElementById("input-info").textContent = `どんぐり${Math.floor(select1.value * difficultyValue)}個で難易度${difficulty}`
    });
  }
  function easyMode() {
    select1.value = 9;
    select2.value = 10;
    difficulty = "EASY";
    difficultyValue = 1.12;
    startGame();
  }
  function mediumMode() {
    select1.value = 16;
    select2.value = 40;
    difficulty = "MEDIUM";
    difficultyValue = 2.5;
    startGame();
  }
  function hardMode() {
    select1.value = 22;
    select2.value = 99;
    difficulty = "HARD";
    difficultyValue = 4.5;
    startGame();
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
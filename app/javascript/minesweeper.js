window.addEventListener("load", () => {
  if (!checkPath()) {
    return null;
  }
  const gameRestart = document.getElementById("restart-game");
  gameRestart.textContent = "START";
  let helperBtn = document.getElementById("helper-btn");
  helperBtn.textContent = "はじめの第一歩"
  document.getElementById("select1-message").textContent = "※1辺のマスの数";
  document.getElementById("select2-message").textContent = "※どんぐりの数";
  let select1 = document.getElementById("select1");
  let select2 = document.getElementById("select2");
  select1.value = 10;
  select2.value = 15;
  let plowBtn = document.getElementById("game-btn1");
  let acornBtn = document.getElementById("game-btn2");
  plowBtn.className = "plow-btn game-btn-on";
  document.getElementById("game-btn-text1").textContent = "畑を耕す";
  acornBtn.className = "acorn-btn game-btn-off";
  document.getElementById("game-btn-text2").textContent = "印をつける";
  let acornModeCode = false;
  
  gameRestart.addEventListener("click", () => {
    "use strict";
    helperBtn.className = "";
    helperBtn.onclick = firstStep;
    plowBtn.onclick = plowMode;
    acornBtn.onclick = acornMode;
    let gameInAction = true;
    let board = document.getElementById("board");
    let select1Value = Number(document.getElementById("select1").value);
    gameRestart.textContent = "RESTART";
    board.innerHTML = "";
    board.className = "minesweeper-board";
    let tiles = [];
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
        td.style.fontSize = `${240 / select1}px`;
        td.onclick = click;
        // td.oncontextmenu = rightClick;
        tr.appendChild(td);
        tiles.push(td)
      }
      board.appendChild(tr);
    }
    let acorns = [];
    let acornCount = select2.value;
    document.getElementById("info1").textContent = "";
    let helperMessage = document.getElementById("helper-btn-message");
    helperMessage.textContent = "";
    changeAcornCount();
    buryAcorn(acorns);
    countNearbyAcorns(tiles, acorns);
    showAcorns(tiles, acorns);
    
    function changeAcornCount() {
      document.getElementById("info2").textContent = `残りのどんぐりの数 ${acornCount}`;
    }
    function buryAcorn(acorns) {
      let tileIndexes = [];
      let select1Value = Number(document.getElementById("select1").value);
      let select2Value = Number(document.getElementById("select2").value);
      for (let i = 0 ; i < select1Value * select1Value ; i++) {
        tileIndexes.push(i);
      }
      for (let i = 0 ; i < select2Value ; i++) {
        let random = Math.floor(Math.random() * tileIndexes.length);
        let buriedTile = tileIndexes[random];
        tileIndexes.splice(random, 1);
        acorns.push(buriedTile);
      }
    }
    function countNearbyAcorns(tiles, acorns) {
      let select1Value = Number(document.getElementById("select1").value);
      tiles.forEach((tile, i) => {
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
    function showAcorns(tiles, acorns) {
      acorns.forEach((acorn) => {
        tiles[acorn].textContent = "A";
        tiles[acorn].value = "A"
      });
    }
    
    function firstStep(e) {
      plowBtn.click();
      if (board.innerHTML.includes("></td>")) {
        e.srcElement.className = "hidden";
        let random = Math.floor(Math.random() * tiles.length);
        if (tiles[random].textContent == "") {
          tiles[random].click();
        } else {
          firstStep(e);
        }
      } else {
        helperMessage.textContent = "ごめんなさい。どんぐりが多すぎて、お力になれません。";
      }

    }
    
    function click(e) {
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
      event.preventDefault();
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
    function gameOver() {
      document.getElementById("info1").textContent = "どんぐり踏んじゃった!!";
      gameInAction = false;
    }
  })
  function checkPath() {
      const path = location.pathname;
      if (path === "/games/minesweeper") {return true};
  }
});
window.addEventListener("load", () => {
  if (!checkPath()) {
    return null;
  }
  const gameRestart = document.getElementById("restart-game");
  gameRestart.textContent = "START";
  document.getElementById("select1-message").textContent = "※マス目の数を指定（○×○マス）"
  document.getElementById("select2-message").textContent = "※どんぐりの数を指定"
  let plowBtn = document.getElementById("game-btn1");
  let acornBtn = document.getElementById("game-btn2");
  plowBtn.className = "plow-btn game-btn-on";
  document.getElementById("game-btn-text1").textContent = "耕す";
  acornBtn.className = "acorn-btn game-btn-off";
  document.getElementById("game-btn-text2").textContent = "どんぐりマークをつける";
  let select1 = document.getElementById("select1");
  let select2 = document.getElementById("select2");
  select1.value = 10;
  select2.value = 15;
  
  gameRestart.addEventListener("click", () => {
    "use strict";
    let plowBtn = document.getElementById("game-btn1");
    let acornBtn = document.getElementById("game-btn2");
    plowBtn.onclick = plowMode;
    acornBtn.onclick = acornMode;
    let acornModeCode = false;
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
        // td.id = `tile${index}`
        td.style.height = `${63 / select1Value}vmin`;
        td.style.width = `${63 / select1Value}vmin`;
        td.style.fontSize = `${240 / select1}px`;
        td.onclick = click;
        // td.oncontextmenu = rightClick;
        tr.appendChild(td);
        tiles.push(td)
      }
      board.appendChild(tr);
    }
    let acorns = [];
    document.getElementById("info").textContent = "";
    buryAcorn(acorns);
    countNearbyAcorns(tiles, acorns);
    showAcorns(tiles, acorns);
    
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
      } else {
        clicked.className = "acorn-mark";
        return null;
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
      document.getElementById("info").textContent = "You Broke an Acorn";
      gameInAction = false;
    }
  })
  function checkPath() {
      const path = location.pathname;
      if (path === "/games/minesweeper") {return true};
  }
});
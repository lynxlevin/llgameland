import { showContents } from "./utils/displayStyles.js";
import { startTimer } from "./utils/timer.js";
import { checkPath } from "./utils/checkPath.js";

window.addEventListener("load", () => {
  if (!checkPath("/games/minesweeper")) {
    return null;
  }
  "use strict";
  const config = getConfig();
  const doms = getDoms();

  showContents(getShowContentsIds());
  let tiles = [];
  let isAcornMode = false;
  let gameTimer, isFirstClick, gameInAction, remainingAcorns, difficultyName, difficultyValue;
  initializeGame();
  restartGame();
  doms.restartBtn.onclick = restartGame;

  function initializeGame() {
    initializeViews();
    activateEventListeners();
    changeDifficulty(config.difficulty.easy);

    function initializeViews() {
      doms.helperBtn.textContent = "はじめの第一歩"
      doms.select1Message.textContent = "※1辺のマスの数";
      doms.select2Message.textContent = "※どんぐりの数";
      doms.gameBtnText1.innerHTML = "<span>Z：</span>畑を耕す";
      doms.gameBtnText2.innerHTML = "<span>X：</span>印をつける";
      doms.plowBtn.className = "plow-btn game-btn-on";
      doms.acornBtn.className = "acorn-btn game-btn-off";
    }
    function activateEventListeners() {
      doms.helperBtn.onclick = firstStep;
      doms.difficulty1.addEventListener("click", () => {
        changeDifficulty(config.difficulty.easy);
        restartGame();
      });
      doms.difficulty2.addEventListener("click", () => {
        changeDifficulty(config.difficulty.medium);
        restartGame();
      });
      doms.difficulty3.addEventListener("click", () => {
        changeDifficulty(config.difficulty.hard);
        restartGame();
      });
      doms.plowBtn.onclick = plowMode;
      doms.acornBtn.onclick = acornMode;
      document.addEventListener("keydown", changeClickMode);
      doms.select1.addEventListener("input", () => {
        doms.inputInfo.textContent = `どんぐり${Math.floor(doms.select1.value * doms.select1.value * difficultyValue)}個で難易度${difficultyName}`
      });
    }
    function changeDifficulty(diff) {
      difficultyName = diff.name;
      doms.select1.value = diff.select1;
      doms.select2.value = diff.select2;
      difficultyValue = diff.difficultyValue;
      doms.inputInfo.textContent = ""
    }
  }
  function restartGame() {
    resetContents();
    resetBoard();
    const acorns = [];
    buryAcorns();
    countNearbyAcorns();

    function resetContents() {
      tiles = [];
      gameInAction = true; //リファクタ removeEventListenerで代替できるか？
      isFirstClick = true;
      clearInterval(gameTimer);
      doms.timer.textContent = `00:00:00`;
      doms.showSettingsCheck.checked = false;
      doms.helperBtn.className = "";
      doms.helperBtnMessage.textContent = "";
      remainingAcorns = doms.select2.value;
      changeRemainingAcorns();
      doms.clearMessage.textContent = "";
      doms.clearImage.className = "hidden squirrel-happy";
    }
    function resetBoard() {
      doms.board.innerHTML = "";
      doms.board.className = "minesweeper-board";
      const sides = Number(doms.select1.value);
      for (let i = 0; i < sides; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < sides; j++) {
          let index = i * sides + j
          let td = document.createElement("td");
          td.className = "tile-closed";
          td.index = index;
          td.id = `tile${index}`
          td.style.height = `${65 / sides}vmin`;
          td.style.width = `${65 / sides}vmin`;
          td.onclick = click;
          tr.appendChild(td);
          tiles.push(td)
        }
        doms.board.appendChild(tr);
      }
    }
    function buryAcorns() {
      const tileIndexes = [];
      for (let i = 0; i < Number(doms.select1.value) ** 2; i++) {
        tileIndexes.push(i);
      }
      for (let i = 0; i < doms.select2.value; i++) {
        const random = Math.floor(Math.random() * tileIndexes.length);
        acorns.push(tileIndexes[random]);
        tileIndexes.splice(random, 1);
      }
      acorns.forEach((acorn) => {
        tiles[acorn].value = "A"
      });
    }
    function countNearbyAcorns() {
      tiles.forEach((tile, i) => {
        if (tile.value == "A") {
          return null;
        }
        const sides = Number(doms.select1.value);
        const isTopTile = Math.floor(i / sides) == 0;
        const isBottomTile = Math.floor(i / sides) == (sides - 1);
        const isLeftMostTile = Math.floor(i % sides) == 0;
        const isRightMostTile = Math.floor(i % sides) == (sides - 1);

        let adjacentAcorns = 0;
        if (!isTopTile && acorns.includes(i - sides)) {// 一番上でない → 上を見る
          adjacentAcorns++;
        }
        if (!isBottomTile && acorns.includes(i + sides)) {// 一番下でない → 下を見る
          adjacentAcorns++;
        }
        if (!isLeftMostTile && acorns.includes(i - 1)) {// 一番左でない → 左を見る
          adjacentAcorns++;
        }
        if (!isRightMostTile && acorns.includes(i + 1)) {// 一番右でない → 右を見る
          adjacentAcorns++;
        }
        if (!isTopTile && !isLeftMostTile && acorns.includes(i - sides - 1)) {// 一番上でなく、左でもない → 左上を見る
          adjacentAcorns++;
        }
        if (!isTopTile && !isRightMostTile && acorns.includes(i - sides + 1)) {// 一番上でなく、右でもない → 右上を見る
          adjacentAcorns++;
        }
        if (!isBottomTile && !isLeftMostTile && acorns.includes(i + sides - 1)) {// 一番下でなく、左でもない → 左下を見る
          adjacentAcorns++;
        }
        if (!isBottomTile && !isRightMostTile && acorns.includes(i + sides + 1)) {// 一番下でなく、右でもない → 右下を見る
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
    if (isFirstClick) {
      gameTimer = startTimer(gameTimer);
      isFirstClick = false;
    }
    if (isAcornMode) {
      rightClick(e);
      return null;
    }
    if (!gameInAction) {
      return null;
    }
    const clicked = e.srcElement;
    if (clicked.className == "tile-open" || clicked.className == "acorn-mark") {
      return null;
    } else if (clicked.value == "A") {
      clicked.className = "tile-broken";
      gameOver();
    } else if (clicked.value != null) {
      clicked.className = "tile-open";
      clicked.style.fontSize = `${35 / Number(doms.select1.value)}vmin`;
      judge();
    } else if (clicked.value == null) {
      clicked.className = "tile-open";
      clicked.style.fontSize = `${35 / Number(doms.select1.value)}vmin`;
      clickBlank(clicked);
    }
  }
  function clickBlank(clicked) {
    const i = clicked.index;
    const array = [];
    const sides = Number(doms.select1.value);
    const isTopTile = Math.floor(i / sides) == 0;
    const isBottomTile = Math.floor(i / sides) == (sides - 1);
    const isLeftMostTile = Math.floor(i % sides) == 0;
    const isRightMostTile = Math.floor(i % sides) == (sides - 1);
    if (!isTopTile && tiles[i - sides].className != "tile-open") {// 一番上でない → 上をクリック
      array.push(tiles[i - sides]);
    }
    if (!isBottomTile && tiles[i + sides].className != "tile-open") {// 一番下でない → 下をクリック
      array.push(tiles[i + sides]);
    }
    if (!isLeftMostTile && tiles[i - 1].className != "tile-open") {// 一番左でない → 左をクリック
      array.push(tiles[i - 1]);
    }
    if (!isRightMostTile && tiles[i + 1].className != "tile-open") {// 一番右でない → 右をクリック
      array.push(tiles[i + 1]);
    }
    if (!isTopTile && !isLeftMostTile && tiles[i - sides - 1].className != "tile-open") {// 一番上でなく、左でもない → 左上をクリック
      array.push(tiles[i - sides - 1]);
    }
    if (!isTopTile && !isRightMostTile && tiles[i - sides + 1].className != "tile-open") {// 一番上でなく、右でもない → 右上をクリック
      array.push(tiles[i - sides + 1]);
    }
    if (!isBottomTile && !isLeftMostTile && tiles[i + sides - 1].className != "tile-open") {// 一番下でなく、左でもない → 左下をクリック
      array.push(tiles[i + sides - 1]);
    }
    if (!isBottomTile && !isRightMostTile && tiles[i + sides + 1].className != "tile-open") {// 一番下でなく、右でもない → 右下をクリック
      array.push(tiles[i + sides + 1]);
    }
    array.forEach(tile => {
      if (tile.className == "tile-open" || tile.className == "acorn-mark") {
        return null;
      } else if (tile.value != null) {
        tile.className = "tile-open";
        tile.style.fontSize = `${35 / sides}vmin`;
      } else if (tile.value == null) {
        tile.className = "tile-open";
        tile.style.fontSize = `${35 / sides}vmin`;
        clickBlank(tile);
      }
    })
    judge();
  }
  function rightClick(e) {
    if (isFirstClick) {
      gameTimer = startTimer(gameTimer);
      isFirstClick = false;
    }
    if (!gameInAction) {
      return null;
    }
    const clicked = e.srcElement;
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
    doms.info1.textContent = `残りのどんぐりの数 ${remainingAcorns}`;
  }
  function judge() {
    const closedTiles = document.getElementsByClassName("tile-closed");
    if (closedTiles.length == 0 && remainingAcorns == 0) {
      clearInterval(gameTimer);
      doms.clearMessage.textContent = "おめでとう！リスも大喜び";
      doms.clearImage.className = "squirrel-happy";
      doms.board.className = "minesweeper-board-clear"
    }
  }
  function gameOver() {
    clearInterval(gameTimer);
    doms.clearMessage.textContent = "どんぐり踏んじゃった";
    gameInAction = false;
  }
  function firstStep(e) {
    plowMode();
    doms.showSettingsCheck.checked = false;
    if (tiles.find(tile => tile.value == null) != null) {
      e.srcElement.className = "hidden";
      let random = Math.floor(Math.random() * tiles.length);
      if (tiles[random].value == null) {
        tiles[random].click();
      } else {
        firstStep(e);
      }
    } else {
      doms.helperBtnMessage.textContent = "ごめんなさい。どんぐりが多すぎて、お力になれません。";
    }
  }
  function changeClickMode(e) {
    if (e.key == "z") {
      plowMode();
    } else if (e.key == "x") {
      acornMode();
    }
  }
  function plowMode() {
    isAcornMode = false;
    doms.plowBtn.className = "plow-btn game-btn-on";
    doms.acornBtn.className = "acorn-btn game-btn-off";
  }
  function acornMode() {
    isAcornMode = true;
    doms.plowBtn.className = "plow-btn game-btn-off";
    doms.acornBtn.className = "acorn-btn game-btn-on";
  }

  function getShowContentsIds() {
    return [
      "top-btn-wrapper",
      "inputs-wrapper",
      "difficulty-btns-wrapper",
      "select-boxes-wrapper",
      "game-btn-wrapper",
      "game-info-wrapper",
      "clear-image"
    ];
  }
  function getConfig() {
    return {
      difficulty: {
        easy: {
          name: "EASY",
          select1: 9,
          select2: 10,
          difficultyValue: 0.123
        },
        medium: {
          name: "MEDIUM",
          select1: 16,
          select2: 40,
          difficultyValue: 0.15625
        },
        hard: {
          name: "HARD",
          select1: 22,
          select2: 99,
          difficultyValue: 0.2045
        },
      },
    }
  };
  function getDoms() {
    return {
      select1: document.getElementById("select1"),
      select2: document.getElementById("select2"),
      helperBtn: document.getElementById("helper-btn"),
      difficulty1: document.getElementById("difficulty1"),
      difficulty2: document.getElementById("difficulty2"),
      difficulty3: document.getElementById("difficulty3"),
      select1Message: document.getElementById("select1-message"),
      select2Message: document.getElementById("select2-message"),
      gameBtnText1: document.getElementById("game-btn-text1"),
      gameBtnText2: document.getElementById("game-btn-text2"),
      inputInfo: document.getElementById("input-info"),
      timer: document.getElementById("timer"),
      helperBtnMessage: document.getElementById("helper-btn-message"),
      clearMessage: document.getElementById("clear-message"),
      clearImage: document.getElementById("clear-image"),
      info1: document.getElementById("info1"),
      board: document.getElementById("board"),
      showSettingsCheck: document.getElementById("show-settings-check"),
      plowBtn: document.getElementById("game-btn1"),
      acornBtn: document.getElementById("game-btn2"),
      restartBtn: document.getElementById("restart-game"),
    };
  };
});

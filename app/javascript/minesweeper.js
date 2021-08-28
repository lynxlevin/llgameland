import { showContents } from "./utils/displayStyles.js";
import { startTimer } from "./utils/timer.js";
import { checkPath } from "./utils/checkPath.js";
import { getElementsByIds } from "./utils/getElementsByIds.js";

window.addEventListener("load", () => {
  if (!checkPath("/games/minesweeper")) {
    return null;
  }
  "use strict";
  const config = {
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
  // ボタン系統
  const [
    select1,
    select2,
    plowBtn,
    acornBtn,
    restartBtn,
    helperBtn,
    difficulty1,
    difficulty2,
    difficulty3,
  ] = getElementsByIds([
    "select1",
    "select2",
    "game-btn1",
    "game-btn2",
    "restart-game",
    "helper-btn",
    "difficulty1",
    "difficulty2",
    "difficulty3",
  ]);
  // 表示テキストを変える系統
  const [
    select1Message,
    select2Message,
    gameBtnText1,
    gameBtnText2,
    inputInfo,
    timer,
    helperBtnMessage,
    clearMessage,
    clearImage,
    info1,
  ] = getElementsByIds([
    "select1-message",
    "select2-message",
    "game-btn-text1",
    "game-btn-text2",
    "input-info",
    "timer",
    "helper-btn-message",
    "clear-message",
    "clear-image",
    "info1",
  ]);
  // その他
  const [
    board,
    showSettingsCheck,
  ] = getElementsByIds([
    "board",
    "show-settings-check",
  ]);

  showContents(getShowContentsIds());
  let tiles = [];
  let isAcornMode = false;
  let gameTimer, isFirstClick, gameInAction, remainingAcorns, difficultyName, difficultyValue;
  initializeGame();
  restartGame();
  restartBtn.onclick = restartGame;

  function initializeGame() {
    initializeViews();
    activateEventListeners();
    changeDifficulty(config.difficulty.easy);

    function initializeViews() {
      helperBtn.textContent = "はじめの第一歩"
      select1Message.textContent = "※1辺のマスの数";
      select2Message.textContent = "※どんぐりの数";
      gameBtnText1.innerHTML = "<span>Z：</span>畑を耕す";
      gameBtnText2.innerHTML = "<span>X：</span>印をつける";
      plowBtn.className = "plow-btn game-btn-on";
      acornBtn.className = "acorn-btn game-btn-off";
    }
    function activateEventListeners() {
      helperBtn.onclick = firstStep;
      difficulty1.addEventListener("click", () => {
        changeDifficulty(config.difficulty.easy);
        restartGame();
      });
      difficulty2.addEventListener("click", () => {
        changeDifficulty(config.difficulty.medium);
        restartGame();
      });
      difficulty3.addEventListener("click", () => {
        changeDifficulty(config.difficulty.hard);
        restartGame();
      });
      plowBtn.onclick = plowMode;
      acornBtn.onclick = acornMode;
      document.addEventListener("keydown", changeClickMode);
      select1.addEventListener("input", () => {
        inputInfo.textContent = `どんぐり${Math.floor(select1.value * select1.value * difficultyValue)}個で難易度${difficultyName}`
      });
    }
    function changeDifficulty(diff) {
      difficultyName = diff.name;
      select1.value = diff.select1;
      select2.value = diff.select2;
      difficultyValue = diff.difficultyValue;
      inputInfo.textContent = ""
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
      timer.textContent = `00:00:00`;
      showSettingsCheck.checked = false;
      helperBtn.className = "";
      helperBtnMessage.textContent = "";
      remainingAcorns = select2.value;
      changeRemainingAcorns();
      clearMessage.textContent = "";
      clearImage.className = "hidden squirrel-happy";
    }
    function resetBoard() {
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
    function buryAcorns() {
      const tileIndexes = [];
      for (let i = 0; i < Number(select1.value) * Number(select1.value); i++) { //リファクタ 二乗の書き換え
        tileIndexes.push(i);
      }
      for (let i = 0; i < select2.value; i++) {
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
      clicked.style.fontSize = `${35 / Number(select1.value)}vmin`;
      judge();
    } else if (clicked.value == null) {
      clicked.className = "tile-open";
      clicked.style.fontSize = `${35 / Number(select1.value)}vmin`;
      clickBlank(clicked);
    }
  }
  function clickBlank(clicked) {
    const i = clicked.index;
    const array = [];
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
    info1.textContent = `残りのどんぐりの数 ${remainingAcorns}`;
  }
  function judge() {
    const closedTiles = document.getElementsByClassName("tile-closed");
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
    plowMode();
    showSettingsCheck.checked = false;
    if (tiles.find(tile => tile.value == null) != null) {
      e.srcElement.className = "hidden";
      let random = Math.floor(Math.random() * tiles.length);
      if (tiles[random].value == null) {
        tiles[random].click();
      } else {
        firstStep(e);
      }
    } else {
      helperBtnMessage.textContent = "ごめんなさい。どんぐりが多すぎて、お力になれません。";
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
    plowBtn.className = "plow-btn game-btn-on";
    acornBtn.className = "acorn-btn game-btn-off";
  }
  function acornMode() {
    isAcornMode = true;
    plowBtn.className = "plow-btn game-btn-off";
    acornBtn.className = "acorn-btn game-btn-on";
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
});

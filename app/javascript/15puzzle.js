window.addEventListener("load", () => {
    if (!checkPath()) {
      return null;
    }
    "use strict";
    let tiles = [];
    let board = document.getElementById("board");
    for (let i = 0 ; i < 4 ; i++) {
      let tr = document.createElement("tr");
      for (let j = 0 ; j < 4 ; j++) {
        let index = i * 4 + j
        let td = document.createElement("td");
        td.className = "tile";
        td.index = index;
        td.id = "tile" + (index + 1);
        td.textContent = index == 15 ? "" : (index + 1);
        td.onclick = click;
        tr.appendChild(td);
        tiles.push(td)
      }
      board.appendChild(tr);
    }
    for (let i = 0 ; i < 1000 ; i++) {
      click({ srcElement: {index: Math.floor(Math.random() * 16)}})
    }
    document.getElementById("info").textContent = "";
    
  function click(e) {
    let clicked = e.srcElement.index;
    let blank = document.getElementById("tile16").index;
    let distance = blank - clicked;
    if (Math.floor(clicked / 4) == Math.floor(blank / 4)) {// clickedとblankが同じ行なら
      for (let k = 0 ; k < Math.abs(distance) ; k++) {
        swap(blank, blank - Math.sign(distance));
        blank = document.getElementById("tile16").index;
      }
      judge();
    } else if (clicked % 4 == blank % 4) {
      for (let k = 0 ; k < Math.abs(distance) / 4 ; k++) {// clickedとblankが同じ列なら
        swap(blank, blank - Math.sign(distance) * 4);
        blank = document.getElementById("tile16").index;
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
          (tile.textContent == "" && tile.index == 15)) {
        goal = goal;
      } else {
        goal = goal + 1;
      }
    })
    if (goal == 0) {
      document.getElementById("info").textContent = " You've DONE IT!!";
    }
  }
})
function checkPath() {
  const path = location.pathname;
  if (path === "/games/15puzzle") {return true};
}
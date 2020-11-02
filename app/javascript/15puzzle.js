window.addEventListener("load", () => {
    if (!checkPath()) {
      return null;
    }
    const gameRestart = document.getElementById("restart-game");
    gameRestart.textContent = "START";
    document.getElementById("input-message").textContent = "※マス目の数を指定（○×○マス）"
    document.getElementById("input").value = 4
    gameRestart.addEventListener("click", () => {
      let board = document.getElementById("board");
      board.innerHTML = "";
      let input = Number(document.getElementById("input").value);
      "use strict";
      let tiles = [];
      for (let i = 0 ; i < input ; i++) {
        let tr = document.createElement("tr");
        for (let j = 0 ; j < input ; j++) {
          let index = i * input + j
          let td = document.createElement("td");
          td.className = "tile";
          td.index = index;
          td.style.height = `${73 / input}vmin`;
          td.style.width = `${73 / input}vmin`;
          td.style.fontSize = `${240 / input}px`;
          td.id = "tile" + (index + 1);
          td.textContent = index == (input * input - 1) ? "" : (index + 1);
          td.onclick = click;
          tr.appendChild(td);
          tiles.push(td)
        }
        board.appendChild(tr);
      }
      for (let i = 0 ; i < 1000 + (input * input * input) ; i++) {
        click({ srcElement: {index: Math.floor(Math.random() * (input * input))}})
      }
      document.getElementById("info").textContent = "";
        function click(e) {
          let clicked = e.srcElement.index;
          let blank = document.getElementById(`tile${input * input}`).index;
          let distance = blank - clicked;
          if (Math.floor(clicked / input) == Math.floor(blank / input)) {// clickedとblankが同じ行なら
            for (let k = 0 ; k < Math.abs(distance) ; k++) {
              swap(blank, blank - Math.sign(distance));
              blank = document.getElementById(`tile${input * input}`).index;
            }
            judge();
          } else if (clicked % input == blank % input) {
            for (let k = 0 ; k < Math.abs(distance) / input ; k++) {// clickedとblankが同じ列なら
              swap(blank, blank - Math.sign(distance) * input);
              blank = document.getElementById(`tile${input * input}`).index;
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
                (tile.textContent == "" && tile.index == (input * input - 1))) {
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
    });
    
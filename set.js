/*
 *Nathan Tran
 *set.js
 *This java script file implements the functions for the game set. It includes a timer,
 *creating a board, and interacting with the board
 */

"use strict";

(function() {
  // Required module globals
  const SPM = 60; // seconds per minute
  const BOARD_SIZE = 12;
  const SECOND = 1000;
  let timerId;
  let remainingSeconds;

  const STYLES = ["solid", "outline", "striped"];
  const SHAPES = ["diamond", "oval", "squiggle"];
  const COLORS = ["green", "purple", "red"];
  const COUNTS = ["1", "2", "3"];

  window.addEventListener("load", init);

  /**
   * this function takes no parementers or returns. It creates event listeners to make the site
   * intereactive
   */
  function init() {
    id("start-btn").addEventListener("click", startGame);
    id("back-btn").addEventListener("click", toggleViews);
    id("refresh-btn").addEventListener("click", makeBoard);
  }

  /**
   * This function has no parameters or returns. It starts the game, toggling a new screen
   * creating a board, and starting a timer.
   */
  function startGame() {
    toggleViews();
    makeBoard();
    startTimer();
    id("refresh-btn").disabled = false;
    id("set-count").textContent = "0";
  }

  /**
   * This function has no parameters or returns. It creates a board with cards, visually seen on
   * on the page
   */
  function makeBoard() {
    const board = id("board");
    board.innerHTML = "";
    const isEasy = qs("input[name='diff']:checked").value === "easy";
    for (let i = 0; i < BOARD_SIZE; i++) {
      board.appendChild(generateUniqueCard(isEasy));
    }
  }

  /**
   * This function has no parameters or returns. It changes between the menu page and the game
   */
  function toggleViews() {
    id("menu-view").classList.toggle("hidden");
    id("game-view").classList.toggle("hidden");
  }

  /**
   * This funtion creates an array of random attributes of shape, style, color, and count
   * @param {boolean} isEasy is a boolean determining the difficulty mode
   * @returns {String[]} an array representing the [style, shape, color, count]
   */
  function generateRandomAttributes(isEasy) {
    let style = "solid";
    if (!isEasy) {
      style = STYLES[Math.floor(Math.random() * STYLES.length)];
    }
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const count = COUNTS[Math.floor(Math.random() * COUNTS.length)];
    return [style, shape, color, count];
  }

  /**
   * this generates a unique card in respect to the rest of the game board
   * @param {*} isEasy is a boolean determining the difficulty mode
   * @returns {HTMLElement} a html element being the card itself
   */
  function generateUniqueCard(isEasy) {
    let attribute = generateRandomAttributes(isEasy);
    let [style, shape, color, count] = attribute;
    let name = style + "-" + shape + "-" + color;
    let id = name + "-" + count;

    while (qs(`#board #${id}`)) {
      attribute = generateRandomAttributes(isEasy);
      [style, shape, color, count] = attribute;
      name = style + "-" + shape + "-" + color;
      id = name + "-" + count;
    }

    const parent = document.createElement("div");
    parent.classList.add("card");
    parent.id = id;
    for (let i = 0; i < parseInt(count); i++) {
      const img = document.createElement("img");
      img.src = "img/" + name + ".png";
      img.alt = id;
      parent.appendChild(img);
    }

    parent.addEventListener("click", cardSelected);

    return parent;
  }

  /**
   * This function has no parementers or returns. It starts the game timer
   * based off of how much time the user sets it to be.
   */
  function startTimer() {
    const value = parseInt(qs("#menu-view select").value);
    remainingSeconds = value;
    const minutes = Math.floor(value / SPM).toString()
      .padStart(2, "0");
    id("time").textContent = minutes + ":00";
    timerId = setInterval(advanceTimer, SECOND);
  }

  /**
   * The timer will count down to 0 and once hit, it will end the game. The count down will be
   * visually seen on the page.
   */
  function advanceTimer() {
    remainingSeconds--;

    const minutes = Math.floor(remainingSeconds / SPM).toString()
      .padStart(2, "0");
    const seconds = (remainingSeconds % SPM).toString()
      .padStart(2, "0");
    id("time").textContent = minutes + ":" + seconds;

    if (remainingSeconds === 0) {
      clearInterval(timerId);
      timerId = null;
      endGame();
    }

  }

  /**
   * The game will end and all buttons will be teporaraly disabled except for the return to menu
   * to reset the game
   */
  function endGame() {
    const cards = qsa(".card");
    for (let i = 0; i < cards.length; i++) {
      cards[i].removeEventListener("click", cardSelected);
      cards[i].classList.remove("selected");
    }

    id("refresh-btn").disabled = true;
  }

  /**
   * selects a card and visually shows it. Once 3 cards are selected, it will determine if there
   * is a set or not and respond accordingly. If there is a set, those cards will be replaced
   * with new unique cards
   */
  function cardSelected() {
    this.classList.toggle("selected");
    const cards = qsa(".selected");

    if (cards.length === 3) {
      setSelected(cards);
    }
  }

  /**
   * It will show if the set is actually a set or not and if it is a set, it will replace the cards
   * with new values and increment the nunmber of sets.
   * @param {*} set this is an array of cards which is the possible set
   */
  function setSelected(set) {
    let isSet = isASet(set);
    const message = isSet ? "SET!" : "Not a Set";
    if (isSet) {
      let count = parseInt(id("set-count").textContent);
      id("set-count").textContent = count + 1;
    }
    for (let i = 0; i < set.length; i++) {
      const pTag = document.createElement("p");
      pTag.textContent = message;
      set[i].classList.remove("selected");

      if (isSet) {
        const isEasy = qs("input[name='diff']:checked").value === "easy";
        const card = generateUniqueCard(isEasy);
        set[i].id = card.id;
        set[i].innerHTML = card.innerHTML;
      }

      set[i].classList.add("hide-imgs");
      set[i].appendChild(pTag);
    }

    setTimeout(() => {
      for (let i = 0; i < set.length; i++) {
        set[i].classList.remove("hide-imgs");
        set[i].querySelector("p").remove();
      }
    }, SECOND);
  }

  /**
   * Checks to see if the three selected cards make up a valid set. This is done by comparing each
   * of the type of attribute against the other two cards. If each four attributes for each card are
   * either all the same or all different, then the cards make a set. If not, they do not make a set
   * @param {DOMList} selected - list of all selected cards to check if a set.
   * @return {boolean} true if valid set false otherwise.
   */
  function isASet(selected) {
    let attributes = [];
    for (let i = 0; i < selected.length; i++) {
      attributes.push(selected[i].id.split("-"));
    }
    for (let i = 0; i < attributes[0].length; i++) {
      let diff = attributes[0][i] !== attributes[1][i] &&
                attributes[1][i] !== attributes[2][i] &&
                attributes[0][i] !== attributes[2][i];
      let same = attributes[0][i] === attributes[1][i] &&
                    attributes[1][i] === attributes[2][i];
      if (!(same || diff)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

})();

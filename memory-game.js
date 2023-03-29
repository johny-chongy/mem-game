"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const palette = [
  "red", "blue", "green", "orange", "purple", "yellow", "black", "gold", "gray", "navy"];



function randNum (min, max) {
  return Math.random() * (max-min) + min;
}

var COLORS = [];

var start = document.getElementById('start');
start.addEventListener("click", createCards);
var bestScore = localStorage.getItem('bestScore') || 0;
var score = document.getElementById('score');
score.innerText = bestScore;


/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */
var clockId;
var numColors;

function createCards() {
  var shuffledPalette = shuffle(palette);
  COLORS = [];
  numColors = randNum(2, shuffledPalette.length);
  for (var i=0; i<numColors; i++) {
    COLORS.push(shuffledPalette[i]);
    COLORS.push(shuffledPalette[i]);
  }
  clearInterval(clockId);
  const gameBoard = document.getElementById("game");
  seconds_elapsed = 0;
  seconds.innerText = '00';
  minutes.innerText = '00';
  while (gameBoard.lastElementChild) {
    gameBoard.removeChild(gameBoard.lastElementChild);
  }
  const colors = shuffle(COLORS);
  for (let color of colors) {
    var new_card = document.createElement("div");
    new_card.classList.add(color);
    new_card.classList.add('front');
    new_card.addEventListener("click", handleCardClick);
    gameBoard.appendChild(new_card);
  }
  clockId = setInterval(timer, 1000);
}

/** Flip a card face-up. */

function flipCard(card) {
  card.setAttribute('id', 'flip');
  checker.push(card);
  card.style.backgroundColor = card.classList[0];
}

/** Flip a card face-down. */

function unFlipCard() {
  for (var listee of checker) {
    listee.setAttribute('id', 'unflipped')
    listee.style.backgroundColor = 'whitesmoke';
  }
  checker = [];
}

/** Handle clicking on a card: this could be first-card or second-card. */
var checker = [];

function handleCardClick(evt) {
  if (checker.length === 0) {
    if (evt.target.getAttribute('id') !== 'flip') {
      flipCard(evt.target);
    }
  } else if (checker.length === 1 && evt.target.getAttribute('id') !== 'flip') {
    flipCard(evt.target);
    if (!same(checker)) {
      setTimeout(unFlipCard, 1000);
    } else {
      if (document.querySelectorAll('#flip').length === COLORS.length) {
         clearInterval(clockId);
         if (bestScore === 0) {
          localStorage.setItem('bestScore', seconds_elapsed);
          bestScore = seconds_elapsed;
         } else if (seconds_elapsed < bestScore) {
          localStorage.setItem('bestScore', seconds_elapsed);
          bestScore = seconds_elapsed;
          score.innerText = seconds_elapsed;
          alert("Wow a new record! Congrats!");
         }
      }
      checker = [];
    }
  }
}



function same(list) {
  return list[0].classList[0] === list[1].classList[0];
}


var minutes = document.getElementById('minutes');
var seconds = document.getElementById('seconds');
var seconds_elapsed = 0;

function timer() {
  seconds_elapsed++;
  seconds.innerText = format(seconds_elapsed % 60);
  minutes.innerText = format(parseInt(seconds_elapsed / 60));
}

function format(time) {
  var stringer = time + "";
  if (stringer.length < 2) {
    return "0" + stringer;
  } else {
    return stringer;
  }
}
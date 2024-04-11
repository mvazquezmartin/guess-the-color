import { heart8bit } from './assets/heart8bit.js';

const $red = document.querySelector('.color-r');
const $green = document.querySelector('.color-g');
const $blue = document.querySelector('.color-b');
const $redValueSpan = document.querySelector('.red-value');
const $greenValueSpan = document.querySelector('.green-value');
const $blueValueSpan = document.querySelector('.blue-value');
const $buttonReset = document.querySelector('.button-reset');
const $buttonGuess = document.querySelector('.button-guess');
const $attemps = document.querySelector('.attemps');
const $hearts = document.querySelector('.hearts');
const $percentaje = document.querySelector('.percentage');
const $pyro = document.querySelector('#pyro');
const $pyroBefore = document.querySelector('#before');
const $pyroAfter = document.querySelector('#after');
const $incrementR = document.querySelector('#increment-button-r');
const $decrementR = document.querySelector('#decrement-button-r');
const $incrementG = document.querySelector('#increment-button-g');
const $decrementG = document.querySelector('#decrement-button-g');
const $incrementB = document.querySelector('#increment-button-b');
const $decrementB = document.querySelector('#decrement-button-b');

const clickAudio = new Audio('./assets/click-1.wav');
const ATTEMPS = 7;
let attempt = ATTEMPS;

function eventListenerColor(
  color,
  colorSpan = 0,
  property,
  increment,
  decrement
) {
  color.addEventListener('input', () => {
    const colorValue = color.value;
    colorSpan.textContent = colorValue;
    clickAudio.currentTime = 0;
    clickAudio.play();
    document.documentElement.style.setProperty(property, colorValue);
  });

  increment.addEventListener('click', () => {
    clickAudio.currentTime = 0;
    clickAudio.play();
    if (color.value < 255) {
      color.value++;
      colorSpan.textContent++;
    }
  });

  decrement.addEventListener('click', () => {
    clickAudio.currentTime = 0;
    clickAudio.play();
    if (color.value > 0) {
      color.value--;
      colorSpan.textContent--;
    }
  });
}

function randomNumber() {
  return Math.floor(Math.random() * 255);
}

function colorMaker() {
  const color = `rgb(${randomNumber()}, ${randomNumber()}, ${randomNumber()})`;
  document.documentElement.style.setProperty('--guess-color', color);
}

function createHearts() {
  for (let i = 0; i < ATTEMPS; i++) {
    const heart = document.createElement('div');
    heart.innerHTML = heart8bit;
    $hearts.appendChild(heart);
  }
}

eventListenerColor($red, $redValueSpan, '--red', $incrementR, $decrementR);
eventListenerColor(
  $green,
  $greenValueSpan,
  '--green',
  $incrementG,
  $decrementG
);
eventListenerColor($blue, $blueValueSpan, '--blue', $incrementB, $decrementB);

function init() {
  $pyro.classList.remove('pyro');
  $pyroBefore.classList.remove('before');
  $pyroAfter.classList.remove('after');
  $attemps.style.fontSize = '1.3rem';
  $attemps.textContent = 'ATTEMPS';
  $attemps.style.color = '#e1e1e1';
  $hearts.innerHTML = '';
  createHearts();
  $percentaje.textContent = "You're  000% away from the correct color.";
  $percentaje.style.color = '#ffffff';
  $percentaje.style.visibility = 'hidden';
  colorMaker();
}

$buttonReset.addEventListener('click', () => {
  attempt = ATTEMPS;
  $buttonGuess.disabled = false;
  $percentaje.textContent = '';
  $red.value = 0;
  $green.value = 0;
  $blue.value = 0;
  $red.dispatchEvent(new Event('input'));
  $green.dispatchEvent(new Event('input'));
  $blue.dispatchEvent(new Event('input'));
  init();
});

$buttonGuess.addEventListener('click', () => {
  const redValue = parseInt($red.value);
  const greenValue = parseInt($green.value);
  const blueValue = parseInt($blue.value);

  clickAudio.currentTime = 0;
  clickAudio.play();

  const hearts = document.querySelectorAll('.hearts svg');

  const guessColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue('--guess-color');

  const [r, g, b] = guessColor.match(/\d+/g).map(Number);

  let distance = Math.sqrt(
    Math.pow(redValue - r, 2) +
      Math.pow(greenValue - g, 2) +
      Math.pow(blueValue - b, 2)
  );

  if (redValue === r && greenValue === g && blueValue === b) {
    $percentaje.style.visibility = 'visible';
    $percentaje.textContent = 'CONGRATULATIONS! You guessed the color.';
    $percentaje.style.color = '#F7D51D';
    $buttonGuess.disabled = true;
    $pyro.classList.add('pyro');
    $pyroBefore.classList.add('before');
    $pyroAfter.classList.add('after');
  } else {
    attempt--;
    if (attempt === 0) {
      $attemps.textContent = 'GAME OVER';
      $attemps.style.color = '#E72929';
      $attemps.style.fontSize = '2rem';
      hearts[0].style.fill = '#CCC';
      $buttonGuess.disabled = true;
      $percentaje.style.color = '#F7D51D';
      $percentaje.textContent = guessColor;
    } else {
      const maxDistance = Math.sqrt(
        Math.pow(255, 2) + Math.pow(255, 2) + Math.pow(255, 2)
      );
      let percentage = ((maxDistance - distance) / maxDistance) * 100;
      $percentaje.style.visibility = 'visible';
      $percentaje.textContent = `You're  ${percentage.toFixed(
        2
      )}% away from the correct color.`;
      for (let i = 0; i < hearts.length; i++) {
        if (i < attempt) {
          hearts[i].style.fill = '#FF0000';
        } else {
          hearts[i].style.fill = '#CCC';
        }
      }
    }
  }
});

init();

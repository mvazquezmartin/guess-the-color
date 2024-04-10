import { heart8bit } from './heart8bit.js';

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

const clickAudio = new Audio('./click-1.wav');
const ATTEMPS = 5;
let attempt = ATTEMPS;

function eventListenerColor(color, colorSpan, property) {
  color.addEventListener('input', () => {
    const colorValue = color.value;
    colorSpan.textContent = colorValue;
    clickAudio.currentTime = 0;
    clickAudio.play();
    document.documentElement.style.setProperty(property, colorValue);
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

eventListenerColor($red, $redValueSpan, '--red');
eventListenerColor($green, $greenValueSpan, '--green');
eventListenerColor($blue, $blueValueSpan, '--blue');

function init() {
  $pyro.classList.remove('pyro');
  $pyroBefore.classList.remove('before');
  $pyroAfter.classList.remove('after');
  $attemps.style.fontSize = '1.3rem';
  $attemps.textContent = 'ATTEMPS';
  $attemps.style.color = '#e1e1e1';
  $hearts.innerHTML = '';
  createHearts();
  $percentaje.textContent = "You're  100% away from the correct color.";
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
  eventListenerColor($red, '--red');
  eventListenerColor($green, '--green');
  eventListenerColor($blue, '--blue');
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
    $percentaje.textContent = 'Congratulations! You guessed the color.';
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

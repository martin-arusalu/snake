var stage;
var treat;
var points
var width = 10;
var tail = [];
var dir;
window.addEventListener('load', init);
window.onkeydown = checkKey;

function checkKey(e) {
  switch (e.keyCode) {
    case 37:
      dir = 'left';
      break;
    case 38:
      dir = 'up';
      break;
    case 39:
      dir = 'right';
      break;
    case 40:
      dir = 'down';
      break;
  }
}

function init() {
  stage = new createjs.Stage('myCanvas');
  createjs.Ticker.addEventListener('tick', onTick);
  createStart();
}

function createStart() {
  createjs.Ticker.setFPS(20);
  var sqr = new createjs.Shape();
  sqr.graphics.beginFill('#09f');
  sqr.graphics.drawRect(0, 0, width, width);
  sqr.x = 0;
  sqr.y = 0;
  sqr.dir = 'right';
  tail.push(sqr);
  stage.addChild(sqr);

  treat = new createjs.Shape();
  treat.graphics.beginFill('#f00');
  treat.graphics.drawRect(0, 0, width, width);
  newTreat();
  stage.addChild(treat);
  points = 0;
  document.getElementById('points').innerText = 'Points: ' + points;
}

function newTreat() {
  treat.x = Math.floor(Math.random() * stage.canvas.width * width) / width - width;
  treat.y = Math.floor(Math.random() * stage.canvas.width * width) / width - width;
}

function onTick(e) {
  if (tail.length > 0) moveTail();
  tail.forEach(function (e, i) {
    if (i > 0 && checkIntersection(tail[0], e)) reset(); 
  });
  if (checkIntersection(tail[0], treat)) {
    createjs.Ticker.setFPS(20 + points/5);
    addToTail();
    newTreat();
    points++;
    document.getElementById('points').innerText = 'Points: ' + points;
  }
  stage.update(e);
}

function reset() {
  alert('You are dead!');
  stage.removeAllChildren();
  tail = [];
  createStart();
}

function moveElem(e) {
  switch (e.dir) {
    case 'left':
      e.x > 0 ? e.x-=width : e.x = stage.canvas.width - width;
      break;
    case 'up':
      e.y > 0 ? e.y-=width : e.y = stage.canvas.height - width;
      break;
    case 'right':
      e.x < (stage.canvas.width - width) ? e.x += width : e.x = 0;
      break;
    case 'down':
      e.y < (stage.canvas.width - width) ? e.y += width : e.y = 0;
      break;
  }
}

function moveTail() {
  tail.reverse().forEach(function (e, i) {
    if (i == tail.length - 1) e.dir = dir;
    else e.dir = tail[i + 1].dir;
    moveElem(e);
  });
  tail.reverse();
}

function addToTail() {
  tailElement = new createjs.Shape();
  tailElement.graphics.beginFill('#fff');
  tailElement.graphics.drawRect(0, 0, width, width);
  lastElem = tail[tail.length - 1];
  tailElement.dir = lastElem.dir;
  switch (lastElem.dir) {
    case 'left':
      tailElement.x = lastElem.x + width;
      tailElement.y = lastElem.y;
      break;
    case 'up':
      tailElement.x = lastElem.x;
      tailElement.y = lastElem.y + width;
      break;
    case 'right':
      tailElement.x = lastElem.x - width;
      tailElement.y = lastElem.y;
      break;
    case 'down':
      tailElement.x = lastElem.x;
      tailElement.y = lastElem.y - width;
      break;
  }
  tail.push(tailElement);
  stage.addChild(tailElement);
}

//http://stackoverflow.com/a/20353486
function checkIntersection(rect1,rect2) {
    if ( rect1.x >= rect2.x + width || rect1.x + width <= rect2.x || rect1.y >= rect2.y + width || rect1.y + width <= rect2.y ) return false;
    return true;
}
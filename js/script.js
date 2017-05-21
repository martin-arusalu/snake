var game = function () {
  var stage, treat, points, width = 10, snake = [], dir, queue, loading, dead;

  // When key is pressed
  window.onkeydown = checkKey;

  // Start  
  init();

  function checkKey(e) {
    // Check which arrow
    switch (e.keyCode) {
      case 32: reset(); break;
      case 37: dir = 'left'; break;
      case 38: dir = 'up'; break;
      case 39: dir = 'right'; break;
      case 40: dir = 'down'; break;
    }
  }

  function init() {
    // Set Stage
    stage = new createjs.Stage('myCanvas');
    loading = new createjs.Text("Loading", "30px Helvetica", "#fff");
    loading.textBaseline = "middle";
    loading.textAlign = "center";
    loading.x = stage.canvas.width / 2;
    loading.y = stage.canvas.height / 2;
    stage.addChild(loading);

    // Preload
    queue = new createjs.LoadQueue(true);
    queue.installPlugin(createjs.Sound);
    queue.on("progress", progress);
    queue.on('complete', createStart);
    queue.loadManifest([
      { id: "treat", src: "sound/treat.mp3" },
      { id: "dead", src: "sound/dead.mp3" }
    ]);
  }

  function progress(e) {
    var percent = Math.round(e.progress * 100);
    loading.text = "Loading: " + percent + "%";
    stage.update()
  }

  function createStart() {
    stage.removeChild(dead);
    stage.removeChild(loading);
    createjs.Ticker.addEventListener('tick', onTick);
    createjs.Ticker.setFPS(30);

    // Head of snake
    var head = new createjs.Shape();
    head.graphics.beginFill('#09f');
    head.graphics.drawRect(0, 0, width, width);
  
    // To the top left corner
    head.x = 0;
    head.y = 0;

    // Initially start moving to the right
    dir = 'right';

    // Give the snake a head
    snake.push(head);

    // Show it on stage
    stage.addChild(head);

    // Create the treat object
    treat = new createjs.Shape();
    treat.graphics.beginFill('#f00');
    treat.graphics.drawRect(0, 0, width, width);

    // Locate it
    newTreat();

    // Add treat to stage
    stage.addChild(treat);

    // Initalize points
    points = 0;

    // Show points
    document.getElementById('points').innerText = 'Points: ' + points;
  }

  function newTreat() {
    // Change the location of the treat
    treat.x = Math.floor(Math.random() * (stage.canvas.width - width) * width) / width;
    treat.y = Math.floor(Math.random() * (stage.canvas.height - width) * width) / width;
  }

  function onTick(e) {
    if (!e.paused) {
      // move snake
      if (snake.length > 0) moveSnake();

      // Check if eating itself
      snake.forEach((e, i) => { if (i > 0 && checkIntersection(snake[0], e)) end(); });

      // Check if eating a treat
      if (checkIntersection(snake[0], treat)) {

        // Grow
        createjs.Sound.play("treat");
        addToSnake();

        // New Treat
        newTreat();

        // Add one point
        points++;

        // Refresh the point counter
        document.getElementById('points').innerText = 'Points: ' + points;
      }
      stage.update(e);
    }
  }

  function end() {
    stage.removeAllChildren();
    createjs.Ticker.paused = true;
    createjs.Sound.play("dead");
    dead = new createjs.Text("You are dead. press spacebar to start a new game", "20px Helvetica", "#fff");
    dead.textBaseline = "middle";
    dead.textAlign = "center";
    dead.x = stage.canvas.width / 2;
    dead.y = stage.canvas.height / 2;
    stage.addChild(dead);
  }

  function reset() {
    stage.removeAllChildren();
    snake = [];
    createjs.Ticker.paused = false;
    // New game
    createStart();
  }

  function moveElem(e) {
    // Which direction to move to
    switch (e.dir) {
      case 'left': // If moving to the left
        // if not on the left edge then go a width unit to the left, otherwise come out from the right edge.
        e.x > 0 ? e.x -= width : e.x = stage.canvas.width - width;
        break;
      case 'up': // If moving up
        // if possible, go a width unit up, otherwise come out from the bottom edge.
        e.y > 0 ? e.y -= width : e.y = stage.canvas.height - width;
        break;
      case 'right': // If moving to the right
        // If not on the right edge, move a width unit to the right, otherwise come out from the left edge.
        e.x < (stage.canvas.width - width) ? e.x += width : e.x = 0;
        break;
      case 'down': // If moving down
        // If not on the bottom edge, move a width unit down, otherwise come out from the top edge.
        e.y < (stage.canvas.width - width) ? e.y += width : e.y = 0;
        break;
    }
  }

  function moveSnake() {
    // Start moving the snake from the end
    snake.reverse().forEach((e, i) => {
    
      // Head moves to the global direction
      if (i == snake.length - 1) {
        e.dir = dir;
      }

      // The last piece of tail gets the moving direction of the second to last piece etc.
      else e.dir = snake[i + 1].dir;

      // Move that tail piece to new direction.
      moveElem(e);
    });

    // Turn the snake back so the head is first again.
    snake.reverse();
  }

  function addToSnake() {
    // Create new tail part
    tailElement = new createjs.Shape();
    tailElement.graphics.beginFill('#fff');
    tailElement.graphics.drawRect(0, 0, width, width);

    // Get the current last part
    lastElem = snake[snake.length - 1];

    // Make the new part move to the same direction as the last part.
    tailElement.dir = lastElem.dir;
  
    // Check where the last part element is going.
    switch (lastElem.dir) {
      case 'left':
        // If going to the left, add tail element to the right of the last part.  
        tailElement.x = lastElem.x + width;
        tailElement.y = lastElem.y;
        break;
      case 'up':
        // If going up, add tail element to the bottom of the last part.  
        tailElement.x = lastElem.x;
        tailElement.y = lastElem.y + width;
        break;
      case 'right':
        // If going to the right, add tail element to the left of the last part.  
        tailElement.x = lastElem.x - width;
        tailElement.y = lastElem.y;
        break;
      case 'down':
        // If going down, add tail element to the top of the last part.
        tailElement.x = lastElem.x;
        tailElement.y = lastElem.y - width;
        break;
    }

    // Add to the snake
    snake.push(tailElement);

    // Add to the stage
    stage.addChild(tailElement);
  }


  //http://stackoverflow.com/a/20353486
  function checkIntersection(rect1, rect2) {
    if (rect1.x >= rect2.x + width || rect1.x + width <= rect2.x || rect1.y >= rect2.y + width || rect1.y + width <= rect2.y) return false;
    return true;
  }
}

// On load
window.addEventListener('load', game);
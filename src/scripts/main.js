window.requestAnimationFrame = (() => {
  return (
    window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function (callback, element) {
        window.setTimeout(callback, 1000 / GAME.fps);
    });
})();

class GAME {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.fps = 60;
    this.invaders = 30;
    this.objects = [];

    this.canvasSize = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.images = [
      '../img/dude.png',
      '../img/ship.png',
      '../img/laser.png',
      '../img/bg.jpg'
    ];

    this.objects = this.objects.concat(new Ship(this, this.canvasSize, this.images[1]));
    this.swarmUp(this.images[0])
    document.body.appendChild(this.canvas);
    this.resizeCanvas();
    this.handleEvents();

    var gameLoop = () => {
      const t = this;

      setTimeout(() => {
        t.update();
        t.render(t.context, t.canvasSize);
        window.requestAnimationFrame(gameLoop);
      }, 1000 / t.fps);
    }

    this.preloadImages(gameLoop);
  }

  checkCollisions(firstObject, secondObject) {
    return !(
      firstObject === secondObject ||
      firstObject.position.posX + firstObject.size.width / 2 < secondObject.position.posX - secondObject.size.width / 2 ||
      firstObject.position.posY + firstObject.size.height / 2 < secondObject.position.posY - secondObject.size.height / 2 ||
      firstObject.position.posX - firstObject.size.width / 2 > secondObject.position.posX + secondObject.size.width / 2 ||
      firstObject.position.posY - firstObject.size.height / 2 > secondObject.position.posY + secondObject.size.height / 2
    );
  };

  update() {

    if (this.beings === 0) {
      this.destroy()
      new Finish('You win!');
      return;
    }

    const survivers = (firstObject) => {
      return (this.objects.filter(
        (secondObject) => {
          return (
            this.checkCollisions(firstObject, secondObject)
          );
        }
      ).length === 0);
    };

    this.objects = this.objects.filter(survivers);

    let beings = 0;
    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].update();

      if (this.objects[i] instanceof Being) {
        beings += 1;
      }

      this.beings = beings;
    }
  }

  render(context, canvasSize) {
    context.clearRect(0, 0, canvasSize.width, canvasSize.height);
    for (let i = 0; i < this.objects.length; i++) {
      this.drawObject(
        context,
        this.objects[i],
        this.objects[i].image
      );
    }
  }

  drawObject(context, object, image) {
    context.drawImage(
      image,
      object.position.posX,
      object.position.posY,
      object.size.width,
      object.size.height
    );
  }

  toModule(number) {
    if (number < 0) {
      number = -number;
    }

    return number
  }

  lowerRow(being) {
    return this.objects.filter((haveFriends) => {
      return (
        haveFriends instanceof Being &&
        this.toModule(being.position.x - haveFriends.position.x) < haveFriends.size.width &&
        haveFriends.position.posY > being.position.posY
      );
    }).length > 0;
  }

  swarmUp(imgSrc) {
    this.swarm = [];
    this.beings = 60;

    for (let i = 0; i < this.beings; i++) {

      const
        posX = 10 + (i % 12) * 80,
        posY = 10 + (i % 5) * 60;

      this.swarm.push(
        new Being(
          this,
          {
            posX: posX,
            posY: posY
          }
        )
      );
    }

    this.objects = this.objects.concat(this.swarm);
  }

  preloadImages(callback) {
    const
      ImagesCounter = this.images.length - 1,
      t = this;

    this.images.forEach((sourse, i) => {
      let
        image = new Image(),
        body = document.querySelector('body');

      image.src = sourse;
      image.onload = () => {
        if (i === ImagesCounter) {
          body.classList.add('space');
          callback();
        }
      };
    })
  }

  resizeCanvas() {
    this.canvas.width = this.canvasSize.width - 15;
    this.canvas.height = this.canvasSize.height - 15;
  }

  windowResize() {
    this.canvasSize.width = window.innerWidth;
    this.canvasSize.height = window.innerHeight;
    this.resizeCanvas();
  }

  destroy() {
    delete window.game
  }

  handleEvents() {
    const t = this;

    window.onresize = () => {
      t.windowResize();
    };
  }
};

class Laser {
  constructor(position, velocity, imgSrc) {
    this.image = document.createElement('img');
    this.image.src = imgSrc;
    this.size = {
      width: 24,
      height: 78
    };
    this.position = position;
    this.velocity = velocity;
  }

  update() {
    this.position.posX += this.velocity.x;
    this.position.posY += this.velocity.y;
  }
}

class Ship {
  constructor(game, canvasSize, imgSrc) {
    this.game = game;
    this.image = document.createElement('img');
    this.image.src = imgSrc;
    this.size = {
      width: 73,
      height: 52
    };
    this.position = {
      posX: Math.round((canvasSize.width / 2) - (this.size.width / 2)),
      posY: Math.round(canvasSize.height - (this.size.height + 10))
    };

    this.handleEvents();
  }

  laserTime() {
    const laser = new Laser(
      {
        posX: this.position.posX,
        posY: this.position.posY - this.size.width - 10
      }, {
        x: 0,
        y: -20
      },
      this.game.images[2]
    );

    this.game.objects.push(laser);
    new Audio('../sound/spas12.mp3', false);
  }

  playerAction(keyCode) {
    if (keyCode === 37) {
      this.position.posX -= 10;
    } else if (keyCode === 39) {
      this.position.posX += 10;
    } else if (keyCode === 32) {
      this.laserTime();
    }
  }

  update() {
    // tradition vs extra condition im game update method, hmmm ...
  }

  handleEvents() {
    const t = this;

    window.onkeydown = (e) => {
      const pressedKey = e.keyCode;

      t.playerAction(pressedKey);
    }
  }
}

class Being {
  constructor(game, position) {
    this.game = game;
    this.image = document.createElement('img');
    this.image.src = this.game.images[0];
    this.position = position;
    this.directionX = 0;
    this.speedX = 2;
    this.size = {
      width: 57,
      height: 41
    };

    this.invasionItself(this);
  }

  invasionItself(being) {
    setInterval(() => {
      this.position = {
        posX: this.position.posX,
        posY: this.position.posY + 10
      }

      if (this.position.posY + this.size.height + 100 > this.game.canvasSize.height) {
        new Finish('You lose!');
      }
    }, 1000);
  }

  update() {
    if (this.directionX < 0 ||
        this.directionX > (this.game.canvasSize.width - ((this.size.width + 24) * 12))) {
        this.speedX = -this.speedX;
    }

    this.position.posX += this.speedX;
    this.directionX += this.speedX;
  }
}

class Audio {
  constructor(sound, looped) {
    this.audio = document.createElement("AUDIO");
    this.audio.src = sound;
    this.audio.loop = looped;

    let audioOttoEvent = this.audio;
    this.audio.addEventListener('canplaythrough', function() {
      audioOttoEvent.play();
    }, false);
  }

  stopPlaying() {
    if (!this.audio.loop) {
      setTimeout(() => {
        delete window.this;
      }, Math.ceil(this.audio.duration));
    }
  }
}

class Finish {
  constructor(result) {
    this.canvas = document.querySelector('canvas');

    //one day, a wonderful flag will be triggering here
    if (this.canvas) {
      document.body.removeChild(this.canvas);
    } else {
      return
    }

    this.head = document.createElement('h1');
    this.button = document.createElement('button');
    this.buttonText = document.createTextNode('Restart!');
    this.button.appendChild(this.buttonText)
    this.head.style.color = 'red';
    this.text = document.createTextNode(result);
    this.head.appendChild(this.text);
    document.body.appendChild(this.head);
    document.body.appendChild(this.button);

    this.helpers();
  }

  helpers() {
    document.querySelector('button').addEventListener('mouseup', function() {
       window.location.reload();
    }, false);
  }
}

let gameActive = () => {
  new Audio('../sound/theme.mp3', true);
  new GAME();
};

const startButton = document.querySelector('.button'),
      startScreen = document.querySelector('.start-screen');

startButton.addEventListener('mouseup', function() {
  document.body.removeChild(startScreen)
  gameActive();
}, false);

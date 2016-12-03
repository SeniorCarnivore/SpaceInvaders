window.requestAnimationFrame = (() => {
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function (callback, element) {
              window.setTimeout(callback, 1000 / GAME.fps);
          };
  })();

class GAME {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.fps = 60;
    this.bodies = [];
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
    document.body.appendChild(this.canvas);
    this.resizeCanvas();
    this.handleEvents();

    var gameLoop = () => {
      const t = this;

      setTimeout(function() {
        t.update();
        t.render(t.context, t.canvasSize);
        window.requestAnimationFrame(gameLoop);
      }, 1000 / t.fps);
    }

    this.preloadImages(gameLoop);
  }

  update() {
    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].update();
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

    this.hanbleEvents();
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

  }

  hanbleEvents() {
    const t = this;

    window.onkeydown = (e) => {
      const pressedKey = e.keyCode;

      t.playerAction(pressedKey);
    }
  }
}

(() => {
  new GAME();
})();

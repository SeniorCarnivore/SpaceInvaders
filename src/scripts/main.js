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
    this.objects = this.objects.concat(this.swarmUp(this.images[0]));
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
    const survivers = (firstObject) => {
      return (this.objects.filter(
        (secondObject) => {
          return (this.checkCollisions(firstObject, secondObject));
        }
      ).length === 0);
    };

    this.objects = this.objects.filter(survivers);
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
    let swarm = [];

    for (let i = 0; i < 60; i++) {

      const
        posX = 10 + (i % 12) * 80,
        posY = 10 + (i % 5) * 60;

      // Create invader.
      swarm.push(
        new Being(
          this,
          {
            posX: posX,
            posY: posY
          }
        )
      );
    }

    return swarm;
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
    this.speedY = 0;
    this.size = {
      width: 57,
      height: 41
    };
  }

  update() {
    if (this.directionX < 0 || this.directionX > this.game.canvasSize.width - ((this.size.width + 24) * 12)) {
      this.speedX = -this.speedX;
    }

    if (Math.random() > 0.9993 && !this.game.lowerRow(this)) {
      const laser = new Laser(
        {
          posX: this.position.posX,
          posY: this.position.posY + Math.round(this.size.width / 2)
        }, {
          x: Math.round(Math.random() - Math.random()),
          y: 5
        },
        this.game.images[2]
      );
      this.game.objects.push(laser);
    }

    this.position.posX += this.speedX;
    this.directionX += this.speedX;
  }
}

(() => {
  new GAME();
})();

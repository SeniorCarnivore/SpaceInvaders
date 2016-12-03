window.requestAnimFrame = (() => {
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
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.images = ['../img/dude.png','../img/ship.png','../img/bg.jpg'];
    this.fps = 60;
    this.invaders = 30;

    document.body.appendChild(this.canvas);
    this.resizeCanvas();
    this.handleEvents();
    this.preloadImages();
  }

  resizeCanvas() {
    this.canvas.width = this.windowWidth - 15;
    this.canvas.height = this.windowHeight - 15;
  }

  preloadImages() {
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
          // t.gameLoop();
        }
      };
    })
  }

  windowResize() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.resizeCanvas();
  }

  moveShipLeft() {
    console.log('left');
  }

  moveShipRight() {
    console.log('right');
  }

  shipFire() {
    console.log('shoot');
  }

  playerAction(keyCode) {
    if (keyCode === 37) {
      this.moveShipLeft()
    } else if (keyCode === 39) {
      this.moveShipRight()
    } else if (keyCode === 32) {
      this.shipFire();
    }
  }

  // gameLoop() {
  //   const t = this;
  //
  //   setTimeout(function() {
  //     window.requestAnimationFrame(t.gameLoop);
  //   }, 1000 / this.fps);
  // }

  handleEvents() {
    const t = this;

    window.onresize = () => {
      t.windowResize();
    };

    window.onkeydown = (e) => {
      const pressedKey = e.keyCode;

      t.playerAction(pressedKey);
    }
  }
};

// class Swarm {
//   constructor() {
//     this.population = [];
//     this.gatherBeings();
//   }
//
//   gatherBeings() {
//     for (let i = 0; i < this.invaders; i++) {
//       this.population.push(new Being());
//     }
//   }
//
//   update() {
//
//   }
// }
//
//
// class Being {
//   constructor() {
//     this.context = this.context;
//     this.width = 60;
//     this.height = 43;
//     this.image = this.images[0];
//     this.offsetX = 10;
//     this.offsetY = 10;
//   }
//
//   update() {
//
//   }
// }

class Ship {
  constructor() {
    this.context = this.context;
    this.width = 73;
    this.height = 52;
    this.image = this.images[1];
    this.posX = 10;
    this.posY = 10;
  }

  update() {

  }
}

(() => {
  new GAME();
})();

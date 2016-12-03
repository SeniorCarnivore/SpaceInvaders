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
    this.сanvas = document.createElement('canvas');
    this.context = this.сanvas.getContext('2d');
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.images = ['../img/dude.png','../img/bg.jpg'];
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
        if(i === ImagesCounter) {
          body.classList.add('space');
          t.gameLoop();
        }
      };
    })
  }

  windowResize() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.resizeCanvas();
  }

  // gameLoop() {
  //   const requestHack t = this;
  //
  //   setTimeout(function() {
  //     window.requestAnimationFrame(t.gameLoop);
  //   }, 1000 / this.fps);
  // }

  handleEvents() {
    const t = this;

    window.onresize = function() {
      t.windowResize();
    };
  }
};

class Swarm {
  constructor() {
    this.population = [];
  }

  gatherBeings() {
    for (let i = 0; i <= this.invaders; i++) {
      this.population.push(new Being());
    }
  }

  update() {

  }
}


class Being {
  constructor() {
    this.context = this.context;
    this.width = 10;
    this.height = 10;
    this.image = this.images[0];
    this.offsetX = 10;
    this.offsetY = 10;
  }

  update() {

  }
}

(() => {
  new GAME();
})();

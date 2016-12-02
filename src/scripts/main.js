let GameData = {
  Canvas: document.createElement('canvas'),
  context: false,
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight,
  images: ['../img/dude.png','../img/bg.jpg'],
  fps: 60,
  invaders: 30
}

window.requestAnimFrame = (() => {
	return  window.requestAnimationFrame       ||
					window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function (callback, element) {
              window.setTimeout(callback, 1000 / GameData.fps);
          };
	})();

class GAME {
  constructor() {
    document.body.appendChild(GameData.Canvas);
    GameData.context = GameData.Canvas.getContext('2d');
    this.resizeCanvas();
    this.handleEvents();
    this.preloadImages();
  }

  resizeCanvas() {
    GameData.Canvas.width = GameData.windowWidth - 15;
    GameData.Canvas.height = GameData.windowHeight - 15;
  }

  preloadImages() {
    const
      ImagesCounter = GameData.images.length - 1,
      t = this;

    GameData.images.forEach((sourse, i) => {
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
    GameData.windowWidth = window.innerWidth;
    GameData.windowHeight = window.innerHeight;
    this.resizeCanvas();
  }

  // gameLoop() {
  //   const requestHack t = this;
  //
  //   setTimeout(function() {
  //     window.requestAnimationFrame(t.gameLoop);
  //   }, 1000 / GameData.fps);
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
    for (let i = 0; i <= GameData.invaders; i++) {
      this.population.push(new Being());
    }
  }

  update() {

  }
}


class Being {
  constructor() {
    this.context = GameData.context;
    this.width = 10;
    this.height = 10;
    this.image = GameData.images[0];
    this.offsetX = 10;
    this.offsetY = 10;
  }

  update() {

  }
}

(() => {
  new GAME();
})();

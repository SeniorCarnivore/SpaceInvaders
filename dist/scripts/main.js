'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.requestAnimationFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) {
    window.setTimeout(callback, 1000 / GAME.fps);
  };
}();

var GAME = function () {
  function GAME() {
    var _this = this;

    _classCallCheck(this, GAME);

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.fps = 60;
    this.invaders = 30;
    this.objects = [];

    this.canvasSize = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.images = ['../img/dude.png', '../img/ship.png', '../img/laser.png', '../img/bg.jpg'];

    this.objects = this.objects.concat(new Ship(this, this.canvasSize, this.images[1]));
    this.swarmUp(this.images[0]);
    document.body.appendChild(this.canvas);
    this.resizeCanvas();
    this.handleEvents();

    var gameLoop = function gameLoop() {
      var t = _this;

      setTimeout(function () {
        t.update();
        t.render(t.context, t.canvasSize);
        window.requestAnimationFrame(gameLoop);
      }, 1000 / t.fps);
    };

    this.preloadImages(gameLoop);
  }

  _createClass(GAME, [{
    key: 'checkCollisions',
    value: function checkCollisions(firstObject, secondObject) {
      return !(firstObject === secondObject || firstObject.position.posX + firstObject.size.width / 2 < secondObject.position.posX - secondObject.size.width / 2 || firstObject.position.posY + firstObject.size.height / 2 < secondObject.position.posY - secondObject.size.height / 2 || firstObject.position.posX - firstObject.size.width / 2 > secondObject.position.posX + secondObject.size.width / 2 || firstObject.position.posY - firstObject.size.height / 2 > secondObject.position.posY + secondObject.size.height / 2);
    }
  }, {
    key: 'update',
    value: function update() {
      var _this2 = this;

      if (this.beings === 0) {
        this.destroy();
        new Finish('You win!');
        return;
      }

      var survivers = function survivers(firstObject) {
        return _this2.objects.filter(function (secondObject) {
          return _this2.checkCollisions(firstObject, secondObject);
        }).length === 0;
      };

      this.objects = this.objects.filter(survivers);

      var beings = 0;
      for (var i = 0; i < this.objects.length; i++) {
        this.objects[i].update();

        if (this.objects[i] instanceof Being) {
          beings += 1;
        }

        this.beings = beings;
      }
    }
  }, {
    key: 'render',
    value: function render(context, canvasSize) {
      context.clearRect(0, 0, canvasSize.width, canvasSize.height);
      for (var i = 0; i < this.objects.length; i++) {
        this.drawObject(context, this.objects[i], this.objects[i].image);
      }
    }
  }, {
    key: 'drawObject',
    value: function drawObject(context, object, image) {
      context.drawImage(image, object.position.posX, object.position.posY, object.size.width, object.size.height);
    }
  }, {
    key: 'toModule',
    value: function toModule(number) {
      if (number < 0) {
        number = -number;
      }

      return number;
    }
  }, {
    key: 'lowerRow',
    value: function lowerRow(being) {
      var _this3 = this;

      return this.objects.filter(function (haveFriends) {
        return haveFriends instanceof Being && _this3.toModule(being.position.x - haveFriends.position.x) < haveFriends.size.width && haveFriends.position.posY > being.position.posY;
      }).length > 0;
    }
  }, {
    key: 'swarmUp',
    value: function swarmUp(imgSrc) {
      this.swarm = [];
      this.beings = 60;

      for (var i = 0; i < this.beings; i++) {

        var posX = 10 + i % 12 * 80,
            posY = 10 + i % 5 * 60;

        this.swarm.push(new Being(this, {
          posX: posX,
          posY: posY
        }));
      }

      this.objects = this.objects.concat(this.swarm);
    }
  }, {
    key: 'preloadImages',
    value: function preloadImages(callback) {
      var ImagesCounter = this.images.length - 1,
          t = this;

      this.images.forEach(function (sourse, i) {
        var image = new Image(),
            body = document.querySelector('body');

        image.src = sourse;
        image.onload = function () {
          if (i === ImagesCounter) {
            body.classList.add('space');
            callback();
          }
        };
      });
    }
  }, {
    key: 'resizeCanvas',
    value: function resizeCanvas() {
      this.canvas.width = this.canvasSize.width - 15;
      this.canvas.height = this.canvasSize.height - 15;
    }
  }, {
    key: 'windowResize',
    value: function windowResize() {
      this.canvasSize.width = window.innerWidth;
      this.canvasSize.height = window.innerHeight;
      this.resizeCanvas();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      delete window.game;
    }
  }, {
    key: 'handleEvents',
    value: function handleEvents() {
      var t = this;

      window.onresize = function () {
        t.windowResize();
      };
    }
  }]);

  return GAME;
}();

;

var Laser = function () {
  function Laser(position, velocity, imgSrc) {
    _classCallCheck(this, Laser);

    this.image = document.createElement('img');
    this.image.src = imgSrc;
    this.size = {
      width: 24,
      height: 78
    };
    this.position = position;
    this.velocity = velocity;
  }

  _createClass(Laser, [{
    key: 'update',
    value: function update() {
      this.position.posX += this.velocity.x;
      this.position.posY += this.velocity.y;
    }
  }]);

  return Laser;
}();

var Ship = function () {
  function Ship(game, canvasSize, imgSrc) {
    _classCallCheck(this, Ship);

    this.game = game;
    this.image = document.createElement('img');
    this.image.src = imgSrc;
    this.size = {
      width: 73,
      height: 52
    };
    this.position = {
      posX: Math.round(canvasSize.width / 2 - this.size.width / 2),
      posY: Math.round(canvasSize.height - (this.size.height + 10))
    };

    this.handleEvents();
  }

  _createClass(Ship, [{
    key: 'laserTime',
    value: function laserTime() {
      var laser = new Laser({
        posX: this.position.posX,
        posY: this.position.posY - this.size.width - 10
      }, {
        x: 0,
        y: -20
      }, this.game.images[2]);

      this.game.objects.push(laser);
      new Audio('../sound/spas12.mp3', false);
    }
  }, {
    key: 'playerAction',
    value: function playerAction(keyCode) {
      if (keyCode === 37) {
        if (this.position.posX < 0) {
          return;
        }
        this.position.posX -= 10;
      } else if (keyCode === 39) {
        if (this.position.posX >= this.game.canvasSize.width - this.size.width - 20) {
          return;
        }
        this.position.posX += 10;
      } else if (keyCode === 32) {
        this.laserTime();
      }
    }
  }, {
    key: 'update',
    value: function update() {
      // tradition vs extra condition im game update method, hmmm ...
    }
  }, {
    key: 'handleEvents',
    value: function handleEvents() {
      var t = this;

      window.onkeydown = function (e) {
        var pressedKey = e.keyCode;

        t.playerAction(pressedKey);
      };
    }
  }]);

  return Ship;
}();

var Being = function () {
  function Being(game, position) {
    _classCallCheck(this, Being);

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

  _createClass(Being, [{
    key: 'invasionItself',
    value: function invasionItself(being) {
      var _this4 = this;

      setInterval(function () {
        _this4.position = {
          posX: _this4.position.posX,
          posY: _this4.position.posY + 10
        };

        if (_this4.position.posY + _this4.size.height + 100 > _this4.game.canvasSize.height) {
          new Finish('You lose!');
        }
      }, 1000);
    }
  }, {
    key: 'update',
    value: function update() {
      if (this.directionX < 0 || this.directionX > this.game.canvasSize.width - (this.size.width + 24) * 12) {
        this.speedX = -this.speedX;
      }

      this.position.posX += this.speedX;
      this.directionX += this.speedX;
    }
  }]);

  return Being;
}();

var Audio = function () {
  function Audio(sound, looped) {
    _classCallCheck(this, Audio);

    this.audio = document.createElement("AUDIO");
    this.audio.src = sound;
    this.audio.loop = looped;

    var audioOttoEvent = this.audio;
    this.audio.addEventListener('canplaythrough', function () {
      audioOttoEvent.play();
    }, false);
  }

  _createClass(Audio, [{
    key: 'stopPlaying',
    value: function stopPlaying() {
      if (!this.audio.loop) {
        setTimeout(function () {
          delete window.this;
        }, Math.ceil(this.audio.duration));
      }
    }
  }]);

  return Audio;
}();

var Finish = function () {
  function Finish(result) {
    _classCallCheck(this, Finish);

    this.canvas = document.querySelector('canvas');

    //one day, a wonderful flag will be triggering here
    if (this.canvas) {
      document.body.removeChild(this.canvas);
    } else {
      return;
    }

    this.head = document.createElement('h1');
    this.button = document.createElement('button');
    this.buttonText = document.createTextNode('Restart!');
    this.button.appendChild(this.buttonText);
    this.head.style.color = 'red';
    this.text = document.createTextNode(result);
    this.head.appendChild(this.text);
    document.body.appendChild(this.head);
    document.body.appendChild(this.button);

    this.helpers();
  }

  _createClass(Finish, [{
    key: 'helpers',
    value: function helpers() {
      document.querySelector('button').addEventListener('mouseup', function () {
        window.location.reload();
      }, false);
    }
  }]);

  return Finish;
}();

var gameActive = function gameActive() {
  new Audio('../sound/theme.mp3', true);
  new GAME();
};

var startButton = document.querySelector('.button'),
    startScreen = document.querySelector('.start-screen');

startButton.addEventListener('mouseup', function () {
  document.body.removeChild(startScreen);
  gameActive();
}, false);
//# sourceMappingURL=main.js.map

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
    return window.setTimeout(callback, 1000 / 60);
  });
}
function Constellation (canvas, options) {
  if(!canvas)
    return;
  var context = canvas.getContext('2d'),
    defaults = {
      star: {
        width: 0.1
      },
      position: {
        x: 0, // This value will be overwritten at startup
        y: 0 // This value will be overwritten at startup
      },
      width: window.innerWidth,
      height: window.innerHeight,
      velocity: 0.1,
      length: 100,
      distance: 120,
      radius: 150,
      stars: []
    },
    config = Object.assign(defaults, options);

  function Star () {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.vx = (config.velocity - (Math.random() * 0.5));
    this.vy = (config.velocity - (Math.random() * 0.5));

    this.radius = config.star.width;
  }

  Star.prototype = {
    create: function(){
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      context.fill();
    },

    animate: function(){
      var i;
      for (i = 0; i < config.length; i++) {

        var star = config.stars[i];

        if (star.y < 0 || star.y > canvas.height) {
          star.vx = star.vx;
          star.vy = - star.vy;
        } else if (star.x < 0 || star.x > canvas.width) {
          star.vx = - star.vx;
          star.vy = star.vy;
        }

        star.x += star.vx;
        star.y += star.vy;
      }
    }
  };

  this.createStars = function () {

    var length = config.length,
      star,
      i;

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (i = 0; i < length; i++) {
      config.stars.push(new Star());
      star = config.stars[i];

      star.create();
    }

    // star.line();
    star.animate();
  };

  this.setCanvas = function () {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  };

  this.setContext = function () {
    context.fillStyle = config.star.color;
    context.strokeStyle = config.line.color;
    context.lineWidth = config.line.width;
  };

  this.setInitialPosition = function () {
    if (!options || !options.hasOwnProperty('position')) {
      config.position = {
        x: canvas.width * 0.5,
        y: canvas.height * 0.5
      };
    }
  };

  this.loop = function (callback) {
    callback();

    window.requestAnimationFrame(function () {
      this.loop(callback);
    }.bind(this));
  };

  this.init = function () {
    this.setCanvas();
    this.setContext();
    this.setInitialPosition();
    this.loop(this.createStars);
  };
}

var canvas = document.querySelector('#banner-canvas');
// Init plugin
var c = new Constellation(canvas, {
  star: {
    width: 1 ,
    'color' : '#fff',
    length : 1
  },
  line: {
    color: '#195176'
  },
  length : 50,
  radius: 250
});
c.init();

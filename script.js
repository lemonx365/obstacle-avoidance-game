class Game {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");
    this.frameNo = null;
    this.interval = null;
    this.obstacles = [];
  }

  start() {
    this.player = new Component(30, 30, "red", 10, 120);
    this.player.gravity = 0.05;
    this.score = new Component("30px", "Consolas", "black", 280, 40, "text");
    this.interval = setInterval(this.updateGameArea.bind(this), 20);
    this.bindEvents();
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  updateGameArea() {
    this.clear();
    this.frameNo++;

    if (this.frameNo === 1 || this.everyInterval(150)) {
      const x = this.canvas.width;
      const minHeight = 20;
      const maxHeight = 200;
      const height = Math.floor(
        Math.random() * (maxHeight - minHeight + 1) + minHeight
      );
      const minGap = 50;
      const maxGap = 200;
      const gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
      this.obstacles.push(new Component(10, height, "green", x, 0));
      this.obstacles.push(
        new Component(10, x - height - gap, "green", x, height + gap)
      );
    }

    for (let i = 0; i < this.obstacles.length; i++) {
      const obstacle = this.obstacles[i];
      if (this.player.crashWith(obstacle)) {
        return;
      }
      obstacle.x += -1;
      obstacle.update();
    }

    this.score.text = "SCORE: " + this.frameNo;
    this.score.update();
    this.player.newPos();
    this.player.update();
  }

  everyInterval(n) {
    return (this.frameNo / n) % 1 === 0;
  }

  bindEvents() {
    const accelerateButton = document.getElementById("accelerateButton");
    accelerateButton.addEventListener("mousedown", () => this.accelerate(-0.2));
    accelerateButton.addEventListener("mouseup", () => this.accelerate(0.05));
  }

  accelerate(n) {
    this.player.gravity = n;
  }
}

class Component {
  constructor(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
  }

  update() {
    const ctx = game.context;
    const { width, height, color, x, y, type, text } = this;

    if (type === "text") {
      ctx.font = width + " " + height;
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
    }
  }

  newPos() {
    this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY + this.gravitySpeed;
    this.hitBottom();
  }

  hitBottom() {
    const rockbottom = game.canvas.height - this.height;
    if (this.y > rockbottom) {
      this.y = rockbottom;
      this.gravitySpeed = 0;
    }
  }

  crashWith(otherobj) {
    const myleft = this.x;
    const myright = this.x + this.width;
    const mytop = this.y;
    const mybottom = this.y + this.height;
    const otherleft = otherobj.x;
    const otherright = otherobj.x + otherobj.width;
    const othertop = otherobj.y;
    const otherbottom = otherobj.y + otherobj.height;
    return !(
      mybottom < othertop ||
      mytop > otherbottom ||
      myright < otherleft ||
      myleft > otherright
    );
  }
}

const game = new Game();
game.start();

export class Point2d {
  constructor(x,y) {
      this.x = x || 0;
      this.y = y || 0;
  }
  clone() {
      return this.constructor(this.x, this.y);
  }
  add(v) {
      this.x += v.x;
      this.y += v.y
      return this;
  }
 random() {
      this.x = Math.random() *1800;
      this.y = Math.random() * 800;
      return this
  }
}

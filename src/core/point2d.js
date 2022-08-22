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
  static random() {
      const w = Math.random() * 800;
      const h = Math.random() * 600;
      return new Point2d(w, h)
  }
}

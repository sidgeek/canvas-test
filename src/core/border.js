export class Border {
  constructor(
    x,
    y,
    width,
    height,
    options = {},
  ) {
    this.isMouseHovering = false
    // Object.entries(options).forEach(([key, value]) => this[key] = value);
    // store.ctx.canvas.addEventListener('mousemove', this.handleMouseMove);
  }

  destructor() {
  }

  render() {
    if (this.isMouseHovering) {
    }
  }
}

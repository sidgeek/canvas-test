class BaseHandler {
  constructor({ canvas, root }) {
    this.canvas = canvas
    this.ctx = canvas.ctx
    this.root = root
  }
}
export default BaseHandler

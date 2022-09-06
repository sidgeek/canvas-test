import { Rect } from "./shape/rect"

export class Node {
  constructor(props) {
    const {type} = props
    this.type =  type
    this.shape = this.createShape(type, props)
  }

  createShape(type, props) {
    switch (type) {
      case 'rect': {
        return new Rect(props)
      }
      case 'circle': {
        return new Rect(props)
      }
      default: {
        console.log(`Type: ${type} is not support for now!`);
        return null
      }
    }
  }

  render() {

  }
}
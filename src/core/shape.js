// 图形的基类
export class Shape {
  constructor() {
    this.listenerMap = new Map()
  }
  on(eventName, listener) {
    if (this.listenerMap.has(eventName)) {
      this.listenerMap.get(eventName).push(listener)
    } else {
      this.listenerMap.set(eventName, [listener])
    }
  }
}

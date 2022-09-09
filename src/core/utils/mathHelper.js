// 纯数学
// 获取斜线的终点, (基于起始点、角度和长度)
function getEndPointOfSlash(start, angle, dis) {
  const xSpan = Math.cos(angle) * dis
  const ySpan = Math.sin(angle) * dis

  return {
    x: start.x - xSpan,
    y: start.y - ySpan
  }
}

// 获取两个点的斜率
function getSlopeByTwoPoint(s, e) {
  let angle = Math.atan(
    (e.y - s.y) / (e.x - s.x)
  )
  angle = angle + (e.x >= s.x ? 0 : Math.PI)
  return angle + Math.PI
}

// 获取两个点的距离
function getDisOfTwoPoints(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}

// 获取移动后的位置
function getPointPatchedPos(p, move) {
  return { x: p.x + move.x, y: p.y + move.y }
}

// 获取相对偏移量
function getPointOffsetPos(refP, p) {
  return { x: p.x - refP.x, y: p.y - refP.y }
}

// 获取点到线的距离
function getPointToLineDis(start, end, point) {
  const A = getDisOfTwoPoints(start, end)
  const B = getDisOfTwoPoints(start, point)
  const C = getDisOfTwoPoints(end, point)

  const P = (A + B + C) / 2
  const allArea = Math.abs(Math.sqrt(P * (P - A) * (P - B) * (P - C)))
  const dis = (2 * allArea) / A
  return dis
}

// 获取以p1为中点的p2的对称点
function getSymmetryPoint(cp, p) {
  const disX = p.x - cp.x
  const disY = p.y - cp.y
  return {
    x: cp.x + disX * 2,
    y: cp.y + disY * 2
  }
}

// 获取两个节点的中点
function getMidPointOfTwoPoints(p1, p2) {
  return {
    x: (p1.x + p2.x) / 2.0,
    y: (p1.y + p2.y) / 2.0
  }
}

export default {
  getEndPointOfSlash,
  getDisOfTwoPoints,
  getSlopeByTwoPoint,
  getPointPatchedPos,
  getPointOffsetPos,
  getPointToLineDis,
  getSymmetryPoint,
  getMidPointOfTwoPoints
}

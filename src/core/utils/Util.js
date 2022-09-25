import { Point } from '../point2d';

const PiBy180 = Math.PI / 180; // 写在这里相当于缓存，因为会频繁调用
const iMatrix = [1, 0, 0, 1, 0, 0];
export class Util {
    static transformPoint(p, t, ignoreOffset) {
        if (ignoreOffset) {
            return new Point(t[0] * p.x + t[2] * p.y, t[1] * p.x + t[3] * p.y);
        }
        return new Point(t[0] * p.x + t[2] * p.y + t[4], t[1] * p.x + t[3] * p.y + t[5]);
    }
    /** 角度转弧度，注意 canvas 中用的都是弧度，但是角度对我们来说比较直观 */
    static degreesToRadians(degrees) {
        return degrees * PiBy180;
    }
    /** 弧度转角度，注意 canvas 中用的都是弧度，但是角度对我们来说比较直观 */
    static radiansToDegrees(radians) {
        return radians / PiBy180;
    }
    /**
     * 将 point 绕 origin 旋转 radians 弧度
     * @param {Point} point 要旋转的点
     * @param {Point} origin 旋转中心点
     * @param {number} radians 注意 canvas 中用的都是弧度
     * @returns
     */
    static rotatePoint(point, origin, radians) {
        const sin = Math.sin(radians),
            cos = Math.cos(radians);

        point.subtractEquals(origin);

        const rx = point.x * cos - point.y * sin;
        const ry = point.x * sin + point.y * cos;

        return new Point(rx, ry).addEquals(origin);
    }
    static pointerX(event) {
        return event.clientX || 0;
    }
    static pointerY(event) {
        return event.clientY || 0;
    }
    /** 获取元素位置 */
    static getElementPosition(element) {
        return window.getComputedStyle(element, null).position;
    }
    /** 获取鼠标的点击坐标，相对于页面左上角，注意不是画布的左上角，到时候会减掉 offset */
    static getPointer(event, upperCanvasEl) {
        event || (event = window.event);

        let element = event.target,
            body = document.body || { scrollLeft: 0, scrollTop: 0 },
            docElement = document.documentElement,
            orgElement = element,
            scrollLeft = 0,
            scrollTop = 0,
            firstFixedAncestor;

        while (element && element.parentNode && !firstFixedAncestor) {
            element = element.parentNode;
            if (element !== document && Util.getElementPosition(element) === 'fixed') firstFixedAncestor = element;

            if (element !== document && orgElement !== upperCanvasEl && Util.getElementPosition(element) === 'absolute') {
                scrollLeft = 0;
                scrollTop = 0;
            } else if (element === document && orgElement !== upperCanvasEl) {
                scrollLeft = body.scrollLeft || docElement.scrollLeft || 0;
                scrollTop = body.scrollTop || docElement.scrollTop || 0;
            } else {
                scrollLeft += (element).scrollLeft || 0;
                scrollTop += (element).scrollTop || 0;
            }
        }

        return {
            x: Util.pointerX(event) + scrollLeft,
            y: Util.pointerY(event) + scrollTop,
        };
    }
}

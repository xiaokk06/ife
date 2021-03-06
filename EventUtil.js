/**
 * 兼容性事件对象
 * @type {Object}
 */
var EventUtil = {
    addHandler: function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on+type"] = handler;
        }
    },
    removeHandler: function(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent) {
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    },
    getEvent: function(event) {
        return event ? event : window.event;
    },
    getTarget: function(event) {
        return event.target || event.srcElement;
    },
    preventDefault: function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    stopPropagation: function(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }
};

/**
 * 事件委托
 * @param  {[type]} parent  [父元素]
 * @param  {[type]} type    [事件类型]
 * @param  {[type]} Node    [子元素]
 * @param  {[type]} handler [事件处理函数]
 * @return {[type]}         [undefined]
 */
function delegateEvent(parent, type, Node, handler) {
    EventUtil.addHandler(parent, type, function() {
        var event = arguments[0] || window.event,
            // 判断IE兼容性
            target = event.target || event.srcElement;
        if (target && target.tagName === Node.toUpperCase()) {
            handler.call(target, event);
        }
    });
}



function EventTarget() {
    this.handlers = {};
}

EventTarget.prototype = {
    constructor: EventTarget,

    addHandler: function(type, handler) {
        if (typeof this.handlers[type] == "undefined") {
            this.handlers[type] = [];
        }

        this.handlers[type].push(handler);
    },

    fire: function(event) {
        if (!event.target) {
            event.target = this;
        }
        if (this.handlers[event.type] instanceof Array) {
            var handlers = this.handlers[event.type];
            for (var i = 0, len = handlers.length; i < len; i++) {
                handlers[i](event);
            }
        }
    },

    removeHandler: function(type, handler) {
        if (this.handlers[type] instanceof Array) {
            var handlers = this.handlers[type];
            for (var i = 0, len = handlers.length; i < len; i++) {
                if (handlers[i] === handler) {
                    break;
                }
            }

            handlers.splice(i, 1);
        }
    }
};

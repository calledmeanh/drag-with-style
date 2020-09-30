!function(n,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.PointEmitter=t():n.PointEmitter=t()}(this,(function(){return(this.webpackJsonpPointEmitter=this.webpackJsonpPointEmitter||[]).push([[0],[function(module,exports){eval('var __assign = (this && this.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\nvar EVENT_TYPE;\r\n(function (EVENT_TYPE) {\r\n    EVENT_TYPE["BEFORE_SELECT"] = "BEFORE_SELECT";\r\n    EVENT_TYPE["SELECT_START"] = "SELECT_START";\r\n    EVENT_TYPE["SELECTING"] = "SELECTING";\r\n    EVENT_TYPE["SELECT"] = "SELECT";\r\n    EVENT_TYPE["CLICK"] = "CLICK";\r\n    EVENT_TYPE["DB_CLICK"] = "DB_CLICK";\r\n    EVENT_TYPE["TOUCH_EDGES"] = "TOUCH_EDGES";\r\n    EVENT_TYPE["RESET"] = "RESET";\r\n})(EVENT_TYPE || (EVENT_TYPE = {}));\r\nvar DIRECTION;\r\n(function (DIRECTION) {\r\n    DIRECTION["TOP"] = "TOP";\r\n    DIRECTION["RIGHT"] = "RIGHT";\r\n    DIRECTION["BOTTOM"] = "BOTTOM";\r\n    DIRECTION["LEFT"] = "LEFT";\r\n})(DIRECTION || (DIRECTION = {}));\r\nvar PointEmitter = /** @class */ (function () {\r\n    function PointEmitter(node, _a) {\r\n        var _this = this;\r\n        var _b = _a === void 0 ? {} : _a, _c = _b.longPressThreshold, longPressThreshold = _c === void 0 ? 250 : _c, _d = _b.gridMovement, gridMovement = _d === void 0 ? 0 : _d;\r\n        this.clickTolerance = 5;\r\n        this.clickInterval = 250;\r\n        this.currentWindowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;\r\n        this.currentWindowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;\r\n        this.destroy = function () {\r\n            _this.node = null;\r\n            _this.listeners = Object.create(null);\r\n            _this.initialEventData = null;\r\n            _this.origDistanceFromXToNode = null;\r\n            _this.origDistanceFromYToNode = null;\r\n            _this.selecting = false;\r\n            _this.selectEventData = null;\r\n            _this.lastClickData = null;\r\n            _this.removeInitialEventListener && _this.removeInitialEventListener();\r\n            _this.removeMoveListener && _this.removeMoveListener();\r\n            _this.removeEndListener && _this.removeEndListener();\r\n            _this.removeKeyListener && _this.removeKeyListener();\r\n            _this.removeTouchMoveWindowListener && _this.removeTouchMoveWindowListener();\r\n        };\r\n        /* getter setter */\r\n        /* wrapper for add event listener */\r\n        this.listener = function (type, handler, target) {\r\n            target && target.addEventListener(type, handler, { passive: false });\r\n            !target && _this.node.addEventListener(type, handler, { passive: false });\r\n            return function () {\r\n                target && target.removeEventListener(type, handler, { passive: false });\r\n                !target && _this.node.removeEventListener(type, handler);\r\n            };\r\n        };\r\n        /* wrapper for add event listener */\r\n        /*  */\r\n        this.getBoundingRect = function (node) {\r\n            if (!node)\r\n                return;\r\n            var nodeBox = node.getBoundingClientRect();\r\n            return {\r\n                top: nodeBox.top,\r\n                left: nodeBox.left,\r\n                width: nodeBox.width,\r\n                height: nodeBox.height,\r\n            };\r\n        };\r\n        /*  */\r\n        /* Listen for mousedown & touchstart. When one is received, disabled the other and setup future event base on type */\r\n        this.onInitialEventListener = function () {\r\n            var removeTouchStartListener = _this.listener("touchstart", function (e) {\r\n                _this.removeInitialEventListener();\r\n                _this.removeInitialEventListener = _this.onAddLongPressListener(_this.onHandleEventListener, e);\r\n            });\r\n            var removeMouseDownListener = _this.listener("mousedown", function (e) {\r\n                _this.removeInitialEventListener();\r\n                _this.onHandleEventListener(e);\r\n                _this.removeInitialEventListener = _this.listener("mousedown", _this.onHandleEventListener);\r\n            });\r\n            _this.removeInitialEventListener = function () {\r\n                removeTouchStartListener();\r\n                removeMouseDownListener();\r\n            };\r\n        };\r\n        /* Listen for mousedown & touchstart. When one is received, disabled the other and setup future event base on type */\r\n        /* handling event */\r\n        this.onHandleEventListener = function (e) {\r\n            var _a = _this.getEventCoords(e), isTouch = _a.isTouch, x = _a.x, y = _a.y;\r\n            var _b = _this.getBoundingRect(_this.node), top = _b.top, left = _b.left;\r\n            _this.origDistanceFromYToNode = y - top;\r\n            _this.origDistanceFromXToNode = x - left;\r\n            _this.selectEventData = { x: x, y: y };\r\n            _this.initialEventData = { isTouch: isTouch, x: x, y: y };\r\n            _this.emit(EVENT_TYPE.BEFORE_SELECT, _this.initialEventData);\r\n            switch (e.type) {\r\n                case "touchstart":\r\n                    _this.removeMoveListener = _this.listener("touchmove", _this.onMoveListener);\r\n                    _this.removeEndListener = _this.listener("touchend", _this.onEndListener);\r\n                    _this.removeKeyListener = _this.listener("keydown", _this.onEndListener, window);\r\n                    break;\r\n                case "mousedown":\r\n                    _this.removeMoveListener = _this.listener("mousemove", _this.onMoveListener);\r\n                    _this.removeEndListener = _this.listener("mouseup", _this.onEndListener);\r\n                    _this.removeKeyListener = _this.listener("keydown", _this.onEndListener, window);\r\n                    break;\r\n                default:\r\n                    break;\r\n            }\r\n        };\r\n        /* add long press listener if user touch the screen without moving their finger for 250ms */\r\n        this.onAddLongPressListener = function (handleEventListener, e) {\r\n            var longPressTimer = null;\r\n            var removeTouchMoveListener = null;\r\n            var removeToucEndListener = null;\r\n            var cleanup = function () {\r\n                longPressTimer && clearTimeout(longPressTimer);\r\n                removeTouchMoveListener && removeTouchMoveListener();\r\n                removeToucEndListener && removeToucEndListener();\r\n                longPressTimer = null;\r\n                removeTouchMoveListener = null;\r\n                removeToucEndListener = null;\r\n            };\r\n            var onTouchStart = function (e) {\r\n                longPressTimer = setTimeout(function () {\r\n                    cleanup();\r\n                    handleEventListener(e);\r\n                }, _this.longPressThreshold);\r\n                removeTouchMoveListener = _this.listener("touchmove", function () { return cleanup(); });\r\n                removeToucEndListener = _this.listener("touchend", function () { return cleanup(); });\r\n            };\r\n            var removeTouchStartListener = _this.listener("touchstart", onTouchStart);\r\n            e && onTouchStart(e);\r\n            return function () {\r\n                cleanup();\r\n                removeTouchStartListener();\r\n            };\r\n        };\r\n        this.onMoveListener = function (e) {\r\n            if (!_this.initialEventData)\r\n                return;\r\n            var _a = _this.initialEventData, initX = _a.x, initY = _a.y;\r\n            var _b = _this.getEventCoords(e), x = _b.x, y = _b.y;\r\n            var origSelecting = _this.selecting, distanceFromInitXToX = Math.abs(initX - x), distanceFromInitYToY = Math.abs(initY - y), click = _this.isClick(x, y);\r\n            // Prevent emitting selectStart event until mouse is moved.\r\n            // in Chrome on Windows, mouseMove event may be fired just after mouseDown event.\r\n            if (_this.isClick(x, y) && !origSelecting && !(distanceFromInitXToX || distanceFromInitYToY))\r\n                return;\r\n            var afterX = x - _this.origDistanceFromXToNode;\r\n            var afterY = y - _this.origDistanceFromYToNode;\r\n            if (_this.gridMovement) {\r\n                afterX = _this.calcGridMovement(afterX);\r\n                afterY = _this.calcGridMovement(afterY);\r\n            }\r\n            _this.selectEventData = { x: afterX, y: afterY };\r\n            _this.selecting = true;\r\n            !origSelecting && _this.emit(EVENT_TYPE.SELECT_START, { x: initX, y: initY });\r\n            !click && _this.emit(EVENT_TYPE.SELECTING, _this.selectEventData);\r\n            var _c = _this.touchEdges(x, y), touch = _c.touch, dir = _c.dir;\r\n            if (touch) {\r\n                return _this.emit(EVENT_TYPE.TOUCH_EDGES, __assign(__assign({}, _this.selectEventData), { dir: dir }));\r\n            }\r\n            e.preventDefault();\r\n        };\r\n        this.onEndListener = function (e) {\r\n            if (!_this.initialEventData)\r\n                return;\r\n            _this.removeMoveListener && _this.removeMoveListener();\r\n            _this.removeEndListener && _this.removeEndListener();\r\n            _this.removeKeyListener && _this.removeKeyListener();\r\n            _this.selecting = false;\r\n            var inRoot = _this.node.contains(e.target);\r\n            var _a = _this.getEventCoords(e), x = _a.x, y = _a.y;\r\n            var click = _this.isClick(x, y);\r\n            if (e.key) {\r\n                return _this.emit(EVENT_TYPE.RESET, _this.selectEventData);\r\n            }\r\n            if (click && inRoot)\r\n                return _this.onClickListener(e);\r\n            if (!click)\r\n                return _this.emit(EVENT_TYPE.SELECT, _this.selectEventData);\r\n        };\r\n        this.onClickListener = function (e) {\r\n            var _a = _this.getEventCoords(e), x = _a.x, y = _a.y;\r\n            var now = new Date().getTime();\r\n            if (_this.lastClickData && now - _this.lastClickData <= _this.clickInterval) {\r\n                _this.lastClickData = null;\r\n                return _this.emit(EVENT_TYPE.DB_CLICK, { x: x, y: y });\r\n            }\r\n            _this.lastClickData = now;\r\n            return _this.emit(EVENT_TYPE.CLICK, { x: x, y: y });\r\n        };\r\n        this.getEventCoords = function (e) {\r\n            var coords = {\r\n                isTouch: false,\r\n                x: e.pageX,\r\n                y: e.pageY,\r\n            };\r\n            /* if (e.touches && e.touches.length) {\r\n              coords.isTouch = true;\r\n              coords.x = e.touches[0].pageX;\r\n              coords.y = e.touches[0].pageY;\r\n            } */\r\n            /* try new way =)) */\r\n            e.touches &&\r\n                e.touches.length &&\r\n                ((coords.isTouch = true), (coords.x = e.touches[0].pageX), (coords.y = e.touches[0].pageY));\r\n            return coords;\r\n        };\r\n        this.isClick = function (currX, currY) {\r\n            var _a = _this.initialEventData, isTouch = _a.isTouch, x = _a.x, y = _a.y;\r\n            return !isTouch && Math.abs(currX - x) <= _this.clickTolerance && Math.abs(currY - y) <= _this.clickTolerance;\r\n        };\r\n        this.touchEdges = function (x, y) {\r\n            var _a = _this.getBoundingRect(_this.node), width = _a.width, height = _a.height;\r\n            var afterX = x - _this.origDistanceFromXToNode;\r\n            var afterY = y - _this.origDistanceFromYToNode;\r\n            if (afterX < 0) {\r\n                return { touch: true, dir: DIRECTION.LEFT };\r\n            }\r\n            if (afterX + width > _this.currentWindowWidth) {\r\n                return { touch: true, dir: DIRECTION.RIGHT };\r\n            }\r\n            if (afterY < 0) {\r\n                return { touch: true, dir: DIRECTION.TOP };\r\n            }\r\n            if (afterY + height > _this.currentWindowHeight) {\r\n                return { touch: true, dir: DIRECTION.BOTTOM };\r\n            }\r\n            return { touch: false, dir: null };\r\n        };\r\n        this.calcGridMovement = function (currPosition) {\r\n            return Math.floor(currPosition / _this.gridMovement) * _this.gridMovement;\r\n        };\r\n        /* handling event */\r\n        /* Inspire by EventEmiiter, turnsout it\'s PubSub pattern */\r\n        this.on = function (type, handler) {\r\n            var idx = (_this.listeners[type] || (_this.listeners[type] = [])).push(handler) - 1;\r\n            return {\r\n                off: function () {\r\n                    this.listeners[type].splice(idx, 1);\r\n                },\r\n            };\r\n        };\r\n        this.emit = function (type) {\r\n            var args = [];\r\n            for (var _i = 1; _i < arguments.length; _i++) {\r\n                args[_i - 1] = arguments[_i];\r\n            }\r\n            (_this.listeners[type] || []).forEach(function (fn) {\r\n                fn.apply(void 0, args);\r\n            });\r\n        };\r\n        this.node = node;\r\n        this.listeners = Object.create(null);\r\n        this.selecting = false;\r\n        this.longPressThreshold = longPressThreshold;\r\n        this.gridMovement = gridMovement;\r\n        // Fixes an iOS 10 bug where scrolling could not be prevented on the window.\r\n        this.removeTouchMoveWindowListener = this.listener("touchmove", function () { }, window);\r\n        this.onInitialEventListener();\r\n        console.log(this.currentWindowWidth, this.currentWindowHeight);\r\n    }\r\n    Object.defineProperty(PointEmitter.prototype, "getNode", {\r\n        /* getter setter */\r\n        get: function () {\r\n            return this.node;\r\n        },\r\n        enumerable: false,\r\n        configurable: true\r\n    });\r\n    Object.defineProperty(PointEmitter.prototype, "getListeners", {\r\n        get: function () {\r\n            return this.listeners;\r\n        },\r\n        enumerable: false,\r\n        configurable: true\r\n    });\r\n    return PointEmitter;\r\n}());\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovL1BvaW50RW1pdHRlci8uL3NyYy9pbmRleC50cz9mZmI0Il0sInNvdXJjZXNDb250ZW50IjpbImVudW0gRVZFTlRfVFlQRSB7XHJcbiAgQkVGT1JFX1NFTEVDVCA9IFwiQkVGT1JFX1NFTEVDVFwiLFxyXG4gIFNFTEVDVF9TVEFSVCA9IFwiU0VMRUNUX1NUQVJUXCIsXHJcbiAgU0VMRUNUSU5HID0gXCJTRUxFQ1RJTkdcIixcclxuICBTRUxFQ1QgPSBcIlNFTEVDVFwiLFxyXG4gIENMSUNLID0gXCJDTElDS1wiLFxyXG4gIERCX0NMSUNLID0gXCJEQl9DTElDS1wiLFxyXG4gIFRPVUNIX0VER0VTID0gXCJUT1VDSF9FREdFU1wiLFxyXG4gIFJFU0VUID0gXCJSRVNFVFwiLFxyXG59XHJcblxyXG5lbnVtIERJUkVDVElPTiB7XHJcbiAgVE9QID0gXCJUT1BcIixcclxuICBSSUdIVCA9IFwiUklHSFRcIixcclxuICBCT1RUT00gPSBcIkJPVFRPTVwiLFxyXG4gIExFRlQgPSBcIkxFRlRcIixcclxufVxyXG5cclxudHlwZSBQb2ludERhdGEgPSB7XHJcbiAgeDogbnVtYmVyO1xyXG4gIHk6IG51bWJlcjtcclxufTtcclxuXHJcbnR5cGUgRWRnZURhdGEgPSBQb2ludERhdGEgJiB7XHJcbiAgZGlyOiBESVJFQ1RJT047XHJcbn07XHJcblxyXG50eXBlIEV2ZW50RGF0YSA9IFBvaW50RGF0YSAmIHtcclxuICBpc1RvdWNoOiBib29sZWFuO1xyXG59O1xyXG5cclxudHlwZSBCb3hEYXRhID0ge1xyXG4gIHRvcDogbnVtYmVyO1xyXG4gIGxlZnQ6IG51bWJlcjtcclxuICB3aWR0aDogbnVtYmVyO1xyXG4gIGhlaWdodDogbnVtYmVyO1xyXG59O1xyXG5cclxudHlwZSBMaXN0ZW5lckRhdGEgPSB7IFtrZXk6IHN0cmluZ106IEZ1bmN0aW9uW10gfTtcclxuXHJcbmNsYXNzIFBvaW50RW1pdHRlciB7XHJcbiAgcHJpdmF0ZSByZWFkb25seSBjbGlja1RvbGVyYW5jZTogbnVtYmVyID0gNTtcclxuICBwcml2YXRlIHJlYWRvbmx5IGNsaWNrSW50ZXJ2YWw6IG51bWJlciA9IDI1MDtcclxuXHJcbiAgcHJpdmF0ZSByZWFkb25seSBjdXJyZW50V2luZG93V2lkdGg6IG51bWJlciA9XHJcbiAgICB3aW5kb3cuaW5uZXJXaWR0aCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggfHwgZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aDtcclxuXHJcbiAgcHJpdmF0ZSByZWFkb25seSBjdXJyZW50V2luZG93SGVpZ2h0OiBudW1iZXIgPVxyXG4gICAgd2luZG93LmlubmVySGVpZ2h0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQgfHwgZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQ7XHJcblxyXG4gIHByaXZhdGUgbG9uZ1ByZXNzVGhyZXNob2xkOiBudW1iZXI7XHJcbiAgcHJpdmF0ZSBncmlkTW92ZW1lbnQ6IG51bWJlcjtcclxuXHJcbiAgcHJpdmF0ZSBub2RlOiBFbGVtZW50IHwgbnVsbDtcclxuICBwcml2YXRlIGxpc3RlbmVyczogTGlzdGVuZXJEYXRhO1xyXG4gIHByaXZhdGUgaW5pdGlhbEV2ZW50RGF0YTogRXZlbnREYXRhIHwgbnVsbDtcclxuICBwcml2YXRlIG9yaWdEaXN0YW5jZUZyb21YVG9Ob2RlOiBudW1iZXIgfCBudWxsO1xyXG4gIHByaXZhdGUgb3JpZ0Rpc3RhbmNlRnJvbVlUb05vZGU6IG51bWJlciB8IG51bGw7XHJcbiAgcHJpdmF0ZSBzZWxlY3Rpbmc6IGJvb2xlYW47XHJcbiAgcHJpdmF0ZSBzZWxlY3RFdmVudERhdGE6IFBvaW50RGF0YSB8IG51bGw7IC8vIHNhdmUgY3VyclggJiBjdXJyWSBmb3IgU0VMRUNUSU5HICYgU0VMRUNUIHR5cGUgY2F1c2UgXCJ0b3VjaEVuZFwiIGRvZXNuJ3QgaGF2ZSBcInBhZ2VYLCBwYWdlWVwiXHJcbiAgcHJpdmF0ZSBsYXN0Q2xpY2tEYXRhOiBudW1iZXIgfCBudWxsOyAvLyBzYXZlIGxhc3QgY2xpY2sgdG8gY29tcGFyZSB3aXRoIGxhdGVzdCBjbGljayBmb3IgREJfQ0xJQ0sgdHlwZVxyXG5cclxuICBwcml2YXRlIHJlbW92ZUluaXRpYWxFdmVudExpc3RlbmVyOiBGdW5jdGlvbjtcclxuICBwcml2YXRlIHJlbW92ZU1vdmVMaXN0ZW5lcjogRnVuY3Rpb247XHJcbiAgcHJpdmF0ZSByZW1vdmVFbmRMaXN0ZW5lcjogRnVuY3Rpb247XHJcbiAgcHJpdmF0ZSByZW1vdmVLZXlMaXN0ZW5lcjogRnVuY3Rpb247XHJcbiAgcHJpdmF0ZSByZW1vdmVUb3VjaE1vdmVXaW5kb3dMaXN0ZW5lcjogRnVuY3Rpb247XHJcblxyXG4gIGNvbnN0cnVjdG9yKG5vZGU6IEVsZW1lbnQgfCBudWxsLCB7IGxvbmdQcmVzc1RocmVzaG9sZCA9IDI1MCwgZ3JpZE1vdmVtZW50ID0gMCB9ID0ge30pIHtcclxuICAgIHRoaXMubm9kZSA9IG5vZGU7XHJcbiAgICB0aGlzLmxpc3RlbmVycyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgICB0aGlzLnNlbGVjdGluZyA9IGZhbHNlO1xyXG4gICAgdGhpcy5sb25nUHJlc3NUaHJlc2hvbGQgPSBsb25nUHJlc3NUaHJlc2hvbGQ7XHJcbiAgICB0aGlzLmdyaWRNb3ZlbWVudCA9IGdyaWRNb3ZlbWVudDtcclxuXHJcbiAgICAvLyBGaXhlcyBhbiBpT1MgMTAgYnVnIHdoZXJlIHNjcm9sbGluZyBjb3VsZCBub3QgYmUgcHJldmVudGVkIG9uIHRoZSB3aW5kb3cuXHJcbiAgICB0aGlzLnJlbW92ZVRvdWNoTW92ZVdpbmRvd0xpc3RlbmVyID0gdGhpcy5saXN0ZW5lcihcInRvdWNobW92ZVwiLCAoKSA9PiB7fSwgd2luZG93KTtcclxuXHJcbiAgICB0aGlzLm9uSW5pdGlhbEV2ZW50TGlzdGVuZXIoKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRXaW5kb3dXaWR0aCwgdGhpcy5jdXJyZW50V2luZG93SGVpZ2h0KTtcclxuICB9XHJcblxyXG4gIGRlc3Ryb3kgPSAoKSA9PiB7XHJcbiAgICB0aGlzLm5vZGUgPSBudWxsO1xyXG4gICAgdGhpcy5saXN0ZW5lcnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgdGhpcy5pbml0aWFsRXZlbnREYXRhID0gbnVsbDtcclxuICAgIHRoaXMub3JpZ0Rpc3RhbmNlRnJvbVhUb05vZGUgPSBudWxsO1xyXG4gICAgdGhpcy5vcmlnRGlzdGFuY2VGcm9tWVRvTm9kZSA9IG51bGw7XHJcbiAgICB0aGlzLnNlbGVjdGluZyA9IGZhbHNlO1xyXG4gICAgdGhpcy5zZWxlY3RFdmVudERhdGEgPSBudWxsO1xyXG4gICAgdGhpcy5sYXN0Q2xpY2tEYXRhID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLnJlbW92ZUluaXRpYWxFdmVudExpc3RlbmVyICYmIHRoaXMucmVtb3ZlSW5pdGlhbEV2ZW50TGlzdGVuZXIoKTtcclxuICAgIHRoaXMucmVtb3ZlTW92ZUxpc3RlbmVyICYmIHRoaXMucmVtb3ZlTW92ZUxpc3RlbmVyKCk7XHJcbiAgICB0aGlzLnJlbW92ZUVuZExpc3RlbmVyICYmIHRoaXMucmVtb3ZlRW5kTGlzdGVuZXIoKTtcclxuICAgIHRoaXMucmVtb3ZlS2V5TGlzdGVuZXIgJiYgdGhpcy5yZW1vdmVLZXlMaXN0ZW5lcigpO1xyXG4gICAgdGhpcy5yZW1vdmVUb3VjaE1vdmVXaW5kb3dMaXN0ZW5lciAmJiB0aGlzLnJlbW92ZVRvdWNoTW92ZVdpbmRvd0xpc3RlbmVyKCk7XHJcbiAgfTtcclxuICAvKiBnZXR0ZXIgc2V0dGVyICovXHJcbiAgZ2V0IGdldE5vZGUoKTogRWxlbWVudCB7XHJcbiAgICByZXR1cm4gdGhpcy5ub2RlO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGdldExpc3RlbmVycygpOiBMaXN0ZW5lckRhdGEge1xyXG4gICAgcmV0dXJuIHRoaXMubGlzdGVuZXJzO1xyXG4gIH1cclxuICAvKiBnZXR0ZXIgc2V0dGVyICovXHJcblxyXG4gIC8qIHdyYXBwZXIgZm9yIGFkZCBldmVudCBsaXN0ZW5lciAqL1xyXG4gIGxpc3RlbmVyID0gKHR5cGU6IHN0cmluZywgaGFuZGxlcjogRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdCwgdGFyZ2V0PzogYW55KSA9PiB7XHJcbiAgICB0YXJnZXQgJiYgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgaGFuZGxlciwgeyBwYXNzaXZlOiBmYWxzZSB9KTtcclxuICAgICF0YXJnZXQgJiYgdGhpcy5ub2RlLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgaGFuZGxlciwgeyBwYXNzaXZlOiBmYWxzZSB9KTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICB0YXJnZXQgJiYgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgaGFuZGxlciwgeyBwYXNzaXZlOiBmYWxzZSB9KTtcclxuICAgICAgIXRhcmdldCAmJiB0aGlzLm5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyKTtcclxuICAgIH07XHJcbiAgfTtcclxuICAvKiB3cmFwcGVyIGZvciBhZGQgZXZlbnQgbGlzdGVuZXIgKi9cclxuXHJcbiAgLyogICovXHJcbiAgZ2V0Qm91bmRpbmdSZWN0ID0gKG5vZGU6IEVsZW1lbnQpOiBCb3hEYXRhID0+IHtcclxuICAgIGlmICghbm9kZSkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IG5vZGVCb3g6IERPTVJlY3QgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdG9wOiBub2RlQm94LnRvcCxcclxuICAgICAgbGVmdDogbm9kZUJveC5sZWZ0LFxyXG4gICAgICB3aWR0aDogbm9kZUJveC53aWR0aCxcclxuICAgICAgaGVpZ2h0OiBub2RlQm94LmhlaWdodCxcclxuICAgIH07XHJcbiAgfTtcclxuICAvKiAgKi9cclxuXHJcbiAgLyogTGlzdGVuIGZvciBtb3VzZWRvd24gJiB0b3VjaHN0YXJ0LiBXaGVuIG9uZSBpcyByZWNlaXZlZCwgZGlzYWJsZWQgdGhlIG90aGVyIGFuZCBzZXR1cCBmdXR1cmUgZXZlbnQgYmFzZSBvbiB0eXBlICovXHJcbiAgb25Jbml0aWFsRXZlbnRMaXN0ZW5lciA9ICgpOiB2b2lkID0+IHtcclxuICAgIGNvbnN0IHJlbW92ZVRvdWNoU3RhcnRMaXN0ZW5lciA9IHRoaXMubGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIChlKSA9PiB7XHJcbiAgICAgIHRoaXMucmVtb3ZlSW5pdGlhbEV2ZW50TGlzdGVuZXIoKTtcclxuICAgICAgdGhpcy5yZW1vdmVJbml0aWFsRXZlbnRMaXN0ZW5lciA9IHRoaXMub25BZGRMb25nUHJlc3NMaXN0ZW5lcih0aGlzLm9uSGFuZGxlRXZlbnRMaXN0ZW5lciwgZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCByZW1vdmVNb3VzZURvd25MaXN0ZW5lciA9IHRoaXMubGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcclxuICAgICAgdGhpcy5yZW1vdmVJbml0aWFsRXZlbnRMaXN0ZW5lcigpO1xyXG4gICAgICB0aGlzLm9uSGFuZGxlRXZlbnRMaXN0ZW5lcihlKTtcclxuICAgICAgdGhpcy5yZW1vdmVJbml0aWFsRXZlbnRMaXN0ZW5lciA9IHRoaXMubGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5vbkhhbmRsZUV2ZW50TGlzdGVuZXIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5yZW1vdmVJbml0aWFsRXZlbnRMaXN0ZW5lciA9ICgpID0+IHtcclxuICAgICAgcmVtb3ZlVG91Y2hTdGFydExpc3RlbmVyKCk7XHJcbiAgICAgIHJlbW92ZU1vdXNlRG93bkxpc3RlbmVyKCk7XHJcbiAgICB9O1xyXG4gIH07XHJcbiAgLyogTGlzdGVuIGZvciBtb3VzZWRvd24gJiB0b3VjaHN0YXJ0LiBXaGVuIG9uZSBpcyByZWNlaXZlZCwgZGlzYWJsZWQgdGhlIG90aGVyIGFuZCBzZXR1cCBmdXR1cmUgZXZlbnQgYmFzZSBvbiB0eXBlICovXHJcblxyXG4gIC8qIGhhbmRsaW5nIGV2ZW50ICovXHJcbiAgb25IYW5kbGVFdmVudExpc3RlbmVyID0gKGU6IGFueSkgPT4ge1xyXG4gICAgY29uc3QgeyBpc1RvdWNoLCB4LCB5IH0gPSB0aGlzLmdldEV2ZW50Q29vcmRzKGUpO1xyXG4gICAgY29uc3QgeyB0b3AsIGxlZnQgfSA9IHRoaXMuZ2V0Qm91bmRpbmdSZWN0KHRoaXMubm9kZSk7XHJcbiAgICB0aGlzLm9yaWdEaXN0YW5jZUZyb21ZVG9Ob2RlID0geSAtIHRvcDtcclxuICAgIHRoaXMub3JpZ0Rpc3RhbmNlRnJvbVhUb05vZGUgPSB4IC0gbGVmdDtcclxuICAgIHRoaXMuc2VsZWN0RXZlbnREYXRhID0geyB4LCB5IH07XHJcbiAgICB0aGlzLmluaXRpYWxFdmVudERhdGEgPSB7IGlzVG91Y2gsIHgsIHkgfTtcclxuICAgIHRoaXMuZW1pdChFVkVOVF9UWVBFLkJFRk9SRV9TRUxFQ1QsIHRoaXMuaW5pdGlhbEV2ZW50RGF0YSk7XHJcblxyXG4gICAgc3dpdGNoIChlLnR5cGUpIHtcclxuICAgICAgY2FzZSBcInRvdWNoc3RhcnRcIjpcclxuICAgICAgICB0aGlzLnJlbW92ZU1vdmVMaXN0ZW5lciA9IHRoaXMubGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy5vbk1vdmVMaXN0ZW5lcik7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbmRMaXN0ZW5lciA9IHRoaXMubGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCB0aGlzLm9uRW5kTGlzdGVuZXIpO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlS2V5TGlzdGVuZXIgPSB0aGlzLmxpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLm9uRW5kTGlzdGVuZXIsIHdpbmRvdyk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCJtb3VzZWRvd25cIjpcclxuICAgICAgICB0aGlzLnJlbW92ZU1vdmVMaXN0ZW5lciA9IHRoaXMubGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5vbk1vdmVMaXN0ZW5lcik7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbmRMaXN0ZW5lciA9IHRoaXMubGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMub25FbmRMaXN0ZW5lcik7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVLZXlMaXN0ZW5lciA9IHRoaXMubGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMub25FbmRMaXN0ZW5lciwgd2luZG93KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvKiBhZGQgbG9uZyBwcmVzcyBsaXN0ZW5lciBpZiB1c2VyIHRvdWNoIHRoZSBzY3JlZW4gd2l0aG91dCBtb3ZpbmcgdGhlaXIgZmluZ2VyIGZvciAyNTBtcyAqL1xyXG4gIG9uQWRkTG9uZ1ByZXNzTGlzdGVuZXIgPSAoaGFuZGxlRXZlbnRMaXN0ZW5lcjogRnVuY3Rpb24sIGU6IGFueSkgPT4ge1xyXG4gICAgbGV0IGxvbmdQcmVzc1RpbWVyOiBOb2RlSlMuVGltZW91dCB8IG51bGwgPSBudWxsO1xyXG4gICAgbGV0IHJlbW92ZVRvdWNoTW92ZUxpc3RlbmVyOiBGdW5jdGlvbiB8IG51bGwgPSBudWxsO1xyXG4gICAgbGV0IHJlbW92ZVRvdWNFbmRMaXN0ZW5lcjogRnVuY3Rpb24gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBjb25zdCBjbGVhbnVwID0gKCkgPT4ge1xyXG4gICAgICBsb25nUHJlc3NUaW1lciAmJiBjbGVhclRpbWVvdXQobG9uZ1ByZXNzVGltZXIpO1xyXG4gICAgICByZW1vdmVUb3VjaE1vdmVMaXN0ZW5lciAmJiByZW1vdmVUb3VjaE1vdmVMaXN0ZW5lcigpO1xyXG4gICAgICByZW1vdmVUb3VjRW5kTGlzdGVuZXIgJiYgcmVtb3ZlVG91Y0VuZExpc3RlbmVyKCk7XHJcblxyXG4gICAgICBsb25nUHJlc3NUaW1lciA9IG51bGw7XHJcbiAgICAgIHJlbW92ZVRvdWNoTW92ZUxpc3RlbmVyID0gbnVsbDtcclxuICAgICAgcmVtb3ZlVG91Y0VuZExpc3RlbmVyID0gbnVsbDtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3Qgb25Ub3VjaFN0YXJ0ID0gKGU6IGFueSkgPT4ge1xyXG4gICAgICBsb25nUHJlc3NUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNsZWFudXAoKTtcclxuICAgICAgICBoYW5kbGVFdmVudExpc3RlbmVyKGUpO1xyXG4gICAgICB9LCB0aGlzLmxvbmdQcmVzc1RocmVzaG9sZCk7XHJcbiAgICAgIHJlbW92ZVRvdWNoTW92ZUxpc3RlbmVyID0gdGhpcy5saXN0ZW5lcihcInRvdWNobW92ZVwiLCAoKSA9PiBjbGVhbnVwKCkpO1xyXG4gICAgICByZW1vdmVUb3VjRW5kTGlzdGVuZXIgPSB0aGlzLmxpc3RlbmVyKFwidG91Y2hlbmRcIiwgKCkgPT4gY2xlYW51cCgpKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgcmVtb3ZlVG91Y2hTdGFydExpc3RlbmVyID0gdGhpcy5saXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgb25Ub3VjaFN0YXJ0KTtcclxuXHJcbiAgICBlICYmIG9uVG91Y2hTdGFydChlKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICBjbGVhbnVwKCk7XHJcbiAgICAgIHJlbW92ZVRvdWNoU3RhcnRMaXN0ZW5lcigpO1xyXG4gICAgfTtcclxuICB9O1xyXG5cclxuICBvbk1vdmVMaXN0ZW5lciA9IChlOiBhbnkpID0+IHtcclxuICAgIGlmICghdGhpcy5pbml0aWFsRXZlbnREYXRhKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgeyB4OiBpbml0WCwgeTogaW5pdFkgfSA9IHRoaXMuaW5pdGlhbEV2ZW50RGF0YTtcclxuICAgIGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5nZXRFdmVudENvb3JkcyhlKTtcclxuICAgIGNvbnN0IG9yaWdTZWxlY3Rpbmc6IGJvb2xlYW4gPSB0aGlzLnNlbGVjdGluZyxcclxuICAgICAgZGlzdGFuY2VGcm9tSW5pdFhUb1g6IG51bWJlciA9IE1hdGguYWJzKGluaXRYIC0geCksXHJcbiAgICAgIGRpc3RhbmNlRnJvbUluaXRZVG9ZOiBudW1iZXIgPSBNYXRoLmFicyhpbml0WSAtIHkpLFxyXG4gICAgICBjbGljayA9IHRoaXMuaXNDbGljayh4LCB5KTtcclxuXHJcbiAgICAvLyBQcmV2ZW50IGVtaXR0aW5nIHNlbGVjdFN0YXJ0IGV2ZW50IHVudGlsIG1vdXNlIGlzIG1vdmVkLlxyXG4gICAgLy8gaW4gQ2hyb21lIG9uIFdpbmRvd3MsIG1vdXNlTW92ZSBldmVudCBtYXkgYmUgZmlyZWQganVzdCBhZnRlciBtb3VzZURvd24gZXZlbnQuXHJcbiAgICBpZiAodGhpcy5pc0NsaWNrKHgsIHkpICYmICFvcmlnU2VsZWN0aW5nICYmICEoZGlzdGFuY2VGcm9tSW5pdFhUb1ggfHwgZGlzdGFuY2VGcm9tSW5pdFlUb1kpKSByZXR1cm47XHJcblxyXG4gICAgbGV0IGFmdGVyWDogbnVtYmVyID0geCAtIHRoaXMub3JpZ0Rpc3RhbmNlRnJvbVhUb05vZGU7XHJcbiAgICBsZXQgYWZ0ZXJZOiBudW1iZXIgPSB5IC0gdGhpcy5vcmlnRGlzdGFuY2VGcm9tWVRvTm9kZTtcclxuXHJcbiAgICBpZiAodGhpcy5ncmlkTW92ZW1lbnQpIHtcclxuICAgICAgYWZ0ZXJYID0gdGhpcy5jYWxjR3JpZE1vdmVtZW50KGFmdGVyWCk7XHJcbiAgICAgIGFmdGVyWSA9IHRoaXMuY2FsY0dyaWRNb3ZlbWVudChhZnRlclkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2VsZWN0RXZlbnREYXRhID0geyB4OiBhZnRlclgsIHk6IGFmdGVyWSB9O1xyXG4gICAgdGhpcy5zZWxlY3RpbmcgPSB0cnVlO1xyXG5cclxuICAgICFvcmlnU2VsZWN0aW5nICYmIHRoaXMuZW1pdChFVkVOVF9UWVBFLlNFTEVDVF9TVEFSVCwgeyB4OiBpbml0WCwgeTogaW5pdFkgfSk7XHJcbiAgICAhY2xpY2sgJiYgdGhpcy5lbWl0KEVWRU5UX1RZUEUuU0VMRUNUSU5HLCB0aGlzLnNlbGVjdEV2ZW50RGF0YSk7XHJcblxyXG4gICAgY29uc3QgeyB0b3VjaCwgZGlyIH0gPSB0aGlzLnRvdWNoRWRnZXMoeCwgeSk7XHJcbiAgICBpZiAodG91Y2gpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZW1pdChFVkVOVF9UWVBFLlRPVUNIX0VER0VTLCB7IC4uLnRoaXMuc2VsZWN0RXZlbnREYXRhLCBkaXIgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIH07XHJcblxyXG4gIG9uRW5kTGlzdGVuZXIgPSAoZTogYW55KSA9PiB7XHJcbiAgICBpZiAoIXRoaXMuaW5pdGlhbEV2ZW50RGF0YSkgcmV0dXJuO1xyXG5cclxuICAgIHRoaXMucmVtb3ZlTW92ZUxpc3RlbmVyICYmIHRoaXMucmVtb3ZlTW92ZUxpc3RlbmVyKCk7XHJcbiAgICB0aGlzLnJlbW92ZUVuZExpc3RlbmVyICYmIHRoaXMucmVtb3ZlRW5kTGlzdGVuZXIoKTtcclxuICAgIHRoaXMucmVtb3ZlS2V5TGlzdGVuZXIgJiYgdGhpcy5yZW1vdmVLZXlMaXN0ZW5lcigpO1xyXG4gICAgdGhpcy5zZWxlY3RpbmcgPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdCBpblJvb3QgPSB0aGlzLm5vZGUuY29udGFpbnMoZS50YXJnZXQpO1xyXG5cclxuICAgIGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5nZXRFdmVudENvb3JkcyhlKTtcclxuICAgIGNvbnN0IGNsaWNrOiBib29sZWFuID0gdGhpcy5pc0NsaWNrKHgsIHkpO1xyXG5cclxuICAgIGlmIChlLmtleSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5lbWl0KEVWRU5UX1RZUEUuUkVTRVQsIHRoaXMuc2VsZWN0RXZlbnREYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2xpY2sgJiYgaW5Sb290KSByZXR1cm4gdGhpcy5vbkNsaWNrTGlzdGVuZXIoZSk7XHJcblxyXG4gICAgaWYgKCFjbGljaykgcmV0dXJuIHRoaXMuZW1pdChFVkVOVF9UWVBFLlNFTEVDVCwgdGhpcy5zZWxlY3RFdmVudERhdGEpO1xyXG4gIH07XHJcblxyXG4gIG9uQ2xpY2tMaXN0ZW5lciA9IChlOiBhbnkpID0+IHtcclxuICAgIGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5nZXRFdmVudENvb3JkcyhlKTtcclxuICAgIGNvbnN0IG5vdzogbnVtYmVyID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICBpZiAodGhpcy5sYXN0Q2xpY2tEYXRhICYmIG5vdyAtIHRoaXMubGFzdENsaWNrRGF0YSA8PSB0aGlzLmNsaWNrSW50ZXJ2YWwpIHtcclxuICAgICAgdGhpcy5sYXN0Q2xpY2tEYXRhID0gbnVsbDtcclxuICAgICAgcmV0dXJuIHRoaXMuZW1pdChFVkVOVF9UWVBFLkRCX0NMSUNLLCB7IHgsIHkgfSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmxhc3RDbGlja0RhdGEgPSBub3c7XHJcbiAgICByZXR1cm4gdGhpcy5lbWl0KEVWRU5UX1RZUEUuQ0xJQ0ssIHsgeCwgeSB9KTtcclxuICB9O1xyXG5cclxuICBwcml2YXRlIGdldEV2ZW50Q29vcmRzID0gKGU6IGFueSk6IEV2ZW50RGF0YSA9PiB7XHJcbiAgICBjb25zdCBjb29yZHM6IEV2ZW50RGF0YSA9IHtcclxuICAgICAgaXNUb3VjaDogZmFsc2UsXHJcbiAgICAgIHg6IGUucGFnZVgsXHJcbiAgICAgIHk6IGUucGFnZVksXHJcbiAgICB9O1xyXG4gICAgLyogaWYgKGUudG91Y2hlcyAmJiBlLnRvdWNoZXMubGVuZ3RoKSB7XHJcbiAgICAgIGNvb3Jkcy5pc1RvdWNoID0gdHJ1ZTtcclxuICAgICAgY29vcmRzLnggPSBlLnRvdWNoZXNbMF0ucGFnZVg7XHJcbiAgICAgIGNvb3Jkcy55ID0gZS50b3VjaGVzWzBdLnBhZ2VZO1xyXG4gICAgfSAqL1xyXG5cclxuICAgIC8qIHRyeSBuZXcgd2F5ID0pKSAqL1xyXG4gICAgZS50b3VjaGVzICYmXHJcbiAgICAgIGUudG91Y2hlcy5sZW5ndGggJiZcclxuICAgICAgKChjb29yZHMuaXNUb3VjaCA9IHRydWUpLCAoY29vcmRzLnggPSBlLnRvdWNoZXNbMF0ucGFnZVgpLCAoY29vcmRzLnkgPSBlLnRvdWNoZXNbMF0ucGFnZVkpKTtcclxuICAgIHJldHVybiBjb29yZHM7XHJcbiAgfTtcclxuXHJcbiAgaXNDbGljayA9IChjdXJyWDogbnVtYmVyLCBjdXJyWTogbnVtYmVyKTogYm9vbGVhbiA9PiB7XHJcbiAgICBjb25zdCB7IGlzVG91Y2gsIHgsIHkgfSA9IHRoaXMuaW5pdGlhbEV2ZW50RGF0YTtcclxuICAgIHJldHVybiAhaXNUb3VjaCAmJiBNYXRoLmFicyhjdXJyWCAtIHgpIDw9IHRoaXMuY2xpY2tUb2xlcmFuY2UgJiYgTWF0aC5hYnMoY3VyclkgLSB5KSA8PSB0aGlzLmNsaWNrVG9sZXJhbmNlO1xyXG4gIH07XHJcblxyXG4gIHRvdWNoRWRnZXMgPSAoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB7IHRvdWNoOiBib29sZWFuOyBkaXI6IHN0cmluZyB8IG51bGwgfSA9PiB7XHJcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuZ2V0Qm91bmRpbmdSZWN0KHRoaXMubm9kZSk7XHJcblxyXG4gICAgY29uc3QgYWZ0ZXJYOiBudW1iZXIgPSB4IC0gdGhpcy5vcmlnRGlzdGFuY2VGcm9tWFRvTm9kZTtcclxuICAgIGNvbnN0IGFmdGVyWTogbnVtYmVyID0geSAtIHRoaXMub3JpZ0Rpc3RhbmNlRnJvbVlUb05vZGU7XHJcblxyXG4gICAgaWYgKGFmdGVyWCA8IDApIHtcclxuICAgICAgcmV0dXJuIHsgdG91Y2g6IHRydWUsIGRpcjogRElSRUNUSU9OLkxFRlQgfTtcclxuICAgIH1cclxuICAgIGlmIChhZnRlclggKyB3aWR0aCA+IHRoaXMuY3VycmVudFdpbmRvd1dpZHRoKSB7XHJcbiAgICAgIHJldHVybiB7IHRvdWNoOiB0cnVlLCBkaXI6IERJUkVDVElPTi5SSUdIVCB9O1xyXG4gICAgfVxyXG4gICAgaWYgKGFmdGVyWSA8IDApIHtcclxuICAgICAgcmV0dXJuIHsgdG91Y2g6IHRydWUsIGRpcjogRElSRUNUSU9OLlRPUCB9O1xyXG4gICAgfVxyXG4gICAgaWYgKGFmdGVyWSArIGhlaWdodCA+IHRoaXMuY3VycmVudFdpbmRvd0hlaWdodCkge1xyXG4gICAgICByZXR1cm4geyB0b3VjaDogdHJ1ZSwgZGlyOiBESVJFQ1RJT04uQk9UVE9NIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4geyB0b3VjaDogZmFsc2UsIGRpcjogbnVsbCB9O1xyXG4gIH07XHJcblxyXG4gIGNhbGNHcmlkTW92ZW1lbnQgPSAoY3VyclBvc2l0aW9uOiBudW1iZXIpID0+IHtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKGN1cnJQb3NpdGlvbiAvIHRoaXMuZ3JpZE1vdmVtZW50KSAqIHRoaXMuZ3JpZE1vdmVtZW50O1xyXG4gIH07XHJcbiAgLyogaGFuZGxpbmcgZXZlbnQgKi9cclxuXHJcbiAgLyogSW5zcGlyZSBieSBFdmVudEVtaWl0ZXIsIHR1cm5zb3V0IGl0J3MgUHViU3ViIHBhdHRlcm4gKi9cclxuICBvbiA9ICh0eXBlOiBzdHJpbmcsIGhhbmRsZXI6IEZ1bmN0aW9uKTogeyBvZmY6IEZ1bmN0aW9uIH0gPT4ge1xyXG4gICAgbGV0IGlkeDogbnVtYmVyID0gKHRoaXMubGlzdGVuZXJzW3R5cGVdIHx8ICh0aGlzLmxpc3RlbmVyc1t0eXBlXSA9IFtdKSkucHVzaChoYW5kbGVyKSAtIDE7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBvZmYoKSB7XHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnNbdHlwZV0uc3BsaWNlKGlkeCwgMSk7XHJcbiAgICAgIH0sXHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG4gIGVtaXQgPSAodHlwZTogc3RyaW5nLCAuLi5hcmdzOiBhbnkpOiB2b2lkID0+IHtcclxuICAgICh0aGlzLmxpc3RlbmVyc1t0eXBlXSB8fCBbXSkuZm9yRWFjaCgoZm4pID0+IHtcclxuICAgICAgZm4oLi4uYXJncyk7XHJcbiAgICB9KTtcclxuICB9O1xyXG4gIC8qIEluc3BpcmUgYnkgRXZlbnRFbWlpdGVyLCB0dXJuc291dCBpdCdzIFB1YlN1YiBwYXR0ZXJuICovXHJcbn1cclxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXdCQTtBQTRCQTtBQUFBO0FBQUE7QUEzQkE7QUFDQTtBQUVBO0FBR0E7QUFvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBU0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUVBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFBQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXhSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQW1CQTtBQURBO0FBQ0E7QUFDQTtBQUNBOzs7QUFBQTtBQUVBO0FBQUE7QUFDQTtBQUNBOzs7QUFBQTtBQXFQQTtBQUFBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///0\n')}],[[0,1]]])}));
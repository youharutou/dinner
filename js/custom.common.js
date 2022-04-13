function c(val) {
    console.log(val);
}

function clearLetter(p) {
    var reg = /[^\d|.|-]/g;
    if (reg.test(p)) {
        p = p.replace(reg, "");
    }
    return Number(p);
}

function getTop(o) {
    var osTop = o.offsetTop;
    if (o.offsetParent != null) {
        osTop += getTop(o.offsetParent);
    }
    return osTop;
}

function getLeft(o) {
    var osLeft = o.offsetLeft;
    if (o.offsetParent != null) {
        osLeft += getLeft(o.offsetParent);
    }
    return osLeft;
}

function nextSibling(node){
	var tempObj = node.nextSibling;
	while (tempObj !== null && tempObj.nodeType != 1) {
		tempObj = tempObj.nextSibling;
	}
	return tempObj;
}

function clickEffect(target) {
    target.each(function() {
        this.addEventListener("touchstart", function() {
            $(this).addClass("active");
        }, false);
        this.addEventListener("touchend", function() {
            var _this = $(this);
            setTimeout(function() {
                _this.removeClass("active")
            }, 100);
        }, false);
    });
}

function liveEffect(selector) {
    $("body").on("touchstart", selector, function() {
        $(this).addClass("active");
    });
    $("body").on("touchend", selector, function() {
        var _this = $(this);
        setTimeout(function() {
            _this.removeClass("active")
        }, 100);
    });
}

function gestureSwitch(list, handle, fn, timer, autofn) {
    var ScoorX, ScoorY, EcoorX, oriLeft, i;
    var first = true;
    var bool = false;
    var direction = 0;//手势方向0为竖，1为横，默认为竖
    list.parent()[0].addEventListener("touchstart", function(event) {
        if (timer != undefined) {
            clearInterval(timer);
        }
        bool = list.is(":animated");
        if (!bool) {
            var touch = event.targetTouches[0];
            ScoorX = touch.clientX;
            ScoorY = touch.clientY;
            oriLeft = clearLetter(list.css("left"));
            i = list.find(".current").index();
        }
		event.stopPropagation();
    }, false);
    list.parent()[0].addEventListener("touchmove", function(event) {
        if (!bool) {
            var touch = event.changedTouches[0];
            if (first == true) {
                var FircoorX = touch.clientX;
                var FircoorY = touch.clientY;
                if (Math.abs(FircoorX - ScoorX) > Math.abs(FircoorY - ScoorY)) {//判断手势方向
                    direction = 1;//横向移动的距离比竖向大，设置手势方向为横
                    event.preventDefault();
                }
                first = false;
            }
            if (direction == 1) {
                if ((touch.clientX > ScoorX && i != 0) || (ScoorX > touch.clientX && i != list.children().length - 2)) {
                    list.css("left", oriLeft + touch.clientX - ScoorX);
                }
            }
        }
		event.stopPropagation();
    }, false);
    list.parent()[0].addEventListener("touchend", function(event) {
        if (!bool) {
            if (direction == 1) {
                var touch = event.changedTouches[0];
                EcoorX = touch.clientX;
                if (ScoorX > EcoorX && i != list.children().length - 2) {
                    fn(handle.eq(i + 1), list);
                }
                else if (ScoorX < EcoorX && i != 0) {
                    fn(handle.eq(i - 1), list);
                }
                else {
                    list.animate({left: oriLeft}, 300);
                }
            }
            direction = 0;//结束手势后，手势方向清零
            first = true;
        }
        bool = false;
        if (timer != undefined) {
            timer = setInterval(function() {
                autofn();
            }, 5000);
        }
		event.stopPropagation();
    }, false);
}

function showBottomLayer(box, maxW){
    var ScoorX, ScoorY, EcoorX, oriLeft, bool, active;
    var first = true;
    var direction = 0;//手势方向0为竖，1为横，默认为竖
    box[0].addEventListener("touchstart", function(event) {
        bool = box.is(":animated");
		active = box.hasClass("active");
        if (!bool) {
            var touch = event.targetTouches[0];
            ScoorX = touch.clientX;
            ScoorY = touch.clientY;
			oriLeft = clearLetter(box.css("left"));
        }
    }, false);
    box[0].addEventListener("touchmove", function(event) {
        if (!bool) {
            var touch = event.changedTouches[0];
            if (first == true) {
                var FircoorX = touch.clientX;
                var FircoorY = touch.clientY;
                if (Math.abs(FircoorX - ScoorX) > Math.abs(FircoorY - ScoorY)) {//判断手势方向
                    direction = 1;//横向移动的距离比竖向大，设置手势方向为横
                    event.preventDefault();
                }
				else {
					active && event.preventDefault();
				}
                first = false;
            }
            if (direction == 1) {
                if (!active && touch.clientX > ScoorX && touch.clientX - ScoorX < maxW) {
                    box.css("left", oriLeft + touch.clientX - ScoorX);
                }
				if (active && touch.clientX < ScoorX && ScoorX - touch.clientX < maxW) {
                    box.css("left", oriLeft + touch.clientX - ScoorX);
                }
            }
        }
    }, false);
    box[0].addEventListener("touchend", function(event) {
        if (!bool) {
            if (direction == 1) {
                var touch = event.changedTouches[0];
                EcoorX = touch.clientX;
                if (!active && ScoorX < EcoorX) {
                    box.animate({left: maxW}, 300, function(){
						box.addClass("active");
					});
                }
                else {
                    box.animate({left: 0}, 300, function(){
						box.removeClass("active");
					});
                }
            }
			else {
				active && box.animate({left: 0}, 300, function(){
						box.removeClass("active");
					});
			}
            direction = 0;//结束手势后，手势方向清零
            first = true;
        }
    }, false);
}
//タッチイベントの名前空間
function touch(){}
//touch.flag = [];
touch.before = [];
//タッチイベントの関連づけ関数
touch.init = function(id){
	qState.flag = true;
	jQuery("#" + id).bind("touchstart.touch", touchHandler.touchstartHandler);
	jQuery("#" + id).bind("touchmove.touch", touchHandler.touchmoveHandler);
	jQuery("#" + id).bind("touchend.touch", touchHandler.touchendHandler);
}
//タッチイベントの関連づけ解除関数
touch.terminate = function(id){
	for(var i=0;i<qState.question.select.length;i++){
		jQuery("#" + id + qState.question.select[i].name).unbind(".touch");
	}
}

//イベントハンドラの名前空間
function touchHandler(){}
//タッチ開始イベントハンドラ
touchHandler.touchstartHandler = function(e) {
	e.preventDefault();
	this.pageX = e.originalEvent.changedTouches[0].pageX;
	this.pageY = e.originalEvent.changedTouches[0].pageY;
	this.left = jQuery(this).position().left;
	this.top = jQuery(this).position().top;
	this.beginLeft = this.left;
	this.beginTop = this.top;
	this.touched = true;
	if(!this.first){
		this.first = true;
		this.firstTop = this.top;
		this.firstLeft = this.left;
	}
}
//タッチムーブイベントハンドラ
touchHandler.touchmoveHandler = function(e) {
	if (!this.touched) {
		return;
	}
	e.preventDefault();
	this.left = this.left - this.pageX + e.originalEvent.changedTouches[0].pageX;
	this.top = this.top - this.pageY + e.originalEvent.changedTouches[0].pageY;
	jQuery(this).css({left:this.left, top:this.top});
	this.pageX = e.originalEvent.changedTouches[0].pageX;
	this.pageY = e.originalEvent.changedTouches[0].pageY;
}
//タッチ終了イベントハンドラ
touchHandler.touchendHandler = function(e) {
	//alert('x:' + this.pageX + ' y:' + this.pageY);
	if (!this.touched) {
		return;
	}
	this.touched = false;
	//alert(flag);
	var ck = touch.positionCheck(this.pageX, this.pageY);
	//alert(flag[ck.num]);
	if(ck.flag){
		for(var i=0;i<touch.before.length;i++){
			if(touch.before[i] == this)
				touch.before[i] = null;
		}
		var pos = jQuery("#" + ck.obj).position();
		jQuery(this).css({"top" : pos.top+5, "left" : pos.left+5});
		if(touch.before[ck.num] != null){
			jQuery(touch.before[ck.num]).css({"top" : touch.before[ck.num].firstTop, "left" : touch.before[ck.num].firstLeft})
		}
		touch.before[ck.num] = this;
	}else{
		var ckb = touch.positionCheck(this.beginLeft, this.beginTop);
		if(ckb.flag){
			jQuery(this).css({"top" : this.firstTop, "left" : this.firstLeft});
			touch.before[ckb.num] = null
		}else{
			jQuery(this).css({"top" : this.beginTop, "left" : this.beginLeft});
		}
	}
}
//回答位置判断関数
touch.positionCheck = function(X, Y){
	for(var i=0;i<qState.qArea.length;i++){
		//alert(areaArray[i]);
		var obj = jQuery("#" + qState.qArea[i]);
		var top = obj.position().top;
		var left = obj.position().left;
		var bottom = obj.height() + top;
		var right = obj.width() + left;
		//alert('top:' + top + ' bottom:' + bottom + ' left:' + left + ' right:' + right);
		if((top) < Y && (bottom) > Y && (left) < X && (right) > X)
			return {flag : true, obj : qState.qArea[i], num : i};
	}
	return {flag : false, obj : null, num : null};
}

//問題格納名前空間
qState = {};
//回答語群の位置格納配列
qState.qArea = [];
qState.flag = false;
qState.rightAns = 0;

//getHTMLクラス
function getHttp(){
	//XMLHttpRequestオブジェクト生成
	this.createHttpRequest = function(){
		//Win ie用
		if(window.ActiveXObject){
			try{
				//MSXML2以降用
				return new ActiveXObject("Msxml2.XMLHTTP");
			}catch(e){
				try{
					//旧MSXML用
					return new ActiveXObject("Microsoft.XMLHTTP");
				}catch (e2){
					return null;
				}
			}
		}else if(window.XMLHttpRequest){
			//Win ie以外のXMLHttpRequestオブジェクト実装ブラウザ用
			return new XMLHttpRequest();
		}else{
			return null;
		}
	}

	//コールバック関数 (デバッグ用)
	this.on_loaded = function(oj){
		//レスポンスを取得
		var res	= oj.responseText;
		//レスポンスされた文字列をJavaScriptとして実行
		eval(res);
		//受け取った変数を使ってHTML文字列を作成
		alert("test");
	}

	//ファイルにアクセスし受信内容を確認します
	this.requestFile = function( data , method , fileName , id){
		//XMLHttpRequestオブジェクト生成
		var httpoj = this.createHttpRequest();
		httpoj.on_loded = this.on_loded;
		httpoj.id = id;
		//受信時に起動するイベント
		httpoj.onreadystatechange = function(){
			//readyState値は4で受信完了
			if (httpoj.readyState==4){
				//コールバック
				this.on_loded(httpoj, this.id);
			}
		}
		//open メソッド
		httpoj.open(method , fileName);
		//send メソッド
		httpoj.send( data );
	}
}

function mkHtml(){
	//継承
	getHttp.call(this);
	//コールバック関数(オーバーライド)
	this.on_loded = function(oj, id){
		//JSONをオブジェクトへ変換
		var res = oj.responseText;
		eval(res);
		qState.questions = questions;
		//問題の表示
		mkQuestions.mkquestion(questions,　id + "Q");
		//語群の表示
		mkQuestions.mkselect(id);
		//タッチイベントの関連づけ
		for(var i=0;i<touch.before.length;i++)
			touch.before[i] = null;
		var pos = [];
		for(var i=0;i<qState.question.select.length;i++){
			pos[i] = jQuery("#" + id + qState.question.select[i].name).position();
		}
		for(var i=0;i<qState.question.select.length;i++){
			touch.init(id + qState.question.select[i].name);
			jQuery("#" + id + qState.question.select[i].name).css({	"position" : 'absolute',
			 													"top" : pos[i].top,
			 													"left" : pos[i].left});
		}
		jQuery('#' + id + 'QB').hide();
		jQuery('#' + id + 'AB').show();
		jQuery('#' + id  + 'A')[0].innerHTML = '';
	}
}

function mkQuestions(){};
//問題表示関数
mkQuestions.mkquestion = function(oj, id){
	qState.qArea = [];
	var str = "";
	var bstr = "";
	var l = 0;
	qState.rand= Math.floor( Math.random()*oj.length);
	qState.question = oj[qState.rand];
	for(var i=0;i<oj[qState.rand].text.length;i++){
		if(i>0){
			str += "<br /><br />";
		}
		for(var j=0;j<oj[qState.rand].text[i].length;j++){
			var textStr = "";
			//alert(str);
			if(oj[qState.rand].text[i][j].word.match(/ +/)){
				qState.qArea[l++]= id + oj[qState.rand].text[i][j].name;
			}
			textStr += '<span id="' + id + oj[qState.rand].text[i][j].name + '">';
			textStr += oj[qState.rand].text[i][j].word.replace(/ /g, '&nbsp;') + '&nbsp;&nbsp;</span>';
			str += textStr;
			jQuery("#" + id)[0].innerHTML = str;
			var textObj = jQuery("#" + id + oj[qState.rand].text[i][j].name);
			if(jQuery(window).width() < (textObj.position().left + textObj.width())){
				str = bstr + "<br />" + textStr;
			}
			bstr = str;
		}
	}
	jQuery("#" + id)[0].innerHTML = str;
	//return str;
}

//選択肢表示関数
mkQuestions.mkselect = function(id){
	var str = "語群<br />";
	for(var i=0;i<qState.question.select.length;i++){
		str += '<span id="' + id + qState.question.select[i].name + '">';
		str += qState.question.select[i].word.replace(/ /g, '&nbsp;') + '</span>&nbsp;';
	}
	jQuery("#" + id + "S")[0].innerHTML = str;
	return str;
}

//回答名前空間
function answer(){}
//回答判定関数
answer.check = function(id){
	var ansArray = [];
	ansArray[0] = null;
	//alert(qState.question.select.length);
	for(var i=0;i<qState.question.select.length;i++){
		//alert(qState.question.select[i].name);
		var selectPos = jQuery("#" + id + qState.question.select[i].name).position();
		var selectCk = touch.positionCheck(selectPos.left, selectPos.top);
		//alert(selectCk.flag);
		if(selectCk.flag){
			ansArray[selectCk.num] = qState.question.select[i].name;
			//alert(selectCk.num);
		}
	}
	for(var i=0;i<qState.question.answerSelect.length;i++){
		if(ansArray[i] != qState.question.answerSelect[i]){
			return false;
		}
	}
	return true;
}

//回答表示関数
answer.mktext = function(id){
	touch.terminate(id);
	var str = "";
	//alert(answer.check());
	if(answer.check(id)){
		str += "正解<br />";
		qState.rightAns++;
	}else{
		str += "不正解<br />";
	}
	str += qState.question.answerText;
	jQuery("#" + id + "A")[0].innerHTML = str;
	jQuery('#' + id + 'AB').hide();
	jQuery('#' + id + 'QB').show();
}

//ページ遷移関数
function navigation(){}
navigation.movePractice = function(id){
	jQuery("#" + id + "QB").show();
	jQuery("#" + id + "AB").hide();
	jQuery("#" + id + "Q")[0].innerHTML = "";
	jQuery("#" + id + "A")[0].innerHTML = "";
	jQuery("#" + id + "S")[0].innerHTML = "";
	if(qState.flag)
		touch.terminate();
}

navigation.moveTest = function(id){
	jQuery("#" + id + "QB").show();
	jQuery("#" + id + "AB").hide();
	jQuery("#" + id + "RB").hide();
	jQuery("#" + id + "Title")[0].innerHTML = "試験";
	jQuery("#" + id + "Q")[0].innerHTML = "";
	qState.count = 0;
}

navigation.count = function(id){
	jQuery("#" + id + "RB").hide();
	jQuery("#" + id + "BB").hide();
	qState.count++;
	jQuery("#" + id + "Title")[0].innerHTML = "試験 " + qState.count + "/10";
}

navigation.countEnd = function(id){
	if(qState.count < 10)
		return;
	qState.count = 0;
	jQuery("#" + id + "QB").hide();
	jQuery("#" + id + "AB").hide();
	jQuery("#" + id + "RB").show();
	//jQuery("#" + id + "Title")[0].innerHTML = "試験";
}

navigation.result = function(id){
	qState.count = 0;
	jQuery("#" + id + "QB").show();
	jQuery("#" + id + "AB").hide();
	jQuery("#" + id + "RB").hide();
	jQuery("#" + id + "BB").show();
	jQuery("#" + id + "Q")[0].innerHTML = "正解数 " + qState.rightAns + "/10";
	jQuery("#" + id + "A")[0].innerHTML = "";
	jQuery("#" + id + "S")[0].innerHTML = "";
	qState.rightAns = 0;
	//jQuery("#" + id + "Title")[0].innerHTML = "試験";
}

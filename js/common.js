$(function (){
	
	var video = document.getElementsByTagName('video')[0];
			 
	var shotBtn = $("#shotBtn"), canvas = $("#resultImage canvas#result"), drawCanvas = $("canvas#drawCanvas"), ctx = null, b_ctx = null, mouseX = 0, mouseY =0, s_ctx = null, tab = $("p#tab");
	var brush = 0; //現在選択されているブラシのインデックス番号を代入
	var s_img = new Image();
	var stageWidth = $(window).width(), stageHeight = $(window).height(); 
	
	var audio = new Audio();
	audio.src = "sound/shutter_sound.mp3";
	//audio.volume = 0;
	
	//デバッグ消去
	//var debug = $("#debug")
	//debug.css("display","none");
	
	if(navigator.getUserMedia) {
		navigator.getUserMedia('video', successCallback, errorCallback);
		function successCallback( stream ) {
			video.src = stream;
			ctx = canvas.get(0).getContext("2d");
			ctx.setTransform(1.25,0,0,1.25,0,0);
			b_ctx = drawCanvas.get(0).getContext("2d");
			//シャッターのイメージを作成
			s_ctx = $("div#shutter canvas").get(0).getContext("2d");
			s_img.src = "img/shutter.jpg";
		}
		function errorCallback( error ) {
			//debug.text("An error occurred: [CODE " + error.code + "]");
		}
	} else {
		//debug.text("対応してないよ〜");
	}
	
	shotBtn.bind("click", function (){
		shotted();
		});
		
	function shotted () {
		ctx.drawImage(video, 0, 0);
		$("#resultImage").css({"display": "block"});
		$("#video").css({"display":"none"});
		audio.play();
		
		//シャッター処理
		var shutterCanvas = $("div#shutter canvas");
		$("div#shutter").css("z-index", 100);
		var shutterSpeed = 200, direction = true;
		var timer = setInterval(function (){
			if(!direction) {
				shutterSpeed+=40;
				if(shutterSpeed >= 200) {
					clearInterval(timer); 
					//　次の処理へ
					showMessageWindow();
				 }
			}else {
				shutterSpeed-=40;
				if(shutterSpeed <= 2) direction = false;
			}
				//描画
				s_ctx.clearRect(0,0,stageWidth,stageHeight);
				s_ctx.drawImage(s_img, 0, 0);
				//丸
				s_ctx.beginPath();
				s_ctx.fillStyle = "white";
				s_ctx.arc(stageWidth/2, stageHeight/2, shutterSpeed, 0, 360 * Math.PI / 180, true);
				s_ctx.fill();
				s_ctx.save();
				s_ctx.clip();
				s_ctx.drawImage(canvas.get(0), 0, 0);
				s_ctx.restore();

			}, 1000/30);
	}
		
	function showMessageWindow(){
		if(window.confirm('この写真でいいですか？')){
			drawStart();
		}
		else{
			$("div#shutter").css({"z-index":-1});
			$("#resultImage").css({"display": "none"});
			$("#video").css({"display":"block"});
		}
	}
	
	function drawStart () {
		$("div#shutter").css({"z-index":-1});
		//alert(video.videoWidth);
		shotBtn.unbind("click").remove();
		//ブラシを選択するためのパネルをスライドアップ表示
		brushPanel();
		}
	
	function brushPanel() {
		$("#brushPanel").css({"top":"155px"});
		//alert($("#brushPanel").css("top"));
		$("#brushPanel ul li img").bind("touchstart", function (){
			brush = $(this).get(0);
			$("#brushPanel").css({"top":stageHeight-40});
			draw();
		});
	}
	
	function draw () {
		tab.bind("touchstart", function (){
			$("#brushPanel").css({"top":"155px"});
		});
		drawCanvas.get(0).addEventListener("touchstart", touchDown, false);
	}
	
	function touchDown (event) {
		stump(event);
		//document.removeEventListener("touchstart", touchDown, false);
		drawCanvas.get(0).addEventListener("touchmove", touchMove, false);
	}
	function touchMove (event) {
		stump(event);
		drawCanvas.get(0).addEventListener("touchend", touchUp, false);
	}
	function touchUp (event) {
		drawCanvas.get(0).addEventListener("touchstart", touchDown, false);
		drawCanvas.get(0).removeEventListener("touchmove", touchMove, false);
	}
	
	function stump (e) {
		x = e.touches[0].pageX;
		y = e.touches[0].pageY;
		//debug.text(x+","+y);
		b_ctx.drawImage(brush, x-25, y-25);
    e.preventDefault();
	}
	
})


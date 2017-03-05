/*
 * obj: 操作的元素
 * attJson: json数据
 * endFn: 运动停止后，调用
 */
function startMove(obj, attJson, endFn) {
	clearInterval(obj.timer);

	var speed = 0; // 速度
	var currentValue = 0; // 需要操作属性的当前值
	var target = 0; // 目标点
	var isStop = true; // 时钟状态
	obj.timer = setInterval(function() {

		// 遍历修改对应属性
		for(key in attJson) {
			// 1、先获取到当前对应属性值
			if(key == 'opacity') {
				currentValue = parseInt(getStyle(obj, key) * 100);
			} else {
				currentValue = parseInt(getStyle(obj, key));
			}

			// 2、计算速度
			target = attJson[key]; // 101
			speed = (target - currentValue) / 7;
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

			// 3、修改对应属性值
			if(key == 'opacity') {
				obj.style.opacity = (currentValue + speed) / 100;
				obj.style.filter = 'alpha(opacity:' + (currentValue + speed) + ')';
			} else {
				obj.style[key] = currentValue + speed + 'px';
			}

			// 4、时钟是否停止
			//						if(currentValue == target){	// 停止条件
			//							isStop = true;
			//						}

			// width: 101   isStop: true
			/*
			 * width101 == 101   
			 * height102 != 300  false
			 * opacity31 != 100  false
			 * 
			 * ...
			 * 
			 * width101 == 101  
			 * height290 != 300  false
			 * opacity100 == 100 
			 * 
			 * width101 == 101
			 * height300 == 300 
			 * opacity100 == 100
			 */
			if(currentValue != target) {
				isStop = false;
			}
		}

		// 停止
		if(isStop) {
			clearInterval(obj.timer);

			// 回调函数
			if(endFn) {
				endFn();
			}
		}

	}, 30);
}

// 获取属性名对应的属性值
function getStyle(obj, att) {
	return window.getComputedStyle ? getComputedStyle(obj)[att] : obj.currentStyle[att];
}

/*********************轮播图*******************************/
$(function() {
	//控制图片下标
	var index = 0;
	//控制默认滚动效果开关
	var onOff = true;
	//默认自动滚动效果
	setInterval(function() {
			if(onOff) {
				index++;
				index = changeView(index);
			} else {
				return
			}
		}, 1500)
		//界面开关默认效果
	$('#carousel').mouseover(function() {
			$('#carousel span').css('display', 'block');
			onOff = false;
		}).mouseout(function() {
			$('#carousel span').css('display', 'none');
			onOff = true;
		})
		//添加上一张点击操作
	$('span[class=pre]').click(function() {

			if(index < 0) {
				index = 4;
			} else {
				index--;
			}
			changeView(index);
		})
		//添加下一张点击操作
	$('span[class=next]').click(function() {

			if(index > 4) {
				index = 0;
			} else {
				index++;
			}
			changeView(index);
		})
		//点击索引的操作
	$('#bt').delegate('li', 'click', function() {
			index = $(this).index();
			changeView(index);
		})
		//切换视图的函数
	function changeView(index) {
		//调整下标
		if(index < 0) {
			index = 4
		};
		if(index > 4) {
			index = 0
		};
		//动画效果
		$('#cont').animate({
			'left': -index * 790
		}, {
			duration: 800
		});
		//索引样式
		$('#bt li').eq(index).addClass('active').siblings().removeClass('active');
		return index;
	}
})

//              获取所有分类的数据

//$('#food').delegate('li', 'click', function() {
//	var request = null;
//	try {
//		request = new XMLHttpRequest();
//	} catch(e) {
//		request = new ActiveXObject('Microsoft.XMLHTTP');
//	}
//
//	request.open('get', 'json/goods.json', true);
//	request.send();
//
//	request.onreadystatechange = function() {
//		if(request.readyState == 4) {
//			if(request.status == 200) {
//				// 获取到数据  ---- 数据的解析
//				var data = JSON.parse(request.response);
//				// 遍历数组 
//		
//				for(var i = 0; i < data.length; i++) {
//					
//					
//					var temp = data[i]; // 取出数组中对应的元素
//					for(var j = 0; j < temp.length; j++) {
//						
//					
//					var op = document.createElement('p');
//					var ob = document.createElement('b');
//					var oa1= document.createElement('a');
//					var div=document.getElementsByClassName('menu')[0];
//					
//					oa1.innerHTML=temp[j].title;
//					div.appendChild(op);
//					op.appendChild(ob);
//					ob.appendChild(oa1);
//					var con = temp[j].con;
//					
//					
//					for(var k=0;k<con.length;k++){
//						
//						var oa2= document.createElement('a');
//						oa2.innerHTML=con[k].name;
//						
//					}
//					op.appendChild(oa2);
//				}
//			
//				}
//				
//			}
//		}
//	}
//
//})

//     获取所有分类的数据





//             1 获取品的数据

$(function() {

	if($('.wine-list2')) {
		$('.wine-list2').css('display', 'none');

	}
	if($('.wine-list3')) {
		$('.wine-list3').css('display', 'none');

	}

	if($('.wine-list4')) {
		$('.wine-list4').css('display', 'none');

	}

	$.ajax({
		type: "get",
		url: "json/hode.json",
		async: true,
		success: function(response) {
			var $ul = $('<div class="wine-list1"></div>');

			$(response).each(function(index, value) {

				var $a = $('<a href="#"></a>');
				var $img = $('<img />');
				$img.prop('src', response[index].src);

				$a.appendTo($ul);

				$ul.appendTo($('#commodity'));
				$a.append($img);

				//				var temp=response[index];
				//				console.log(temp.src);
			});

		},
		error: function(response) {
			alert("加载数据失败" + response.status)
		}
	});
});

//热销点击

$('#li1').click(function() {
	if($('.wine-list4')) {
		$('.wine-list4').css('display', 'none');

	};

	if($('.wine-list3')) {
		$('.wine-list3').css('display', 'none');

	};
	if($('.wine-list2')) {
		$('.wine-list2').css('display', 'none');

	};
	$('.wine-list1').css('display', 'block');

});

//             2 获取酒水的数据

$('#li2').click(function() {
	if($('.wine-list4')) {
		$('.wine-list4').css('display', 'none');

	}

	if($('.wine-list3')) {
		$('.wine-list3').css('display', 'none');

	}
	if($('.wine-list1')) {
		$('.wine-list1').css('display', 'none');

	}

	$.ajax({
		type: "get",
		url: "json/wine.json",
		async: true,
		success: function(response) {
			var $ul = $('<ul class="wine-list2"></ul>');

			$(response).each(function(index, value) {

				var $li = $('<li></li>');
				var $a = $('<a href="#"></a>');
				var $img = $('<img />');
				var $p = $('<p></p>');
				var $span = $('<span></span>');

				$img.prop('src', response[index].src);
				$span.html(response[index].price);
				$p.html(response[index].title);

				$ul.appendTo($('#commodity'));
				$li.appendTo($ul);
				$a.appendTo($li);
				$p.appendTo($li);
				$span.appendTo($li);
				$a.append($img);
			});

		},
		error: function(response) {
			alert("加载数据失败" + response.status)
		}
	});

});

//             4 获取营养品的数据

$('#li4').click(function() {

	if($('.wine-list2')) {
		$('.wine-list2').css('display', 'none');

	}
	if($('.wine-list3')) {
		$('.wine-list3').css('display', 'none');

	}
	if($('.wine-list1')) {
		$('.wine-list1').css('display', 'none');

	}

	$.ajax({
		type: "get",
		url: "json/nourishing.json",
		async: true,
		success: function(response) {
			var $ul = $('<ul class="wine-list4"></ul>');

			$(response).each(function(index, value) {

				var $li = $('<li></li>');
				var $a = $('<a href="#"></a>');
				var $img = $('<img />');
				var $p = $('<p></p>');
				var $span = $('<span></span>');

				$img.prop('src', response[index].src);
				$span.html(response[index].price);
				$p.html(response[index].title);

				$ul.appendTo($('#commodity'));
				$li.appendTo($ul);
				$a.appendTo($li);
				$p.appendTo($li);
				$span.appendTo($li);
				$a.append($img);

				//				var temp=response[index];
				//				console.log(temp.src);
			});

		},
		error: function(response) {
			alert("加载数据失败" + response.status)
		}
	});
});

//             3 获取营养品的数据
$('#li3').click(function() {

	if($('.wine-list2')) {
		$('.wine-list2').css('display', 'none');

	}
	if($('.wine-list4')) {
		$('.wine-list4').css('display', 'none');

	}
	if($('.wine-list1')) {
		$('.wine-list1').css('display', 'none');

	}

	$.ajax({
		type: "get",
		url: "json/witer.json",
		async: true,
		success: function(response) {
			var $ul = $('<ul class="wine-list3"></ul>');

			$(response).each(function(index, value) {

				var $li = $('<li></li>');
				var $a = $('<a href="#"></a>');
				var $img = $('<img />');
				var $p = $('<p></p>');
				var $span = $('<span></span>');

				$img.prop('src', response[index].src);
				$span.html(response[index].price);
				$p.html(response[index].title);

				$ul.appendTo($('#commodity'));
				$li.appendTo($ul);
				$a.appendTo($li);
				$p.appendTo($li);
				$span.appendTo($li);
				$a.append($img);
			});

		},
		error: function(response) {
			alert("加载数据失败" + response.status)
		}
	});
});

//                    侧边栏的按钮操作

$('#bt2>li').eq(0).hover(function() {
		$(this).children('div').css('right', 40);
	},

	function() {
		$(this).children('div').css('right', -66);
	})

$('#bt2>li').eq(1).hover(function() {
		$(this).children('div').css('right', 40);
	},

	function() {
		$(this).children('div').css('right', -66);
	})

$('#bt2>li').eq(2).hover(function() {
		$(this).children('div').css('right', 40);
	},

	function() {
		$(this).children('div').css('right', -66);
	}
)

$('#bt2>li').eq(3).hover(function() {
		$(this).children('div').css('right', 40);
	},

	function() {
		$(this).children('div').css('right', -66);
	})

$('#bt2>li').eq(4).hover(function() {
		$(this).children('div').css('right', 40);
	},

	function() {
		$(this).children('div').css('right', -66);
	}

)
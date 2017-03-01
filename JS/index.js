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
				var isStop = true;	// 时钟状态
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
						target = attJson[key];	// 101
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
						if(currentValue != target){
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
				var index=0;
				//控制默认滚动效果开关
				var onOff=true;
				//默认自动滚动效果
				setInterval(function(){
					if(onOff){
						index++;
						index=changeView(index);
					}else{
						return
					}
				},1500)
				//界面开关默认效果
				$('#carousel').mouseover(function(){
					$('#carousel span').css('display','block');
					onOff=false;
				}).mouseout(function(){
					$('#carousel span').css('display','none');
					onOff=true;
				})
				//添加上一张点击操作
				$('span[class=pre]').click(function(){
					
					if(index<0){
						index=4;
					}else{
						index--;
					}
					changeView(index);
				})
				//添加下一张点击操作
				$('span[class=next]').click(function(){		
					
					if(index>4){
						index=0;
					}else{
						index++;
					}
					changeView(index);
				})
				//点击索引的操作
				$('#bt').delegate('li','click',function(){
					index=$(this).index();
					changeView(index);
				})
				//切换视图的函数
				function changeView(index){
					//调整下标
					if(index<0){index=4};
					if(index>4){index=0};
					//动画效果
					$('#cont').animate({
						'left': -index*790
					}, {
						duration: 800
					});
					//索引样式
					$('#bt li').eq(index).addClass('active').siblings().removeClass('active');
					return index;
				}
			})
		

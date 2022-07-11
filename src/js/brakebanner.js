class BrakeBanner{
	constructor(selector){
		// 初始化root PIXI应用，将舞台设置为1920x1080
		this.app = new PIXI.Application({
			width: window.innerWidth,
			height: window.innerHeight,
			backgroundColor: 0xffffff,
			resizeTo: window
		});
		// 设置全局的粒子变量颜色数组
		let particles = [];
		let speed = 0;
		
		// 挂载pixi应用
		document.querySelector(selector).appendChild(this.app.view);
		this.stage = new PIXI.Container();
		this.app.stage.appendChild(this.stage);
		
		// 创建加载器实例
		this.loader = new PIXI.Loader();
		// 创建舞台stage 将图片插入到画布至stage
		const satge = app.stage;
		// 加载器加载图片
		loader.add('btn.png', 'images/btn.png');
		loader.add('btn_circle.png', 'images/btn_circle.png');
		loader.add('brake_bike.png', 'images/brake_bike.png');
		loader.add('brake_handlerbar.png', 'images/brake_handlerbar.png');
		loader.add('brake_lever.png', 'images/brake_lever.png');
		
		// 加载器调用加载
		this.loader.load();
		// loader加载器监听onComplete
		this.loader.onComplete.add(() => {
			// show展示车的整体以及刹车按下效果等的整体封装
			this.show();
		});
		
		const show = () => {
			// 创建刹车、车架、图片插入画布stage
			const bikeLever = new PIXI.Sprite(this.loader.resources.brake_lever.texture);
			const bikeContainer = createBikeContainer(bikeLever);
			stage.addChild(bikeContainer);
			// 创建按钮
			const actionBtn = creatActionBtn();
			actionBtn.x = window.innerWidth - 200;
			actionBtn.y = 500;
			// 刹车按钮添加进画布
			stage.addChild(actionBtn);
			// 使按钮具备交互能力
			actionBtn.interactive = true;
			// 给按钮添加pointer样式
			actionBtn.buttonMode = true;
			// 按钮注册监听鼠标按下事件
			actionBtnon.on('mousedown', () => {
				bikeLever.rotation = Math.PI / 180 * -30;
				// 添加GSAP动效
				gsap.to(bikeLever, {
					duration: .6, rotation: Math.PI / 180 * -30
				});
				// 鼠标按下运动暂停 speed为0
				pause();
				speed = 0;
			});
			// 按钮注册监听鼠标按键弹起事件
			actionBtnon.on('mouseup', () => {
				gsap.to(bikeLever, {
					duration: .6, rotation: 0
				});
				// 鼠标按下弹起运动继续
				start();
			});
			// 创建粒子效果
			createParticles();
			// 粒子运动
			start();
		}
		
		// 创建车架的工厂函数
		const createBikeContainer = bikeLever => {
			// 图片的放置的顺序会影响层级 即先加进去的在最底层
			const bikeContainer = new PIXI.Container();
			// 对车架以及把手整体进行缩放
			bikeContainer.scale.x = bikeContainer.scale.y = .3;
			const bikeImg = new PIXI.Sprite(this.loader.resources.brake_bike.texture);
			bikeContainer.addChild(bikeImg);
			// 添加刹车
			bikeContainer.addChild(bikeLever);
		    // 调整刹车中心点
			bikeLever.pivot.x = bikeLever.pivot.y = 455;
			bikeLever.x = 722;
			bikeLever.y = 900;
			// 创建车手把
			const bikeHandlerBar = new PIXI.Sprite(this.loader.resources.brake_handlerbar.texture);
			// 添加车手把
			bikeContainer.addChild(bikeHandlerBar);
			// 创建调整函数 使车子一直展示在画布的右下角
			const reSize = () => {
				bikeContainer.x = window.innerWidth - bikeContainer.width;
				bikeContainer.y = window.innerHeight - bikeContainer.height;
			}
			// 监听reSize
			window.addEventListener('reSize', reSize);
			// 调用reSize
			reSize();
			return bikeContainer;
		}
		// 创建按钮的工厂函数
		const creatActionBtn = () => {
			// 创建按钮容器
			const btnContainer = new PIXI.Container();
			btnContainer.x = btnContainer.y = 200;
			// 按钮以及外层两个黄圈
			const actBtn = new PIXI.Sprite(this.loader.resources.btn.texture); 
			const circle = new PIXI.Sprite(this.loader.resources.btn_circle.texture); 
			const circle2 = new PIXI.Sprite(this.loader.resources.btn_circle.texture); 
			// 依次添加进按钮容器
			btnContainer.addChild(actBtn);
			btnContainer.addChild(circle);
			btnContainer.addChild(circle2);
		    // 调整按钮中心点位置
			actBtn.pivot.x = actBtn.pivot.y = actBtn.width / 2;
			circle.pivot.x = circle.pivot.y = circle.width / 2;
			circle2.pivot.x = circle2.pivot.y = circle2.width / 2;
			// 对按钮进行整体缩放
			actBtn.scale.x = actBtn.scale.y = .8;
			// 给按钮的外层圈圈 加载动效
			gsap.to(circle.scale, { duration: 1, x: 1.3, y: 1.3, repeat: -1 });
			gsap.to(circle, { duration: 1, x: 1.1, y: 1.1, repeat: -1 });
			return btnContainer;
		}
		// 创建粒子工厂函数
		const createParticles = () => {
			// 创建粒子
			const particleContainer = new PIXI.Container();
			stage.addChild(particleContainer);
			// 将粒子容器旋转35° 并且调整中心点
			particleContainer.rotation = 35 * Math.PI / 180;
			particleContainer.pivot.x = window.innerWidth / 2;
			particleContainer.pivot.y = window.innerHeight / 2;
			// 创建多种颜色的粒子
			createParticleColors(particleContainer);
		}
		const createParticleColors = (particleContainer) => {
			// 设置颜色数组
			const colorList = [0xf1cf54, 0xb5cea8, 0x8182f];
			for (let i = 0; i < 10; i++) {
				// 获取画笔
				const gr = new PIXI.Graphics();
				gr.beginFill(colorList[Math.floor(Math.random() * colorList.length)]);
				// 绘制粒子
				gr.drawCircle(0, 0, 10);
				gr.scale.x = gr.scale.y = .4;
				gr.endFill();
				const parItem = {
					sx: Math.random() * window.innerWidth,
					sy: Math.random() * window.innerHeight,,
					gr
				};
				gr.x = parItem.sx;
				gr.y = parItem.sy;
				particleContainer.addChild(gr);
				particles.push(parItem);
			}
		}
		// 粒子持续移动 并且在大于20的时候开始变形，通过改变粒子的 x, y的大小调整线条以及增加视觉的颗粒感
		const loop () => {
			speed +=.5;
			speed = Math.min(speed, 20);
			for (let i = 0; i < particles.length; i++) {
				const parItem = particles[i];
				parItem.gr.y += speed;
				if (speed >= 20) {
					parItem.gr.scale.y = 20;
					// 粒子颗粒感
					parItem.gr.scale.x = .05;
				}
				
				// 超出边界来回继续移动
				if (parItem.gr.y > window.innerHeight) {
					parItem.gr.y = 0;
				}
			}
		}
		
		// 粒子开始运动函数
		const start = () => {
			speed = 0;
			loop();
			gsap.ticker.add(loop);
		}
		
		// 按住鼠标时remove loop
		const pause = () => {
			// 移除 requestAnimationFrame的侦听
			gsap.ticker.remve(loop);
			for (let i = 0; i < particles.length; i++) {
				const parItem = particles[i];
				// 恢复粒子拉伸
				parItem.gr.scale.y = parItem.gr.scale.x = 1;
				// 恢复粒子透明度
				parItem.gr.alpha = 1;
				// 给粒子增加回弹效果
				gsap.to(parItem.gr, { duration: .6, x: parItem.sx, y: parItem.sy, ease: 'elastic.out' });
			}
		}
	}
}

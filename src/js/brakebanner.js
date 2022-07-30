class BrakeBanner{
	constructor(selector){
		// 初始化root PIXI应用，将舞台设置为1920x1080
		this.app = new PIXI.Application({
			width: window.innerWidth,
			height: window.innerHeight,
			backgroundColor: 0xffffff,
			resizeTo: window
		});
		// 挂载pixi应用
		document.querySelector(selector).appendChild(this.app.view);

		// 创建加载器实例
		this.loader = new PIXI.Loader();
		// 创建舞台stage 将图片插入到画布至stage
		const satge = this.app.stage;
		// 加载器加载图片 imgName 为静态资源的名称 imgPath为静态资源的相对路径
		const bikeList = [
			{
				imgName: 'btn.png',
				imgPath: 'images/btn.png'
			},
			{
				imgName: 'btn_circle.png',
				imgPath: 'images/btn_circle.png'
			},
			{
				imgName: 'brake_bike.png',
				imgPath: 'images/brake_bike.png'
			},
			{
				imgName: 'brake_handlerbar.png',
				imgPath: 'images/brake_handlerbar.png'
			},
			{
				imgName: 'brake_lever.png',
				imgPath: 'images/brake_lever.png'
			},
		];
		bikeList.forEach(_imgItem => {
			this.loader.add(_imgItem.imgName, _imgItem.imgPath);
		});
		
		// 加载器调用加载
		this.loader.load();
		// loader加载器监听onComplete
		this.loader.onComplete.add(() => {
			console.log('onComplete:');
			// show展示车的整体以及刹车按下效果等的整体封装
			this.show(bikeList);
		});
	}
	show(res){
		// 创建刹车、车架、图片插入画布stage
		const bikeLever = new PIXI.Sprite(this.loader.resources['brake_lever.png'].texture);
		const bikeContainer = this.createBikeContainer(bikeLever);
		this.app.stage.addChild(bikeContainer);
		// 创建按钮
		const actionBtn = this.creatActionBtn();
		actionBtn.x = window.innerWidth - 500;
		actionBtn.y = 550;
		
		// 使按钮具备交互能力
		actionBtn.interactive = true;
		// 给按钮添加pointer样式
		actionBtn.buttonMode = true;
		// 按钮注册监听鼠标按下事件
		actionBtn.on('mousedown', () => {
			// 鼠标按下运动暂停 speed为0
			this.pauseMove();
			bikeLever.rotation = Math.PI / 180 * -30;
			// 添加GSAP动效
			gsap.to(bikeLever, {
				duration: .6, rotation: Math.PI / 180 * -30
			});
			gsap.to(bikeContainer, {
				duration: .6, alpha: 1
			});
		});
		// 按钮注册监听鼠标按键弹起事件
		actionBtn.on('mouseup', () => {
			// 鼠标按下弹起运动继续
			this.startMove();
			gsap.to(bikeLever, {
				duration: .6, rotation: 0
			});
			gsap.to(bikeContainer, {
				duration: .6, alpha: 0.5
			});
		});

		// 创建调整函数 使车子一直展示在画布的右下角
		const reSize = () => {
			bikeContainer.x = window.innerWidth - bikeContainer.width;
			bikeContainer.y = window.innerHeight - bikeContainer.height;
		}
		// 监听reSize
		window.addEventListener('reSize', reSize);
		// 调用reSize
		reSize();
		// 创建粒子效果
		this.createParticles();
		this.app.stage.addChild(actionBtn);
	}
	
	// 创建车架的工厂函数
	createBikeContainer(bikeLever) {
		// 图片的放置的顺序会影响层级 即先加进去的在最底层
		const bikeContainer = new PIXI.Container();
		const bikeSprite = new PIXI.Sprite(this.loader.resources['brake_bike.png'].texture);
		const bikeHandlerbarSprite = new PIXI.Sprite(this.loader.resources['brake_handlerbar.png'].texture);
		bikeContainer.scale.x = bikeContainer.scale.y = 0.5;
		bikeContainer.alpha = 0.6;
		// 对车架以及把手整体进行缩放
		bikeContainer.scale.x = bikeContainer.scale.y = .3;
		// 添加车Jia 刹车 车手把
		bikeContainer.addChild(bikeSprite);
		bikeContainer.addChild(bikeLever);
		bikeContainer.addChild(bikeHandlerbarSprite);
		// 调整刹车中心点
		bikeLever.pivot.x = bikeLever.pivot.y = 455;
		bikeLever.x = 722;
		bikeLever.y = 900;
		return bikeContainer;
	}
	// 创建按钮的工厂函数
	creatActionBtn() {
		// 创建按钮容器
		const btnContainer = new PIXI.Container();
		btnContainer.x = btnContainer.y = 200;
		// 按钮以及外层两个黄圈
		const actBtn = new PIXI.Sprite(this.loader.resources['btn.png'].texture); 
		const circle = new PIXI.Sprite(this.loader.resources['btn_circle.png'].texture); 
		const circle2 = new PIXI.Sprite(this.loader.resources['btn_circle.png'].texture); 
		// 依次添加进按钮容器
		btnContainer.addChild(actBtn);
		btnContainer.addChild(circle);
		btnContainer.addChild(circle2);
		// 调整按钮中心点位置
		actBtn.pivot.x = actBtn.pivot.y = actBtn.width / 2;
		circle.pivot.x = circle.pivot.y = circle.width / 2;
		circle2.pivot.x = circle2.pivot.y = circle2.width / 2;
		// 对按钮进行整体缩放
		actBtn.scale.x = actBtn.scale.y = .7;
		// 给按钮的外层圈圈 加载动效
		gsap.to(circle.scale, { duration: 1, x: 1.3, y: 1.3, repeat: -1 });
		gsap.to(circle, { duration: 1, x: 1.1, y: 1.1, repeat: -1 });
		return btnContainer;
	}
	// 创建粒子工厂函数
	createParticles() {
		// 设置全局speed、粒子数组particles
		let speed = 0;
		const particles = [];
		// 创建粒子
		const particleContainer = new PIXI.Container();
		this.app.stage.addChild(particleContainer);
		// 将粒子容器旋转35° 
		particleContainer.rotation = 35 * Math.PI / 180;
		// 并且调整粒子旋转点
		particleContainer.pivot.x = window.innerWidth / 2;
		particleContainer.pivot.y = window.innerHeight / 2;
		// 并且调整中心点
		particleContainer.x = window.innerWidth / 2;
    	particleContainer.y = window.innerHeight / 2;
		// 创建多种颜色的粒子
		this.createParticleColors(particleContainer);
		// 粒子持续移动 并且在大于30的时候开始变形，通过改变粒子的 x, y的大小调整线条以及增加视觉的颗粒感
		const loop = () => {
			speed += 0.5;
			speed = Math.min(speed, 30);
			for (let i = 0; i < particles.length; i++) {
				const parItem = particles[i];
				parItem.gr.y += speed;
				// 转换成线的流动感觉
				if (speed >= 30) {
					// 通过y放大，x缩小来达到像素点的效果
					parItem.gr.scale.y = 35;
					// 粒子颗粒感
					parItem.gr.scale.x = 0.05;
				}
				
				// 超出边界来回继续移动
				if (parItem.gr.y > window.innerHeight) {
					parItem.gr.y = 0;
				}
			}
		}

		// 粒子开始运动函数
		const start = () => {
			// 添加循环动画
			speed = 0;
			gsap.ticker.add(loop);
		}
		
		// 按住鼠标时remove loop
		const pause = () => {
			speed = 0;
			// 移除 requestAnimationFrame的侦听
			gsap.ticker.remove(loop);
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
		start();
		this.startMove = start;
		this.pauseMove = pause;
	}
	createParticleColors(particleContainer) {
		const particles = [];
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
				sy: Math.random() * window.innerHeight,
				gr
			};
			gr.x = parItem.sx;
			gr.y = parItem.sy;
			particles.push(parItem);
			particleContainer.addChild(gr);
		}
	}
}

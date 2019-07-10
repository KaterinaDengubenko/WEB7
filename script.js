var canvas, ctx, balls, idTimer, idAcceleration;
		function getRandomInRange(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
		function getRandomFloatInRange(min, max) {
			return Math.random() * (max - min + 1) + min;
		}

		// класс Фигура
		function TFigure(pX,pY, moveDir) {
			this.posX = pX; //позиция фигуры по X
			this.posY = pY; //позиция фигуры по Y
			//цвет, формируется случайным образом
			this.col = 'rgb('+getRandomInRange(100, 256)+','
			+getRandomInRange(100, 256)+','+getRandomInRange(100, 256)+')';
			// случайная скорость
			this.speed = getRandomInRange(2, 6);
			// ускорение
			
			// скорость роста
			this.growSpeed = 1.005;
			// тип фигуры
			this.typeOfFig = "none";
			// направления движения
			this.moveUp = false;
			this.moveDown = false;
			this.moveRight = false;
			this.moveLeft = false;
			this.changeDir(moveDir);
		};

		TFigure.prototype.changeDir = function(dir) {
			with (this) {
				moveUp = false;
				moveDown = false;
				moveRight = false;
				moveLeft = false;
				if (dir == "up") {
					moveUp = true;
				}
				if (dir == "down") {
					moveDown = true;
				}
				if (dir == "right") {
					moveRight = true;
				}
				if (dir == "left") {
					moveLeft = true;
				}
			}
		};

		


		// класс шарика
		function TBall(pX,pY, moveDir) {
			//вызов конструктора родителя
			TFigure.apply(this, arguments);
			this.typeOfFig = "ball";
			this.r = getRandomInRange(5,25);
		};
		// наследование от фигуры
		TBall.prototype = Object.create(TFigure.prototype);

		TBall.prototype.check_pop = function(){
			// рисуем шарик на canvas
			with (this){
				if (r > 40) {
					return true;
				}
				else {
					return false;
				}
			}
		};

		

		

		TBall.prototype.draw = function(ctx){
			// рисуем шарик на canvas
			with (this){
				ctx.fillStyle = colorBall(ctx);
				ctx.beginPath();
				ctx.arc(posX, posY, r, 0, 2*Math.PI, false);
				ctx.closePath();
				ctx.fill();
			}
		};

		
		

		
		
		

		var moveUp = false;
		var moveDown = false;
		var moveLeft = false;
		var moveRight = false;
		var moveRandom = false;
		var moveChaotic = false;
		function drawBack(ctx,col1,col2,w,h){
			// закрашиваем канвас градиентным фоном
			ctx.save();
			var g = ctx.createLinearGradient(0,0,0,h);
			g.addColorStop(1,col1);
			g.addColorStop(0,col2);
			ctx.fillStyle = g;
			ctx.fillRect(0,0,w,h);
			ctx.restore();
		}
		// инициализация работы
		function init(){
			canvas = document.getElementById('canvas');
			if (canvas.getContext){
				ctx = canvas.getContext('2d');
				//рисуем фон
				drawBack(ctx,'#202020','#aaa',canvas.width,canvas.height);
				//создаем 10 шариков, заносим их в массив
				items = [];
				for (var i = 1; i<=10;i++){
					var item = new TBall(10+Math.random()*(canvas.width-30),
					10+Math.random()*(canvas.height-30), "none");
					item.changeCoordinates();
					item.draw(ctx);
					items.push(item);
				}
				for (var i = 1; i<=10;i++){
					var item = new TRec(10+Math.random()*(canvas.width-30),
					10+Math.random()*(canvas.height-30), "none");
					item.changeCoordinates();
					item.draw(ctx);
					items.push(item);
				}
				for (var i = 1; i<=10;i++){
					var item = new TTri(10+Math.random()*(canvas.width-30),
					10+Math.random()*(canvas.height-30), "none");
					item.changeCoordinates();
					item.draw(ctx);
					items.push(item);
				}
			}
		}
		// создаем новый шарик по щелчку мыши, добавляем его в массив шариков и рисуем его
		function goInput(event){
			var x = event.clientX;
			var y = event.clientY;
			var moveDir = "none";
			if (moveUp) {
				moveDir = "up";
			}
			if (moveDown) {
				moveDir = "down";
			}
			if (moveRight) {
				moveDir = "right";
			}
			if (moveLeft) {
				moveDir = "left";
			}
			if (moveRandom) {
				var rand = getRandomInRange(0, 3);
				if (rand == 0) {
					moveDir = "up";
				}
				if (rand == 1) {
					moveDir = "down";
				}
				if (rand == 2) {
					moveDir = "right";
				}
				if (rand == 3) {
					moveDir = "left";
				}
			}
			var rand = getRandomInRange(0, 2);
			if (rand == 0) {
				var item = new TBall(x, y, moveDir);
			}
			else if (rand == 1) {
				var item = new TRec(x, y, moveDir);
			}
			else {
				var item = new TTri(x, y, moveDir);
			}
			
			item.draw(ctx);
			items.push(item);
		}

		function disableGlobalMoving() {
			moveUp = false;
			moveDown = false;
			moveLeft = false;
			moveRight = false;
			moveRandom = false;
			moveChaotic = false;
		}

		function f_clPoint_point_line(pX, pY, x0, y0, x1, y1) {
			let answer = (y0 - y1) * pX + (x1 - x0) * pY;
			answer += (x0 * y1 - x1 * y0);
			answer = answer / (Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2))); 
			return answer;
		}

		// функция для пересечения линий
		function area (x1, y1, x2, y2, x3, y3) {
			return (x2 - x1) * (y2 - y1) - (y2 - y1) * (x3 - x1);
		}
 		
 		// функция для пересечения линий
		function intersect_1 (a, b, c, d) {
			if (a > b) {
				let temp = a;
				a = b;
				b = temp;
			}  //swap (a, b);
			if (c > d) {
				let temp = c;
				c = d;
				d = temp;
			}  //swap (c, d);
			return Math.max(a,c) <= Math.min(b,d);
		}
 
 		function checkColl_line_line (x1, y1, x2, y2, x3, y3, x4, y4) {
			return intersect_1 (x1, x2, x3, x4)
				&& intersect_1 (y1, y2, y3, y4)
				&& Math.round(area(x1, y1, x2, y2, x3, y3)) * Math.round(area(x1, y1, x2, y2 , x4, y4)) <= 0
				&& area(x3, y3, x4, y4, x1, y1) * area(x3, y3, x4, y4, x2, y2) <= 0;
		}

		function checkColl_ball_ball (ball1, ball2) {
			if (Math.sqrt(Math.pow(ball1.posX - ball2.posX, 2) + Math.pow(ball1.posY - ball2.posY, 2)) <= (ball1.r + ball2.r)){
				return true;
			}
			else {
				return false;
			} 
		}

		function checkColl_ball_rect (ball, rect) {
			// нахождение расстояния от центра шара до сторон прямоугольника
			let a1 = f_clPoint_point_line(ball.posX, ball.posY, rect.x1, rect.y1, rect.x2, rect.y2);
			let a2 = f_clPoint_point_line(ball.posX, ball.posY,  rect.x2, rect.y2, rect.x3, rect.y3);
			let a3 = f_clPoint_point_line(ball.posX, ball.posY,  rect.x3, rect.y3, rect.x4, rect.y4);
			let a4 = f_clPoint_point_line(ball.posX, ball.posY,  rect.x4, rect.y4, rect.x1, rect.y1);
			// нахождение минимального расстояния и проверка на пересечение
			let min = Math.min(a1, a2, a3, a4);
			if (Math.abs(min) <= ball.r) {
				return true;
			}
			else return false;
		}

		function checkColl_ball_tri (ball, tri) {
			let a1 = f_clPoint_point_line(ball.posX, ball.posY, tri.x1, tri.y1, tri.x2, tri.y2);
			let a2 = f_clPoint_point_line(ball.posX, ball.posY,  tri.x2, tri.y2, tri.x3, tri.y3);
			let a3 = f_clPoint_point_line(ball.posX, ball.posY,  tri.x3, tri.y3, tri.x1, tri.y1);
			let min = Math.min(a1, a2, a3);
			if (Math.abs(min) <= ball.r) {
				return true;
			}
			else return false;
		}

		function checkColl_rect_line (rect, x1, y1, x2, y2) {
			if (checkColl_line_line(rect.x1, rect.y1, rect.x2, rect.y2, x1, y1, x2, y2)){
				return true;
			}
			else if (checkColl_line_line(rect.x2, rect.y2, rect.x3, rect.y3, x1, y1, x2, y2)){
				return true;
			}
			else if (checkColl_line_line(rect.x3, rect.y3, rect.x4, rect.y4, x1, y1, x2, y2)){
				return true;
			}
			else if (checkColl_line_line(rect.x4, rect.y4, rect.x1, rect.y1, x1, y1, x2, y2)){
				return true;
			}
			else return false;
		}

		function checkColl_rect_tri (rect, tri) {
			if (checkColl_rect_line(rect, tri.x1, tri.y1, tri.x2, tri.y2)){
				return true;
			}
			else if (checkColl_rect_line(rect, tri.x2, tri.y2, tri.x3, tri.y3)){
				return true;
			}
			else if (checkColl_rect_line(rect, tri.x3, tri.y3, tri.x1, tri.y1)){
				return true;
			}
			else return false;
		}

		function checkColl_tri_line (tri, x1, y1, x2, y2) {
			if (checkColl_line_line(tri.x1, tri.y1, tri.x2, tri.y2, x1, y1, x2, y2)){
				return true;
			}
			else if (checkColl_line_line(tri.x2, tri.y2, tri.x3, tri.y3, x1, y1, x2, y2)){
				return true;
			}
			else if (checkColl_line_line(tri.x3, tri.y3, tri.x1, tri.y1, x1, y1, x2, y2)){
				return true;
			}
			else return false;
		}

		function checkColl_tri_tri (tri1, tri2) {
			if (checkColl_tri_line(tri1, tri2.x1, tri2.y1, tri2.x2, tri2.y2)){
				return true;
			}
			else if (checkColl_tri_line(tri1, tri2.x2, tri2.y2, tri2.x3, tri2.y3)){
				return true;
			}
			else if (checkColl_tri_line(tri1, tri2.x3, tri2.y3, tri2.x1, tri2.y1)){
				return true;
			}
			else return false;
		}

		function checkColl_rect_line (rect, x1, y1, x2, y2) {
			if (checkColl_line_line(rect.x1, rect.y1, rect.x2, rect.y2, x1, y1, x2, y2)){
				return true;
			}
			else if (checkColl_line_line(rect.x2, rect.y2, rect.x3, rect.y3, x1, y1, x2, y2)){
				return true;
			}
			else if (checkColl_line_line(rect.x3, rect.y3, rect.x4, rect.y4, x1, y1, x2, y2)){
				return true;
			}
			else if (checkColl_line_line(rect.x4, rect.y4, rect.x1, rect.y1, x1, y1, x2, y2)){
				return true;
			}
			else return false;
		}

		function checkColl_rect_rect (rect1, rect2) {
			if (checkColl_rect_line(rect1, rect2.x1, rect2.y1, rect2.x2, rect2.y2)){
				return true;
			}
			else if (checkColl_rect_line(rect1, rect2.x2, rect2.y2, rect2.x3, rect2.y3)){
				return true;
			}
			else if (checkColl_rect_line(rect1, rect2.x3, rect2.y3, rect2.x4, rect2.y4)){
				return true;
			}
			else if (checkColl_rect_line(rect1, rect2.x4, rect2.y4, rect2.x1, rect2.y1)){
				return true;
			}
			else return false;
		}

		function check_collusion(item1, item2) {
			let check;

			if (item1.typeOfFig == "ball") {
				if (item2.typeOfFig == "ball") {
					check = checkColl_ball_ball(item1, item2);
				}
				if (item2.typeOfFig == "rectangle") {
					check = checkColl_ball_rect(item1, item2);
				}
				if (item2.typeOfFig == "triangle") {
					check = checkColl_ball_tri(item1, item2);
				}
			}

			if (item1.typeOfFig == "rectangle") {
				if (item2.typeOfFig == "ball") {
					check = checkColl_ball_rect(item2, item1);
				}
				if (item2.typeOfFig == "rectangle") {
					check = checkColl_rect_rect(item1, item2);
				}
				if (item2.typeOfFig == "triangle") {
					check = checkColl_rect_tri(item1, item2);
				}
			}

			if (item1.typeOfFig == "triangle") {
				if (item2.typeOfFig == "ball") {
					check = checkColl_ball_tri(item2, item1);
				}
				if (item2.typeOfFig == "rectangle") {
					check = checkColl_rect_tri(item2, item1);
				}
				if (item2.typeOfFig == "triangle") {
					check = checkColl_tri_tri(item1, item2);
				}
			}
			return check;
		}

		function moveItems(){
			//реализация движения шариков, находящихся в массиве items
			drawBack(ctx,'#202020','#aaa',canvas.width,canvas.height);
			for (let i = 0; i < items.length;i){
				if (moveChaotic) {
					rand = getRandomInRange(0, 3);
					if (rand == 0) {
						items[i].changeDir("up");
					}
					else if (rand == 1) {
						items[i].changeDir("down");
					}
					else if (rand == 2) {
						items[i].changeDir("right");
					}
					else {
						items[i].changeDir("left");
					}
				}
				items[i].grow();
				if (items[i].check_pop()) {
					items.splice(i,1);
				}
				else {
					items[i].changeCoordinates();
					if (items[i].typeOfFig != "ball") {
						items[i].update_tops();
					}
					if ((items[i].posX > canvas.width) || (items[i].posX < 0) || 
						(items[i].posY > canvas.height) ||(items[i].posY < 0)) 
						items.splice(i,1);
					else {
						let check = false;
						for (let j = 0; j < items.length; j++){
							if ((i != j) && (check_collusion(items[i], items[j]))){
								if (j < i){
									items.splice(i,1);
									items.splice(j,1);
									i--;
								}
								else {
									items.splice(j,1);
									items.splice(i,1);
								}
								check = true;
								break;
							}
						}
						if (!check)
							i++;
					}
						
				}
			}
			for (var i = 0; i < items.length; i++)
				items[i].draw(ctx);
		}

		
		

		function move(){
			clearInterval(idTimer);
			idTimer = setInterval('moveItems();',50);
		}
		
		
		function setMoveUp(){
			disableGlobalMoving();
			moveUp = true;
			for (var i = 0; i < items.length; i++){
				items[i].changeDir("up");
			}
			move();
		}

		function setMoveDown(){
			disableGlobalMoving()
			moveDown = true;
			for (var i = 0; i < items.length; i++){
				items[i].changeDir("down");
			}
			move();
		}

		function setMoveLeft(){
			disableGlobalMoving();
			moveLeft = true;
			for (var i = 0; i < items.length; i++){
				items[i].changeDir("left");
			}
			move();
		}

		function setMoveRight(){
			disableGlobalMoving();
			moveRight = true;
			for (var i = 0; i < items.length; i++){
				items[i].changeDir("right");
			}
			move();
		}

		function setMoveChaotic(){
			disableGlobalMoving();
			moveChaotic = true;
			move();
		}

		function setMoveRandom(){
			disableGlobalMoving();
			moveRandom = true;
			var rand = 0;
			for (var i = 0; i < items.length; i++){
				rand = getRandomInRange(0, 3);
				if (rand == 0) {
					items[i].changeDir("up");
				}
				else if (rand == 1) {
					items[i].changeDir("down");
				}
				else if (rand == 2) {
					items[i].changeDir("left");
				}
				else {
					items[i].changeDir("right");
				}
			}
			move();
		}


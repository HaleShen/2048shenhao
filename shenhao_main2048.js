var board = new Array();
var score = 0;
var hasMerged = new Array();
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function(){
	prepareForMobile();
	newGame();
})

function prepareForMobile(){
	if(documentWidth > 500){
		gridContainerWidth = 500;
		cellSideLength = 100;
		cellSpace = 20;
	}
	
	$("#grid-container").css("width", gridContainerWidth - 2 * cellSpace);
	$("#grid-container").css("height", gridContainerWidth - 2 * cellSpace);
	$("#grid-container").css("padding", cellSpace);
	$("#grid-container").css("border-radius", 0.02 * gridContainerWidth);
	
	$(".grid-cell").css("width", cellSideLength);
	$(".grid-cell").css("height", cellSideLength);
	$(".grid-cell").css("border-radius", 0.02 * cellSideLength);
}

function newGame(){
	//初始化棋盘格
	initGame(); 
	//在随机的两个格子中生成数字
	generateOneNumber(); 
	generateOneNumber();
}

function initGame(){
	//将小方块以4*4的阵型排列
	for(i = 0;i < 4;i ++){
		for(var j = 0;j < 4;j ++){
			  var gridCell = $("#grid-cell-"+ i +"-"+ j);
			  gridCell.css("top", getPosTop(i,j));
			  gridCell.css("left", getPosLeft(i,j));
		}
	}
	
	for(var i = 0;i < 4;i ++){
		board[i] = new Array();
		hasMerged[i] = new Array();
		for(var j = 0;j < 4;j ++){
			board[i][j] = 0; 
			hasMerged[i][j] = false;
		}
	}
	
	updateBoardView();
	
	score = 0;
	$("#score").text( score );
}

/*
 *用户在操作棋盘的时候都是在改变board里面的值，
 *在操作的时候通过调用该函数来通知前端，board这个二维数组里面的值发生了改变，前端相应的显示number-cell也要发生改变
 */
function updateBoardView(){
	//删除旧的number-cell
	$(".number-cell").remove();
	for( var i = 0;i < 4;i ++ ){
		for( var j = 0;j < 4;j ++ ){
			//根据当前board的值添加新的number-cell，即整个number-cell重新渲染一遍
			$("#grid-container").append("<div class = 'number-cell' id = 'number-cell-"+i+"-"+j+"'></div>");
			var getNumberCell = $("#number-cell-"+i+"-"+j);
			
			if( board[i][j] == 0 ){
				getNumberCell.css('width','0px');
                getNumberCell.css('height','0px');
				getNumberCell.css("top", getPosTop(i,j) + cellSideLength/2);
				getNumberCell.css("left", getPosLeft(i,j) + cellSideLength/2);
			}else{	
				getNumberCell.css("width", cellSideLength);
				getNumberCell.css("height", cellSideLength);
				getNumberCell.css("top", getPosTop(i,j));
				getNumberCell.css("left", getPosLeft(i,j));
				getNumberCell.css("backgroundColor", getNumberBackgroundColor( board[i][j] ));
				getNumberCell.css("color", getNumberColor( board[i][j] ));
				getNumberCell.text( board[i][j] ); 
			}
			
			hasMerged[i][j] = false;
		}
	}
	
	$(".number-cell").css("lineHeight", cellSideLength + "px");
	$(".number-cell").css("fontSize", 0.6 * cellSideLength + "px"); 
	
}

function generateOneNumber(){
	if( noSpace( board ) ){
		return false;
	}else{
		//随机一个位置
		var randx = parseInt( Math.floor( Math.random()*4 ) );
		var randy = parseInt( Math.floor( Math.random()*4 ) );
		//检查随机的位置可不可用
		var times = 0;
        while( times < 50 ){
        if( board[randx][randy] == 0 )
            break;

        randx = parseInt( Math.floor( Math.random()  * 4 ) );
        randy = parseInt( Math.floor( Math.random()  * 4 ) );

        times ++;
        }
        if( times == 50 ){
            for( var i = 0 ; i < 4 ; i ++ )
                for( var j = 0 ; j < 4 ; j ++ ){
                    if( board[i][j] == 0 ){
                        randx = i;
                        randy = j;
                }
            }
        }
		
		//随机一个数字
		var randNumber = Math.random() < 0.5 ? 2 : 4;
		//在随机位置显示随机数字
		board[randx][randy] = randNumber;
		showNumberWithAnimation( randx, randy, randNumber );
		return true;
	}
}

$(document).keydown( function( event ){
	switch( event.keyCode ){
		case 37: //left
		    event.preventDefault();//按键原本的默认效果
		    if( moveLeft() ){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
		    break;
		case 38: //up
		    event.preventDefault();
		    if( moveUp() ){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
            break;
        case 39: //right
		    event.preventDefault();
		    if( moveRight() ){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
            break;
        case 40: //down
		    event.preventDefault();
		    if( moveDown() ){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
            break;
        default: //default
            break;		
	}
} )

document.addEventListener("touchstart", function( event ){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
})

document.addEventListener("touchend", function( event ){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;
	
	var deltax = endx - startx;
	var deltay = endy - starty;
	
	if( Math.abs( deltax ) < 0.3*documentWidth && Math.abs( deltay ) < 0.3*documentWidth){
		return;
	}
	
	if( Math.abs( deltax ) >= Math.abs( deltay )){
		//move x
		if( deltax > 0 ){
			//move right
			if( moveRight() ){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}			
		}else{
			//move left
			if( moveLeft() ){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
		}
	}else{
		//move y
		if( deltay > 0){
			//move down
			if( moveDown() ){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
		}else{
			//move up
			if( moveUp() ){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
		}
	}
})

function isGameOver(){
	if( noSpace( board ) && noMove( board ) ){
		alert("Game Is Over!!");
	}
}

function moveLeft(){
	if( !canMoveLeft( board ) ){
		return false;
	}

	for( var i = 0;i < 4;i ++ ){
		for( var j = 1;j < 4;j ++ ){
			if( board[i][j] != 0 ){
				for( var k = 0;k < j;k ++ ){
					if( board[i][k] == 0 && noBlockHorizontal( i, k, j, board ) ){
						//move
						showMoveAnimation( i, j, i, k );
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if( board[i][k] == board[i][j] && noBlockHorizontal( i, k, j, board ) && !hasMerged[i][k] ){
						//move				
						showMoveAnimation( i, j, i, k );
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[i][k];
						updateScoreView( score );
						
						hasMerged[i][k] = true;
						continue;
					}
				}
			}
		}
	}
	
	//以上操作只是修改了board里面的值，还需要调用upadteBoardView对整个前端进行重置
	setTimeout("updateBoardView()", 200);
	return true;
}

function moveUp(){
	if( !canMoveUp( board ) ){
		return false;
	}
	//moveup
	for( var j = 0;j < 4;j ++ ){
		for( var i = 1;i < 4;i ++ ){
			if( board[i][j] != 0 ){
				for( var k = 0;k < i;k ++ ){
					if( board[k][j] == 0 && noBlockVertical( j, k, i, board ) ){
						//move
						showMoveAnimation( i, j, k, j );
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if( board[k][j] == board[i][j] && noBlockVertical( j, k, i, board ) && !hasMerged[k][j]){
						//move
						showMoveAnimation( i, j, k, j );
						//add
						board[k][j] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[k][j];
						updateScoreView( score );
						
						hasMerged[k][j] = true;
						continue;
					}
				}
			}
		}
	}
	
	setTimeout("updateBoardView()", 200);
	return true;
}

function moveRight(){
	if( !canMoveRight( board ) ){
		return false;
	}
	//moveright
	for( var i = 0;i < 4;i ++ ){
		for( var j = 2;j >= 0;j -- ){
			if( board[i][j] != 0 ){
				for( var k = 3;k > j;k -- ){
					if( board[i][k] == 0 && noBlockHorizontal( i, j, k, board ) ){
						//move
						showMoveAnimation( i, j, i, k );
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if( board[i][k] == board[i][j] && noBlockHorizontal( i, j, k, board ) && !hasMerged[i][k] ){
						//move						
						showMoveAnimation( i, j, i, k );
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[i][k];
						updateScoreView( score );
						
						hasMerged[i][k] = true;
						continue;
					}
				}
			}
		}
	}
	
	setTimeout("updateBoardView()", 200);
	return true;
}

function moveDown(){
	if( !canMoveDown( board ) ){
		return false;
	}
	//movedown
	for( var j = 0;j < 4;j ++ ){
		for( var i = 2;i >= 0;i -- ){
			if( board[i][j] != 0 ){
				for( var k = 3;k > i;k -- ){
					if( board[k][j] == 0 && noBlockVertical( j, i, k, board ) ){
						//move
						showMoveAnimation( i, j, k, j );
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if( board[k][j] == board[i][j] && noBlockVertical( j, i, k, board ) && !hasMerged[k][j]){
						//move
						showMoveAnimation( i, j, k, j );
						//add
						board[k][j] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[k][j];
						updateScoreView( score );
						
						hasMerged[k][j] = true;
						continue;
					}
				}
			}
		}
	}
	
	setTimeout("updateBoardView()", 200);
	return true;
}

documentWidth = window.screen.availWidth; //当前设备屏幕中可以使用的宽度
gridContainerWidth = 0.92 * documentWidth; //定义游戏大方块的宽度
cellSideLength = 0.18 * documentWidth; //定义小方块的边长
cellSpace = 0.04 * documentWidth; //定义每个小方块之间的距离

function getPosTop( i, j ){
	return cellSpace + ( cellSpace + cellSideLength )*i;
}

function getPosLeft( i, j ){
	return cellSpace + ( cellSpace + cellSideLength )*j;
}

function getNumberBackgroundColor( number ){
	switch( number ){
		case 2: return "#eee4da";break;
		case 4: return "#ede0c8";break;
		case 8: return "#f2b179";break;
		case 16: return "#f59563";break;
		case 32: return "#f67c5f";break;
		case 64: return "#f65e3b";break;
		case 128: return "#edcf72";break;
		case 256: return "#edcc61";break;
		case 512: return "#9c0";break;
		case 1024: return "#33b5e5";break;
		case 2048: return "#09c";break;
		case 4096: return "#a6c";break;
		case 8192: return "#93c";break;		
	}
	return "black";
}

function getNumberColor( number ){
	if( number <= 4 ){
		return "#776e65";
	}else{
		return "white";
	}
}

//检查棋盘格里面还有没有空间生成随机数字
function noSpace( board ){
	for(var i = 0;i < 4;i ++){
		for(var j = 0;j < 4;j ++){
			if(board[i][j] == 0){
				return false;
			}; 
		}
	}
	return true;
}

function canMoveLeft( board ){
	for( var i = 0;i < 4;i ++ ){
		for( var j = 1;j < 4;j ++ ){
			//当前board[i][j]里面的值不为零，那么就有可能可以向左移动
			if( board[i][j] != 0 ){
				if( board[i][j-1] == 0 || board[i][j-1] == board[i][j]){
					return true;
				}
			}
		}
	}
	return false;
}

function canMoveUp( board ){
	for( var i = 1;i < 4;i ++ ){
		for( var j = 0;j < 4;j ++ ){
			//当前board[i][j]里面的值不为零，那么就有可能可以向上移动
			if( board[i][j] != 0 ){
				if( board[i-1][j] == 0 || board[i-1][j] == board[i][j]){
					return true;
				}
			}
		}
	}
	return false;
}

function canMoveRight( board ){
	for( var i = 0;i < 4;i ++ ){
		for( var j = 0;j < 3;j ++ ){
			//当前board[i][j]里面的值不为零，那么就有可能可以向右移动
			if( board[i][j] != 0 ){
				if( board[i][j+1] == 0 || board[i][j+1] == board[i][j]){
					return true;
				}
			}
		}
	}
	return false;
}

function canMoveDown( board ){
	for( var i = 0;i < 3;i ++ ){
		for( var j = 0;j < 4;j ++ ){
			//当前board[i][j]里面的值不为零，那么就有可能可以向下移动
			if( board[i][j] != 0 ){
				if( board[i+1][j] == 0 || board[i+1][j] == board[i][j]){
					return true;
				}
			}
		}
	}
	return false;
}

function noBlockHorizontal( row, col1, col2, board ){
	for( var i = col1 + 1;i < col2;i ++ ){
		if( board[row][i] != 0){
			return false;
		}
	}
	return true;
}

function noBlockVertical( col, row1, row2, board ){
	for( var i = row1 + 1;i < row2;i ++ ){
		if( board[i][col] != 0){
			return false;
		}
	}
	return true;
}

function noMove( board ){
	if( canMoveLeft( board ) || canMoveUp( board ) || canMoveRight( board ) || canMoveDown( board )){
		return false;
	}
	
	return true;
}
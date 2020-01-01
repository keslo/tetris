import React, { Component }  from 'react';
import './App.css';
import initialState from './state/initialState'
import Header from './components/Header'
import Board from './components/Board'
import Brick from './components/Brick'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
    	...initialState
    }
  }

  collide = (dX, dY, piece) => {
    let { board, posX, posY, width, height } = this.state
    for (let iY=0; iY<piece.length;iY++) {
      for (let iX=0; iX<piece[iY].length; iX++) {
        // если пустая ячейка, то идем дальше
        if (piece[iY][iX] === 0) continue ;
        // вычисляем текущую координату элемента фигуры
        let x = posX + dX + iX;
        let y = posY + dY + iY;
        // проверяем на выход за края
        if (x < 0 || x > width-1 || y >= height) return 'true height';
        // если отрицательный Y, то норм
        if (y <= 0) continue;
        // проверяем переполнение фигур по вертикали
        if (board[y][x] === 1) return 'true board';
      }
    }
    return 'false';
  }


  draw = () => {
    let { board, posX, posY, piece } = this.state;
    let temp = JSON.parse(JSON.stringify(board)); 
    for (var y=0; y<piece.length; y++) {
      for (var x=0; x<piece[y].length; x++) {
        if (temp[y+posY] !== undefined) {
          if (temp[y+posY][x+posX] !== undefined) {
            temp[y+posY][x+posX] = board[y+posY][x+posX] ? 1 : piece[y][x];
          } 
        }
      }
    }
    this.setState({ temp });
  }

  down = () => {
    let { posY, piece, temp, step } = this.state
    let isCollade = this.collide(0, 1, piece);
    if (isCollade === 'false') {
      this.setState({ posY: ++posY, step: ++step });
    } else {
      if (posY < 1) {
        clearInterval(this.timerId);
        this.setState({ btnText: 'New Game?', gameOver: true });
        alert('GAME OVER');
      } else {
        this.setState({ posY: 0, board: [...temp], posX: 4 });
        this.getPiece();
      }
    }
  }

  move = (e) => {
    let { piece, posX } = this.state;
    let dX = 0;
    if (e.keyCode === '37' ) { // Left
      dX = -1;
    } else if (e.keyCode === '39') { // Right
      dX = 1;
    }
    var isCollide = this.collide(dX, 0, piece);
    if (isCollide === 'false') {
      this.setState({ posX: posX+dX });
    }
  }

  check = () => {
    var { board, height, score } = this.state;
    var emptyRow = new Array(10).fill('1').join('');
    var incScore = 0;
    var newBoard = board.filter((el) => {
      return el.join('') !== emptyRow;
    })
    while (newBoard.length < height) {
      newBoard.unshift(new Array(10).fill(0));
      incScore++;
    }
    this.setState({ board: newBoard, score: score+incScore });
  }

  rotate = (e) => {
    if (e.keyCode === '38' ) { // Up
      e.preventDefault();
      var { pieceVar, pieceType, pieces } =  this.state;
      var newVar = ++pieceVar % pieces[pieceType].length;
      if (this.collide(0, 0, pieces[pieceType][newVar]) === 'false') {
        this.setState({ pieceVar: newVar, piece: pieces[pieceType][newVar] });
      }
    }
  }

  getPiece = () => {
    var { pieces } = this.state;
    var pieceType = Math.round((pieces.length-1) * Math.random());
    var pieceVar  = Math.round((pieces[pieceType].length-1) * Math.random());
    this.setState({ pieceType, pieceVar, piece: pieces[pieceType][pieceVar] });
  }

  start = () => {
    var { width, height } = this.state;
    if (this.timerId === undefined || this.state.gameOver === true) {
      this.getPiece();
      this.setState({ gameOver: false, board: JSON.parse(JSON.stringify(new Array(height).fill(new Array(width).fill(0)))) });
      this.timerId = setInterval( () => {
        this.down();
        this.draw();
        this.check();
     }, 200);
    }
    this.setState({ btnText: 'GO!' });
  }

  componentDidMount = () => {
    // инициализация действий клавиатуры
    document.addEventListener('keydown', (e) => {
      this.move(e);
      this.rotate(e);
      this.draw();
    })
    this.draw();
    console.log(this.collide);
  }

  render() {
    var { temp, score, btnText } = this.state;
    var html = temp.map((row,i) => {
      return <div className="row" key={i}>
        { row.map((col, j) => <Brick fill={ col } key={ j } /> ) }
      </div>
    })
    return (
      <div className="App">
        <Header score={ score } btnText={ btnText } start={ this.start } />
        <Board html={ html }/>
      </div>
    )
  }
}

export default App;

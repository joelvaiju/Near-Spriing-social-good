import { Contract } from 'near-api-js';
import React from 'react';
import '../snake/snake.scss'
import Big from 'big.js';

const SUGGESTED_DONATION = '0';
const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();


  // utility functions
function shallowEquals(arr1, arr2) {
    if (!arr1 || !arr2 || arr1.length !== arr2.length) return false;
    let equals = true;
    for (var i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) equals = false;
    }
    return equals;
  }
  
  function arrayDiff(arr1, arr2){
    return arr1.map((a, i)=>{ 
      return a - arr2[i]
    })
  }
  
  // display a single cell
  function GridCell(props) {
    const classes = `grid-cell 
  ${props.foodCell ? "grid-cell--food" : ""} 
  ${props.snakeCell ? "grid-cell--snake" : ""}
  `;
    return (
      <div
        className={classes}
        style={{ height: props.size + "px", width: props.size + "px" }}
        />
    );
  }
  
  
  class Snake extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        snake: [],
        food: [],
       
        status: 0,
        
        direction: 39
      };
      this.disablebtn = this.props.disablebtn;
      this.moveFood = this.moveFood.bind(this);
      this.checkIfAteFood = this.checkIfAteFood.bind(this);
      this.startGame = this.startGame.bind(this);
      this.endGame = this.endGame.bind(this);
      this.moveSnake = this.moveSnake.bind(this);
      this.doesntOverlap = this.doesntOverlap.bind(this);
      this.setDirection = this.setDirection.bind(this);
      this.removeTimers = this.removeTimers.bind(this);
    }
     
    // randomly place snake food
    moveFood() {
     
      if (this.moveFoodTimeout) clearTimeout(this.moveFoodTimeout)
      const x = parseInt(Math.random() * this.numCells);
      const y = parseInt(Math.random() * this.numCells);
      this.setState({ food: [x, y] });
      this.moveFoodTimeout = setTimeout(this.moveFood, 5000)
    }
  
    setDirection({ keyCode }) {
     
      let changeDirection = true;
      [[38, 40], [37, 39]].forEach(dir => {
        if (dir.indexOf(this.state.direction) > -1 && dir.indexOf(keyCode) > -1) {
          changeDirection = false;
        }
      });
  
      if (changeDirection) this.setState({ direction: keyCode });
    }
  
    moveSnake() {
      const newSnake = [];
      
      switch (this.state.direction) {
          // down
        case 40:
          newSnake[0] = [this.state.snake[0][0], this.state.snake[0][1] + 1];
          break;
          // up
        case 38:
          newSnake[0] = [this.state.snake[0][0], this.state.snake[0][1] - 1];
          break;
          // right
        case 39:
          newSnake[0] = [this.state.snake[0][0] + 1, this.state.snake[0][1]];
          break;
          // left
        case 37:
          newSnake[0] = [this.state.snake[0][0] - 1, this.state.snake[0][1]];
          break;
                                  }
     
      [].push.apply(
        newSnake,
        this.state.snake.slice(1).map((s, i) => {
          
          return this.state.snake[i];
        })
      );
  
      this.setState({ snake: newSnake });
  
      this.checkIfAteFood(newSnake);
      if (!this.isValid(newSnake[0]) || !this.doesntOverlap(newSnake)) {
        // end the game
        this.endGame()
      } 
    }
  
    checkIfAteFood(newSnake) {
      if (!shallowEquals(newSnake[0], this.state.food)) return
        // snake gets longer
        let newSnakeSegment;
        const lastSegment = newSnake[newSnake.length - 1];
  
        let lastPositionOptions = [[-1, 0], [0, -1], [1, 0], [0, 1]];
        
        
        if ( newSnake.length > 1 ) {
          lastPositionOptions[0] = arrayDiff(lastSegment, newSnake[newSnake.length - 2]);
        }
  
        for (var i = 0; i < lastPositionOptions.length; i++) {
          newSnakeSegment = [
            lastSegment[0] + lastPositionOptions[i][0],
            lastSegment[1] + lastPositionOptions[i][1]
          ];
          if (this.isValid(newSnakeSegment)) {
            break;
          }
        }
  
        this.setState({
          snake: newSnake.concat([newSnakeSegment]),
          food: []
        });
      this.moveFood();
    }
    
    // is the cell's position inside the grid?
    isValid(cell) {
      return (
        cell[0] > -1 &&
        cell[1] > -1 &&
        cell[0] < this.numCells &&
        cell[1] < this.numCells
      );
    }
  
    doesntOverlap(snake) {
      return (
        snake.slice(1).filter(c => {
          return shallowEquals(snake[0], c);
        }).length === 0
      );
    }
  
    startGame() {

     

      this.removeTimers();
      this.moveSnakeInterval = setInterval(this.moveSnake, 130);
      this.moveFood();
  
      this.setState({
        status: 1,
        snake: [[5, 5]],
        food: [10, 10]
      });
      //need to focus so keydown listener will work!
      this.el.focus();
    }
    
    endGame(){
      
      this.removeTimers();
      this.setState({
        status : 2
      })

      let obj =  { "score" : this.state.snake.length, "account_id" : window.accountId }
       
      window.contract.update_snake_game_stats(obj
      ,
        BOATLOAD_OF_GAS,
        Big(0).times(10 ** 24).toFixed()
      ).then(() => {
        
        contract.get_ticket_per_user({ account_id: window.accountId })
        .then(response => {
         
         
          if(parseInt(response)>0){
           
            this.disablebtn = true;
            
          }else{
            
            this.disablebtn = false;
          }

        })
      })

    }
  
    removeTimers() {
      if (this.moveSnakeInterval) clearInterval(this.moveSnakeInterval);
      if (this.moveFoodTimeout) clearTimeout(this.moveFoodTimeout)
    }
  
    componentWillUnmount() {
      this.removeTimers();
    }
  
    render() {
      // each cell should be approximately 15px wide, so calculate how many we need
      this.numCells = Math.floor(this.props.size / 15);
      const cellSize = this.props.size / this.numCells;
      const cellIndexes = Array.from(Array(this.numCells).keys());
      const cells = cellIndexes.map(y => {
        return cellIndexes.map(x => {
          const foodCell = this.state.food[0] === x && this.state.food[1] === y;
          let snakeCell = this.state.snake.filter(c => c[0] === x && c[1] === y);
          snakeCell = snakeCell.length && snakeCell[0];
  
          return (
            <GridCell
              foodCell={foodCell}
              snakeCell={snakeCell}
              size={cellSize}
              key={x + " " + y}
              />
          );
        });
      });
  
      let overlay;
      if (this.state.status === 0) {
        overlay = (
          <div className="snake-app__overlay">
            <button disabled={!this.disablebtn} onClick={this.startGame}>Start game!</button>
          </div>
        );
      } else if (this.state.status === 2) {
        overlay = (
          <div className="snake-app__overlay">
            <div className="mb-1"><b>GAME OVER!</b></div>
            <div className="mb-1">Your score: {this.state.snake.length} </div>
            <button disabled={!this.disablebtn} onClick={this.startGame}>Start a new game</button>
          </div>
        );
      }
      return (
          <>

          <div id="snake">
        <div
          className="snake-app"
          onKeyDown={this.setDirection}
          style={{
            width: this.props.size + "px",
              height: this.props.size + "px"
          }}
          ref={el => (this.el = el)}
          tabIndex={-1}
          >
          {overlay}
          <div
            className="grid"
            style={{
              width: this.props.size + "px",
                height: this.props.size + "px"
            }}
            >
            {cells}
          </div>
        </div>
        </div>
        </>
      );
    }
  }

 export default Snake;
  
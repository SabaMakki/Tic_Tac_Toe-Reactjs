import React from 'react'
import Grid from "@mui/material/Grid";
import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function App() {
  return (
    <div>
      <Container >
        <Game />
      </Container>
     
    </div>
  )
}

export default App
const theme = createTheme({
   palette: {
    primary: {
      main: '#B983FF',
    },
    secondary: {
      main: '#C9B6E4',
     
    },
  },
}); 
function Square(props) {
  return (
      <ThemeProvider theme={theme}>
        <Button className="btn"
          variant="contained"
          color="primary"
        disableElevation
         onClick={props.onClick}>
         {props.value}
        </Button>
      </ThemeProvider>
   
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
     return (
      <div>
         <Grid className="board" container direction="column" spacing={1.3} >   
          <Grid item >
            <Stack direction="row"  spacing={1.3}>
                {this.renderSquare(0)} {this.renderSquare(1)} {this.renderSquare(2)}
            </Stack>            
          </Grid>
          <Grid item>
            <Stack  direction="row" spacing={1.3}>
                {this.renderSquare(3)} {this.renderSquare(4)} {this.renderSquare(5)}
            </Stack>           
          </Grid>
          <Grid item> 
            <Stack  direction="row"  spacing={1.3}>
                {this.renderSquare(6)} {this.renderSquare(7)} {this.renderSquare(8)}
            </Stack> 
          </Grid>         
        </Grid>  
        
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to Step # ' + move :
        'Start the Game';
      return (
        <li key={move}>
           <ThemeProvider theme={theme}>
            <Button variant="contained"
              color="secondary" 
              onClick={() => this.jumpTo(move)}>
              {desc}
           </Button>
           </ThemeProvider>
          
        </li>
      );
    });

    let status;
    if (winner === "X" || winner === "O") {
      status = "Winner: " + winner;
    } else if (winner === "None") {
      status = "Draw";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <Grid container flexDirection={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "center", sm: "flex-start" }} justifyContent="center" >
          <Grid item sm="6" xs="12">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </Grid>        
          <Grid item sm="auto" xs="12" marginTop={{ xs: "2", sm: "0" }}>
            <div className="status">{status}</div>
            <ol>{moves}</ol>
          </Grid>        
      </Grid>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


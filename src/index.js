import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button
			className="square"
			onClick={props.onClick}
		>
			{props.value}
		</button>
	);
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

function calculateLocation(i) {
	switch (i) {
		case 0:
			return [0, 0];
		case 1:
			return [0, 1];
		case 2:
			return [0, 2];
		case 3:
			return [1, 0];
		case 4:
			return [1, 1];
		case 5:
			return [1, 2];
		case 6:
			return [2, 0];
		case 7:
			return [2, 1];
		case 8:
			return [2, 2];
		default:
			return;
	}
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => { this.props.onClick(i) }}
			/>
		);
	}

	render() {
		return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
					squares: Array(9).fill(null),
					move: null,
				}
			],
			xIsNext: true,
			stepNumber: 0,
		}

		this.restartGame = this.restartGame.bind(this);
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		})
	}

	handleClick(i) {
		const history = this.state.history;
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';

		const move = `${squares[i]} at ${calculateLocation(i)}`;

		this.setState({
			history: history.concat(
				[{
					squares: squares,
					move: move,
				}]
			),
			xIsNext: !this.state.xIsNext,
			stepNumber: history.length,
		});
		console.log(this.state.history);
		console.log(this.state.stepNumber);
		console.log(move);
	}

	restartGame() {
		console.log('restartGame clicked');
		this.setState({
			history: [
				{ squares: Array(9).fill(null) }
			],
			xIsNext: true,
			stepNumber: 0,
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move) => {
			const desc = move ? 'Go to move #' + move : 'Go to game start';
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
					<div>{step.move}</div>
				</li>

			);
		});

		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		} else {
			status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
					<hr></hr>
					<button onClick={this.restartGame}>Restart Game</button>
				</div>
				<div className="game-info">

					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);

import React, { Component } from 'react';
import './App.css';
import Plus from 'react-icons/lib/ti/plus-outline';
import Clipboard from 'react-icons/lib/ti/clipboard';

class Board extends Component{
  constructor(name){
    super();
    this.state = {
      name: name,
      notes: [[]]
    }
  }

  render(){
    return(
      <div className="board">
        <button className="new-note-button" onClick={() => this.addNote()}>
          <Plus size="25"/>
        </button>
        {this.renderNotes()}
      </div>
    )
  }

  renderNotes(){
    if(this.state.notes.length <= this.props.selectedBoardInxed){
      this.state.notes.push([]);
    }
    const notes = this.state.notes[this.props.selectedBoardInxed].map((obj, count) => {
      return(
      <div className="note" key={count}>
        {obj}
      </div>)
    });
    return notes;
  }

  addNote(){
    const notes = this.state.notes.slice();
    notes[this.props.selectedBoardInxed].push("notetext");
    this.setState({
       notes: notes
    });    
  }

}


class App extends Component {
  constructor(){
    super();
    this.state = {
      boards: [],
      selectedBoardInxed: 0
    };
  }
  
  render() {
    let boardButtons = null;
    if(this.state.boards != null){
      boardButtons = this.state.boards.map((obj, count) => {
        let classNames1 = "board-button";
        let classNames2 = "board-name-input";
        if(count === this.state.selectedBoardInxed){
          classNames1 += " board-button-selected";
          classNames2 += " board-button-selected";          
        }
        return(
          <button className={classNames1} key={count} onClick={() => this.boardButtonClicked(count)}>
            <Clipboard size="25"/>
            <div className="board-button-name">
              <form className="left">
                <input className={classNames2} value={obj.state.name}
                onChange={this.editBoardName.bind(this, count)}/>
              </form>
            </div>
          </button>
        )
      });
    }

    let board =  null;
    if(this.state.boards.length !== 0){
       board = <Board selectedBoardInxed={this.state.selectedBoardInxed}/>;
    }
    return (
      <div className="App">
        <div className="App-header">
          {boardButtons}
          <button className="header-button" onClick={() => this.addBoard()}>
            <Plus size="25"/>
          </button>
        </div>
        {board}
      </div>
    );
  }

  boardButtonClicked(index){

    this.setState({
      selectedBoardInxed: index
    });
  }

  editBoardName(count, event){
    const boards = this.state.boards.slice();
    const board = new Board(event.target.value);
    boards[count] = board;
    this.setState({
      boards: boards
    });
  }

  addBoard(){
    const boards = this.state.boards.slice();
    const newBoard = new Board("Board");
    this.setState({
      boards: boards.concat(newBoard),
    });
  }
}

export default App;
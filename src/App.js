import React, { Component } from 'react';
import './App.css';
import Plus from 'react-icons/lib/ti/plus';
import Clipboard from 'react-icons/lib/ti/clipboard';
import Delete from 'react-icons/lib/ti/delete';

class Board extends Component{
  constructor(name){
    super();
    const thisBoard = JSON.parse(localStorage.getItem("postemboard"));
    if(thisBoard === null){
      this.state = {
        notes: [[]]
      }
    }
    else{
      this.state = thisBoard;
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
    while(this.state.notes.length <= this.props.selectedBoardIndex){
      this.state.notes.push([]);
    }
    const notes = this.state.notes[this.props.selectedBoardIndex].map((obj, count) => {
      return(
      <Note text={obj} key={count} index={count} noteChanged={this.noteChanged.bind(this)}
      noteDeleted={this.noteDeleted.bind(this)}/>)
    });
    return notes;
  }

  componentDidUpdate(){
    this.saveState();
  }

  addNote(){
    const notes = this.state.notes.slice();
    notes[this.props.selectedBoardIndex].push("notetext");
    this.setState({
       notes: notes
    });    
  }

  noteChanged(index, event){
    const notes = this.state.notes.slice();
    notes[this.props.selectedBoardIndex][index] = event.target.value;
    this.setState({
      notes: notes
    });
  }

  noteDeleted(index){
    const notes = this.state.notes.slice();
    notes[this.props.selectedBoardIndex].splice(index, 1);
    this.setState({
      notes: notes
    });
  }

  boardDeleted(index){
    const notes = this.state.notes;
    notes.splice(index, 1);
    this.setState({
      notes: notes
    });
  }

  saveState(){
    localStorage.setItem("postemboard", JSON.stringify(this.state));
  }
}

function Note(props){
  return(<div className="note" key={props.index}>
        <Delete className="right" onClick={props.noteDeleted.bind({}, props.index)}/>
        <textarea className="note-textarea" value={props.text} 
          onChange={props.noteChanged.bind({}, props.index)}>
        </textarea>
        </div>);
}


class App extends Component {
  constructor(){
    super();
    const savedBoards = JSON.parse(localStorage.getItem("postemapp"));
    if(savedBoards === null){
      this.state = {
        boards: [],
        selectedBoardIndex: 0
      };
    }
    else{
      const boards = savedBoards.boards === null ? [] : savedBoards.boards;
      this.state = {
        boards: boards,
        selectedBoardIndex: 0
      };
    }
  }
  
  render() {
    let boardButtons = null;
    if(this.state.boards != null){
      boardButtons = this.state.boards.map((obj, count) => {
        let classNames1 = "board-button";
        let classNames2 = "board-name-input";
        if(count === this.state.selectedBoardIndex){
          classNames1 += " board-button-selected";
          classNames2 += " board-button-selected";          
        }
        return(
          <button className={classNames1} key={count} onClick={() => this.boardButtonClicked(count)}>
            <Delete className="right" onClick={() => this.deleteBoard(count)}/>
            <Clipboard className="clipboard-image" size="25"/>
            <div className="board-button-name">
              <form className="left">
                <input className={classNames2} value={obj}
                onChange={this.editBoardName.bind(this, count)}/>
              </form>
            </div>
          </button>
        )
      });
    }

    let board =  null;
    if(this.state.boards.length !== 0 && this.state.selectedBoardIndex !== -1){
       board = <Board selectedBoardIndex={this.state.selectedBoardIndex} ref="board"/>;
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

  componentDidUpdate(){
    this.saveState();
  }

  boardButtonClicked(index){
    this.setState({
      selectedBoardIndex: index
    });
  }

  editBoardName(count, event){
    const boards = this.state.boards.slice();
    const board = event.target.value;
    boards[count] = board;
    this.setState({
      boards: boards
    });
  }

  addBoard(){
    if(this.state.boards.length > 4){
      alert("Max number of boards reached!");
      return;
    }
    const boards = this.state.boards.slice();
    //const newBoard = new Board("Board");
    const newBoard = "Board";
    this.setState({
      boards: boards.concat(newBoard),
    });
  }

  deleteBoard(index){
    if(confirm("Delete board?")){
      const boards = this.state.boards;
      boards.splice(index, 1);
      this.refs.board.boardDeleted(index);
      this.setState({
        boards: boards
      });
    }
    else return;
  }

  saveState(){
    localStorage.setItem("postemapp", JSON.stringify(this.state));
  }
}

export default App;

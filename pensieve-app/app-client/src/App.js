import React, { Component } from 'react';
import Form from './Form.js';
import FileSelector from './FileSelector.js';
import ResultsTable from './ResultTable'
import { NavLink, Switch, Route } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import Async from 'react-async';
import NewNavigation from "./NotebookMain";


const Navigation = () => (
  <nav>
    <ul>
      <li><NavLink to='/'>Home</NavLink></li>
      <li><NavLink to='/questions'>Questions</NavLink></li>
      <li><NavLink to='/answers'>Answers</NavLink></li>
      <li><NavLink to='/newHome'>NewHome</NavLink></li>
    </ul>
  </nav>
);

class App extends Component {
  constructor(props) {
		super(props);
    this.Main = this.Main.bind(this)
    this.Home = this.Home.bind(this)
    this.Questions = this.Questions.bind(this)
    this.Answers = this.Answers.bind(this)
    this.getResultTable = this.getResultTable.bind(this)
		this.state = {
			data: {},
			selectedRows: {},
      url: null
		};
  }

  Home(){
    //console.log(process.env.REACT_APP_S3_BUCKET)
    let resTable
    if (this.state.url != null) {
      resTable = (<ResultsTable
                    key={this.state.url}
                    getQuestions={false}
                    getAnswers={false}
                    url={this.state.url}/>)
    }
    else {
      resTable = <h1>Please enter a search</h1>
    }
    return(
      <div className='home'>
        <h1>Search the database here:</h1>
        <form onSubmit={this.getResultTable}>
          <label for="all-search">
            <input
              placeholder="Question search"
              type="text"
              name="questionSearch"
              ref={el => this.element = el} />
          </label>
          <input type="submit" value="Search" />
          <br />
          <select
            name="difficultySearch">
            <option selected value="None">None</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </form>
        {resTable}
        <h1>Upload your CSV here</h1>
        <FileSelector />
      </div>
    );
  }

  Questions(){
    return(
      <div className='questions'>
          <ResultsTable getQuestions={true}
                        getAnswers={false}/>
      </div>
    );
  }

  Answers(){
    return(
      <div className='answers'>
          <ResultsTable getQuestions={false}
                        getAnswers={true}
                        data={this.state.data}/>
      </div>
    );
  }

  NewHome(){
    return(
      <NewNavigation />
    );
  }

  Main(data){
    return(
      <Switch>
        <Route exact path='/'
               component={this.Home}>
        </Route>
        <Route exact path='/questions'
               component={this.Questions}>
        </Route>
        <Route exact path='/answers'
               component={this.Answers}>
        </Route>
        <Route exact path='/newHome'
               component={this.NewHome}>
        </Route>
      </Switch>
    );
  }

  getResultTable(event){
    event.preventDefault();
    var urlSearch = ""
    if(event.target[0].value != ""){
      urlSearch = urlSearch + "question=" + event.target[0].value
    }

    if(event.target[2].value != "None"){
      if(urlSearch != ""){
        urlSearch = urlSearch + "&"
      }
      urlSearch = urlSearch + "difficulty=" + event.target[2].value
    }

    let url = 'https://griowi9sk7.execute-api.us-east-2.amazonaws.com/v2/questions-py'
    if(urlSearch != ""){
      url = url + "?" + urlSearch
    }

    this.setState({url: url})
  }

  render() {
    return (
      <div className='app'>
        <Navigation />
        <this.Main/>
      </div>
    );
  }
}

export default App;
// <Async promiseFn={this.getTemp}>
//   <Async.Fulfilled>
//   {fulfilled => {
//     return(
//       <div className='app'>
//         <Navigation />
//         <this.Main/>
//       </div>
//     );
//   }}
//   </Async.Fulfilled>
// </Async>

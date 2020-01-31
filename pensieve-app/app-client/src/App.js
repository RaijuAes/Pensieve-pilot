import React, { Component } from 'react';
import Form from './Form.js';
import FileSelector from './FileSelector.js';
import ResultsTable from './ResultTable'
import { NavLink } from 'react-router-dom';

const Navigation = () => (
  <nav>
    <ul>
      <li><NavLink to='/'>Home</NavLink></li>
      <li><NavLink to='/about'>About</NavLink></li>
      <li><NavLink to='/contact'>Contact</NavLink></li>
    </ul>
  </nav>
);

class App extends Component {
  render() {
    return (
      <div>
        <h1>Search the database here:</h1>
        <Form />
        <ResultsTable/>
		    <h1>Upload your CSV here</h1>
		    <FileSelector />
      </div>
    );
  }
}

export default App;

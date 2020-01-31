import React, { Component } from 'react';
import axios from 'axios';
import ResultsTable from './ResultTable'

const headers =  ["ID", "Question", "Topic", "Sub-Topic", "Solution", "Solution Type", "Difficulty", "Domain"]

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isSubmitted: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
	this.handleCSV = this.handleCSV.bind(this);
    // this.handleChange = this.handleChange.bind(this);
  }

  async handleSubmit(event) {
	let results
    event.preventDefault();
    //const { name, message } = this.state;
	try {
		var urlJson = {
						"TableName": "pensieve-test",
						"FilterExpression": "(Difficulty = :difficulty)",
						"ExpressionAttributeValues": {":difficulty": {"S": "Easy"}}
					  }
		var encoded = encodeURIComponent(JSON.stringify(urlJson))
		results = await axios.get('https://griowi9sk7.execute-api.us-east-2.amazonaws.com/v1/questions')
		//results = await axios.get('https://griowi9sk7.execute-api.us-east-2.amazonaws.com/v2/questions/?'.concat(encoded))
    } catch (error) {
		console.error(error)
	}
	this.setState({data: results.data,
					isSubmitted: true})
	console.log(Object.values(this.state.data[0]))
	return results.data
  }

  async handleCSV(event) {
	let results
    event.preventDefault();
    //const { name, message } = this.state;
	try {
		results = await axios.get('https://griowi9sk7.execute-api.us-east-2.amazonaws.com/v1/questions')
    } catch (error) {
		console.error(error)
	}
	this.setState({data: results.data,
					isSubmitted: true})
	console.log(Object.values(this.state.data[0]))
  }


  renderTableBody() {
	let tableEntries = this.state.data
	if (this.state.isSubmitted){
		return (!tableEntries) ? null : (
			tableEntries.map((item) => {
			  console.log('item: ', item);
			  return (
				<tr>
				  {Object.entries(item).map((field) => {
					console.log('field: ', field);
					return <td>{field[1]}</td>
				  })}
				</tr>
			  );
			})
		);
	}
  }

  renderTableHeader() {
	  if (this.state.isSubmitted){
		  return headers.map((key, index) => {
			  return <th key={index}>{key.toUpperCase()}</th>
		  })
	  }
  }

  renderSearchSelection() {
	return (
			<select>
			  <option selected value="None">None</option>
			  <option value="Question">Question</option>
			  <option value="Topic">Topic</option>
			  <option value="Sub-Topic">Sub-Topic</option>
			  <option value="Solution">Solution</option>
			  <option value="Solution Type">Solution Type</option>
			  //<option value="Difficulty">Difficulty</option>
			  <option value="Domain">Domain</option>
			</select>
		)
  }

  renderDifficultySelection() {
	return (
			<select>
			  <option selected value="None">None</option>
			  <option value="Easy">Easy</option>
			  <option value="Medium">Medium</option>
			  <option value="Hard">Hard</option>
			</select>
		)
  }

  render() {
	return(
		<div>
		<form onSubmit={this.handleSubmit}>
			<label for="all-search">
				<input placeholder="Your search"
				type="text"
				ref={el => this.element = el} />
			</label>
			<input type="submit" value="Search" />
		</form>
		<label for="difficulty-search">
			{this.renderSearchSelection()}
		</label>
		<label>
			{this.renderDifficultySelection()}
		</label>
		<h1 id='title'>Search Results</h1>
	    <table border="1" id='Results'>
			<tbody>
				<tr>{this.renderTableHeader()}</tr>
				{this.renderTableBody()}
			</tbody>
	    </table>
		</div>
	)
  }

}

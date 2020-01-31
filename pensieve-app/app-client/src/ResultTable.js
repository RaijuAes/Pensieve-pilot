import React, { Component } from 'react'
import styled from 'styled-components'
import { useTable, useRowSelect  } from 'react-table'

import makeData from './makeData'
import axios from 'axios';
import Async from 'react-async';

import MathJax from 'react-mathjax2'
import { NavLink, Switch, Route } from 'react-router-dom';

const ascii2 = 'U = 1/(R_(si) + sum_(i=1)^n(s_n/lambda_n) + R_(se))'
const ascii = ' this equation is cool U = 1/(R_(si) + sum_(i=1)^n(s_n/lambda_n) + R_(se)) ya know'


const GeneratedPage = () => (
  <nav>
    <ul>
      <li><NavLink to='/questions'>Questions</NavLink></li>
      <li><NavLink to='/answers'>Answers</NavLink></li>
    </ul>
  </nav>
);

// const GenPageMain = () => (
//   <Switch>
//     <Route exact path='/questions' component={Questions}></Route>
//     <Route exact path='/answers' component={Answers}></Route>
//   </Switch>
// );
function GenPageMain (results){
  return (
    <Switch>
      <Route
        exact path='/questions'
        render={(props) => <Questions {...props} selectedQuestions= {results[0]} />}
      />
      <Route
        exact path='/answers'
        render={(props) => <Answers {...props} selectedAnswers= {results[1]} />}
      />
    </Switch>
  )
}

const Answers = ({selectedAnswers}) => (
  <MathJax.Context input='ascii'>
    <div>
        <MathJax.Node>{selectedAnswers}</MathJax.Node>
    </div>
  </MathJax.Context>
);

const Questions = ({selectedQuestions}) => (
  <MathJax.Context input='ascii'>
    <div>
        <MathJax.Node>{selectedQuestions}</MathJax.Node>
    </div>
  </MathJax.Context>
);

function texText(selectedFlatRows){
  let questionText = ""
  let answerText = ""
  selectedFlatRows.map((d) => {
    questionText = questionText + d.original.question
    answerText = answerText + d.original.solution
  })
  return [questionText, answerText]
  // (<MathJax.Context input='ascii'>
  //           <div>
  //               <MathJax.Node>{text}</MathJax.Node>
  //           </div>
  //         </MathJax.Context>)
  //let htmlStr =  renderToStaticMarkup("<MathJax.Context input='ascii'><div><MathJax.Node>{text}</MathJax.Node></div></MathJax.Context>")
  //return htmlStr
}

function createDoc(jsonRows){
  let rowCnt = 0
  let docStr = ""
  for (let i = 0; i < jsonRows.length; i++){
    docStr = docStr + String(jsonRows[i].original.question) + `\n`
  }

  return docStr
}

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

class ResultsTable extends Component {
	constructor() {
		super();
		this.state = {
			data: [],
			valuesPresent: false
		};
		this.Table = this.Table.bind(this);
		this.getTemp = this.getTemp.bind(this);
		this.ResultsApp = this.ResultsApp.bind(this);
	}


  Table({ columns, data, hasResults, getDownload }) {
	  // Use the state and functions returned from useTable to build your UI
	  const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		selectedFlatRows,
		state: { selectedRowIds },
	  } = useTable(
	    {
		  columns,
		  data,
	    },
	    useRowSelect,
	    hooks => {
	      hooks.flatColumns.push(columns => [
	  	  // Let's make a column for selection
	  	  {
  	  	    id: "selection",
		    // The header can use the table's getToggleAllRowsSelectedProps method
		    // to render a checkbox
		    Header: ({ getToggleAllRowsSelectedProps }) => (
			  <div>
			    <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
			  </div>
		    ),
		    // The cell can use the individual row's getToggleRowSelectedProps method
		    // to the render a checkbox
		    Cell: ({ row }) => (
			  <div>
			    <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
			  </div>
		    )
		  },
		  ...columns
	      ]);
	    }
	  );

    let curLen = Object.keys(selectedFlatRows).length
    React.useEffect(() => {
      getDownload(curLen)
    }, [curLen]);

    //if (Object.keys(selectedFlatRows).length > 0){
		  //this.setState({valuesPresent: true})
	  //}

	  // Render the UI for your table
	  return (
	    <>
		  <table {...getTableProps()}>
		    <thead>
			  {headerGroups.map(headerGroup => (
			    <tr {...headerGroup.getHeaderGroupProps()}>
				  {headerGroup.headers.map(column => (
				    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
				  ))}
			    </tr>
			  ))}
		    </thead>
		    <tbody {...getTableBodyProps()}>
   			  {rows.map(
			    (row, i) => {
				  prepareRow(row);
				  return (
				    <tr {...row.getRowProps()}>
					  {row.cells.map(cell => {
					    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
					  })}
				    </tr>
				  )}
			  )}
		    </tbody>
		  </table>

          <p>Selected Rows: {Object.keys(selectedRowIds).length}</p>
          <pre>
            <code>
              {createDoc(selectedFlatRows)}
            </code>
          </pre>
          <div>
            {hasResults ? (
              <div>
              <button onClick="myFunction()">Try it</button>
                <script>
                function myFunction() {
                  //window.open("").document.write(texText(selectedFlatRows))
                }
                </script>
              <GeneratedPage />
              {GenPageMain(texText(selectedFlatRows))}
              <a href="data:application/octet-stream;charset=utf-8;base64,Zm9vIGJhcg==">text file</a>
              </div>
            ) : (
              <a href="data:application/octet-stream;charset=utf-8;base64,Zm9vIGJhcg==">dont</a>
            )}
          </div>
        </>
      );
  }

  // temporarily grab table information
	async getTemp() {
	  let results
	  //const { name, message } = this.state;
	  try {
		  var urlJson = {
						"TableName": "pensieve-test",
						"FilterExpression": "(Difficulty = :difficulty)",
						"ExpressionAttributeValues": {":difficulty": {"S": "Easy"}}
						}
		  var encoded = encodeURIComponent(JSON.stringify(urlJson))
		  results = await axios.get('https://griowi9sk7.execute-api.us-east-2.amazonaws.com/v1/questions')
		  var data = results.data
		  this.setState({data: data})
		  return data
	  } catch (error) {
		console.error(error)
	  }
	}


	ResultsApp() {
		let columns = React.useMemo(
		() => [
			{
			  Header: 'ID',
			  accessor: 'id',
			},
			{
			  Header: 'Question',
			  accessor: 'question',
			},
			{
			  Header: 'Topic',
			  accessor: 'topic',
			},
			{
			  Header: 'Sub-Topic',
			  accessor: 'subTopic',
			},
			{
			  Header: 'Solution',
			  accessor: 'solution',
			},
			{
			  Header: 'Solution Type',
			  accessor: 'solutionType',
			},
			{
			  Header: 'Difficulty',
			  accessor: 'difficulty',
			},
			{
			  Header: 'Domain',
			  accessor: 'domain',
			}
		],
		[]
		)

    const [resultStatus, hasResults] = React.useState(false)
    const getDownload = React.useCallback((resultNum) => {
      if (resultNum > 0) {
        hasResults(true)
      }
      else {
        hasResults(false)
      }
    }, [])

	  return (
		<Async promiseFn={this.getTemp}>
			<Async.Fulfilled>
			{data => {
				return (
				  <Styles>
					<this.Table data={data}
								columns={columns}
                hasResults={resultStatus}
                getDownload={getDownload}/>
				  </Styles>
			)}}
			</Async.Fulfilled>
		</Async>
		)

	}

  render() {
	  return <this.ResultsApp/>
  }
}

export default ResultsTable

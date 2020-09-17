import React, { Component } from 'react'
import styled from 'styled-components'
import { useTable, useRowSelect  } from 'react-table'
import axios from 'axios';

import MathJax from 'react-mathjax2'
var Latex = require('react-latex');

const LatexHelper = ({ values }) => {
  return(
    <>
      <Latex>{values}</Latex>
    </>
  );
};

const columns = [
  {
    Header: 'ID',
    accessor: 'QuestionId',
  },
  {
    Header: 'Question',
    accessor: 'Question',
    Cell: ({ cell: { value } }) => <LatexHelper values={value} />
  },
  {
    Header: 'Topic',
    accessor: 'Topic',
  },
  {
    Header: 'Sub-Topic',
    accessor: 'Sub-Topic',
  },
  {
    Header: 'Solution',
    accessor: 'Solution',
    Cell: ({ cell: { value } }) => <LatexHelper values={value} />
  },
  {
    Header: 'Solution Type',
    accessor: 'Solution Type',
  },
  {
    Header: 'Difficulty',
    accessor: 'Difficulty',
  },
  {
    Header: 'Domain',
    accessor: 'Domain',
  }
]

// function Answers(selectedAnswers) {
//   return(
//     selectedAnswers.map((ans) =>
//       (
//         <MathJax.Context input='ascii'>
//           <li><MathJax.Node>{ans}</MathJax.Node>
//           <br />
//           <br />
//           <br />
//           <br />
//           <br />
//           <br />
//           <br />
//           <br />
//           <br />
//           </li>
//         </MathJax.Context>
//       )
//     )
//   );
// }

function Answers(selectedAnswers) {
  return(
    selectedAnswers.map((ans) =>
      (
        <li><Latex>{ans}</Latex>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        </li>
      )
    )
  );
}
// function Questions2(selectedQuestions) {
//   return(
//     selectedQuestions.map((quest) =>
//       (
//         <MathJax.Context input='ascii'>
//           <li><MathJax.Node>{quest}</MathJax.Node>
//           <br />
//           <br />
//           <br />
//           <br />
//           <br />
//           <br />
//           <br />
//           <br />
//           <br />
//           </li>
//         </MathJax.Context>
//       )
//     )
//   );
// }

function Questions(selectedQuestions) {
  return(
    selectedQuestions.map((quest) =>
      (
        <li><Latex>{quest}</Latex>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        </li>
      )
    )
  );
}

function texText(selectedFlatRows){
  let questionText = []
  let answerText = []
  for (let i = 0; i < selectedFlatRows.length; i++){
    questionText.push(selectedFlatRows[i].Question)
    answerText.push(selectedFlatRows[i].Solution)
  }

  return [questionText, answerText]
}

function createDoc(jsonRows){
  let docStr = ""
  if (jsonRows !== undefined){
    for (let i = 0; i < jsonRows.length; i++){
      docStr = docStr + String(jsonRows[i].Question) + `\n`
    }
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
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			valuesPresent: false,
      url: this.props.url
		};

    this.getQuestions = props.getQuestions
    this.getAnswers = props.getAnswers
		this.Table = this.Table.bind(this)
		this.ResultsApp = this.ResultsApp.bind(this)
	}

  async componentDidMount(){
    let results
    try {

      results = await axios.get(this.state.url)
      this.setState({data: results.data.body})
    } catch (error) {
    console.error(error)
    }
  }

  Table(columns, data) {
	  // Use the state and functions returned from useTable to build your UI
    let selectedValues = {selectedRowIds: {}}//JSON.parse(sessionStorage.getItem("selectedIds"))
    let selectedRows = JSON.parse(sessionStorage.getItem("selectedRows"))
    if (selectedRows == null) {
      selectedRows = []
    }
    for (let i = 0; i < selectedRows.length; i++){
      for (let j = 0; j < data.length; j++){
        if(selectedRows[i].Question == data[j].Question){
          selectedValues.selectedRowIds[j] = true
        }
      }
    }
    const initialState = selectedValues
    return(useTable(
	    {
		      columns,
		      data,
          initialState
	    },
	    useRowSelect,
	    hooks => {
	      hooks.allColumns.push(columns => [
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
	    },
	  ))

  }

	ResultsApp(data) {
    // handle displaying of the tables and the various question answer pages
    // existing selected row
    let selectedRows = JSON.parse(sessionStorage.getItem("selectedRows"))

    // new user
    if (selectedRows == null) {
      selectedRows = []
    }

    //no data
    if (data.vals != null) {
      let tempTable = this.Table(columns,
                                 data.vals)
      // currently selected rows
      let updateSelectedRows = tempTable.selectedFlatRows.map(
        d => d.original
      )

      // these are the currently relevant search results
      let notValidSelected = selectedRows
        .filter(i => !data.vals.some(el => el.Question === i.Question))

      // add the newly selected rows
      let finalSelectedRows = notValidSelected.concat(updateSelectedRows)
      //save the state for use later
      sessionStorage.setItem("selectedRows",
                           JSON.stringify(finalSelectedRows))
      if ((!this.getAnswers && !this.getQuestions) == true) {
  			return (
  			  <Styles>
            <>
              <table {...tempTable.getTableProps()}>
                <thead>
            	  {tempTable.headerGroups.map(headerGroup => (
            	    <tr {...headerGroup.getHeaderGroupProps()}>
            		  {headerGroup.headers.map(column => (
            		    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            		  ))}
            	    </tr>
            	  ))}
                </thead>
                <tbody {...tempTable.getTableBodyProps()}>
            			  {tempTable.rows.map(
                	    (row, i) => {
                		    tempTable.prepareRow(row);
                  		  return (
                  		    <tr {...row.getRowProps()}>
                  			  {row.cells.map(cell => {
                  			    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  			  })}
                  		    </tr>
                  		  )
                      }
                	  )}
                </tbody>
              </table>
              <p>Selected Rows: {Object.keys(tempTable.state.selectedRowIds).length}</p>
              <pre>
                <code>
                  {createDoc(selectedRows)}
                </code>
              </pre>
            </>
  			  </Styles>
        )
      }
    }
    if (this.getAnswers == true) {
      let ansText = texText(selectedRows)[1]
      return(
        <div>
          <ol>{Answers(ansText)}</ol>
        </div>
      );
    }
    if (this.getQuestions == true) {
      let questText = texText(selectedRows)[0]
      return(
        <div>
          <ol>{Questions(questText)}</ol>
        </div>
      );
    }
    return(
      <div>
        <h1>Getting your results</h1>
      </div>
    )
	}

  render() {
	  return <this.ResultsApp vals={this.state.data}/>
  }
}

ResultsTable.defaultProps = {
  getQuestions: false,
  getAnswers: false
}

export default ResultsTable


// <div>
//   {hasResults ? (
//     <div>
//     <button onClick="myFunction()">Try it</button>
//       <script>
//       function myFunction() {
//         //window.open("").document.write(texText(selectedFlatRows))
//       }
//       </script>
//     <GeneratedPage />
//     {GenPageMain(texText(selectedFlatRows))}
//     <a href="data:application/octet-stream;charset=utf-8;base64,Zm9vIGJhcg==">text file</a>
//     </div>
//   ) : (
//     <a href="data:application/octet-stream;charset=utf-8;base64,Zm9vIGJhcg==">dont</a>
//   )}
// </div>

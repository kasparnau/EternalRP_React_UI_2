import './App.css';
import React from 'react';
import doEvent from './doEvent.js'

const IS_PROD = process.env.NODE_ENV === 'production'

function Square(props) {
  let clicked = props.isClickedTile(props.col, props.row)
  let correct = props.isCorrectTile(props.col, props.row)
  let col = ''

  if (clicked) {
    col = '#ffffff'
  } else {
    col = '#2573c1'
  }

  if (props.memorizing && correct) {
    col = '#ffffff'
  }

  return (
    <div className="Button" 
      style={{backgroundColor: col}}
      onClick={event => props.handleClick(props.col, props.row)}
    />
  )
}

const useStateWithPromise = defaultVal => {
  let [state, setState] = React.useState({
    value: defaultVal,
    resolve: () => {}
  });

  React.useEffect(
    () => {
      state.resolve(state.value);
    },
    [state]
  );

  return [
    state.value,
    updater => {
      return new Promise(resolve => {
        setState(prevState => {
          let nextVal = updater;
          if (typeof updater === "function") {
            nextVal = updater(prevState.value);
          }
          return {
            value: nextVal,
            resolve
          };
        });
      });
    }
  ];
};

function App() {
  const [visible, updateVisible] = React.useState(!IS_PROD)
  const [memorizing, setMemorizing] = React.useState(true)
  const [requiredTiles, setRequiredTiles] = React.useState(0)
  const [rows, setRows] = React.useState(0)
  const [columns, setColumns] = React.useState(0)

  const [values, setValues] = useStateWithPromise({
      clicked: [],
      correctTiles: [],
  })

  function setValue(name, value) {
    setValues({ ...values, [name]: value })
  }
  
  function isCorrectTile(col, row, correctTiles) {
    let correct = false
    let cTiles = correctTiles ? correctTiles : values.correctTiles
    for (let i=0; i<cTiles.length; i++) {
      let data = cTiles[i]
      
      if (data[0] === col && data[1] === row) {
        correct = true
      }  
    }
    return correct
  }

  function isClickedTile(col, row, tileList) {
    let clicked = false;
    let vals = tileList ? tileList : values.clicked

    for (let i=0; i<vals.length; i++) {
      let data = vals[i]
      
      if (data[0] === col && data[1] === row) {
        clicked = true
      }  
    }

    return clicked
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  
  function _generateCorrectTile(cols, rows, tileList, correctTiles) {
    let col = getRandomInt(cols)
    let row = getRandomInt(rows)

    if (isCorrectTile(col, row, tileList, correctTiles)) {
      return _generateCorrectTile(cols, rows, tileList, correctTiles)
    }

    return [col, row]
  }

  function generateNewCorrectTiles(cols, rows, tiles, correctTiles) {
    let newCorrectTiles = []
    for (let i=0; i<tiles; i++) {
      let [col, row] = _generateCorrectTile(cols, rows, newCorrectTiles, correctTiles)

      newCorrectTiles.push([col, row])
    }
    setValue('correctTiles', newCorrectTiles)
  }

  async function startGame(data) {
    setRequiredTiles(data.tiles)

    setRows(data.rows)
    setColumns(data.columns)

    let newValues = {
      clicked: [],
      correctTiles: [],
    }

    setValues(newValues)
    generateNewCorrectTiles(data.columns, data.rows, data.tiles, data.correctTiles)
    setMemorizing(true)

    setTimeout(() => {
      setMemorizing(false)
    }, data.memorizeTime)

  }

  async function endGame(success) {
    doEvent('endGame', {success: success}, []).then(() => {
      setColumns(0)
      setRows(0)
      setRequiredTiles(100)

      let newValues = {
        clicked: [],
        correctTiles: [],
      }
  
      setValues(newValues)  
    })
  }

  React.useEffect(() => {
    if (!IS_PROD) {
      startGame({
        rows: 20,
        columns: 10,
        tiles: 75,
  
        memorizeTime: 2000
      })
    }

    window.addEventListener("message", ((event) => {
      if (event.data.show !== undefined) {
        updateVisible(event.data.show)
      }
      if (event.data.play !== undefined) {
        startGame(event.data)
      }
    }))

    window.addEventListener("keydown", ((event) => {
      if (event.key === 'Escape') {
        if (visible) {
          endGame(false)
        }
      }
    }))
  }, [])

  function handleClick(col, row) {
    if (memorizing) {
      return
    }
    setValues((values) => {
      let correct = isCorrectTile(col, row)
      if (!correct) {
        endGame(false)
      } else {
        let totalCorrectTiles = values.clicked.length + 1
        if (totalCorrectTiles === requiredTiles) {
          endGame(true)
        }
      }
  
      return { ...values, clicked: [ ...values.clicked, [col, row] ]}
    })
  }
  
  return (
    <div className="App" style={{display: visible ? 'block' : 'none'}}>
        <div className="Main">
            <div className="ItemsHolder">
              {[...Array(columns)].map((x, col) =>
                <div className="Row">
                  {[...Array(rows)].map((x, row) =>
                    <Square 
                      row={row}
                      col={col}
                      values={values}
                      handleClick={handleClick}

                      isClickedTile={isClickedTile}
                      isCorrectTile={isCorrectTile}
                      memorizing={memorizing}
                    />
                  )}
                </div>
              )}
            </div>
        </div>
    </div>
  );
}

export default App;

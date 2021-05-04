import './App.css';
import React, {useState} from 'react';

import doEvent from './doEvent.js'

const IS_PROD = process.env.NODE_ENV === 'production'

function App() {
  const [visible, updateVisible] = useState(!IS_PROD)

  React.useEffect(() => {
    window.addEventListener("message", ((event) => {
      if (event.data.show !== undefined) {
        updateVisible(event.data.show)
      } 
    }))

    window.addEventListener("keydown", ((event) => {
      if (event.key === 'Escape') {
        doEvent("closeNui", {}, () => {})
      }
    }))
  }, [])
  
  return (
    <div className="App" style={{display: visible ? 'block' : 'none'}}>
        <div>
          
        </div>
    </div>
  );
}

export default App;

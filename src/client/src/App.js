
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom'
import Main from './Main/Main'

function App() {
  return (
    <Router>
      <Routes>
        <Route path={`/:guildId`} element={<Main/>}/>
      </Routes>
    </Router>
  )
}

export default App;

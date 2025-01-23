import "bootstrap/dist/css/bootstrap.min.css";
import { Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import LoginPage from "./Pages/login_SIgnUp/LoginPage";
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
      </Routes>
    </Router>
  )
}

export default App;

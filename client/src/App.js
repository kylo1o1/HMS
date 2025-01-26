import "bootstrap/dist/css/bootstrap.min.css";
import { Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import LoginPage from "./Pages/login_SIgnUp/LoginPage";
import Register from "./Pages/login_SIgnUp/Register";
import { Bounce, ToastContainer } from "react-toastify";
function App() {

  return (
    <Router>
       <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
        />
      <Routes>
     
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </Router>
  )
}

export default App;

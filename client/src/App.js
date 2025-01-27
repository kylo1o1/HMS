import "bootstrap/dist/css/bootstrap.min.css";
import { Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import LoginPage from "./Pages/login_SIgnUp/LoginPage";
import Register from "./Pages/login_SIgnUp/Register";
import { Bounce, ToastContainer } from "react-toastify";
import Header from "./Components/Header";
import Wrapper from "./Pages/login_SIgnUp/Wrapper";
import Footer from "./Components/Footer";
import HomePage from "./Pages/home_page/HomePage";
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
        <Header/>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<Wrapper><LoginPage/></Wrapper>}/>
        <Route path="/register" element={<Wrapper><Register/></Wrapper>}/>
      </Routes>
      <Footer/>
    </Router>
  )
}

export default App;

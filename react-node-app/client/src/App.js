import './App.css';
import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './components/Home';
import ProductPage from './components/ProductPage'
import SearchPage from './components/SearchPage';
import LoginPage from './components/LoginPage';
import CreateAccount from './components/CreateAccount';
import Logout from './components/Logout';

function App() {
  return (
    <Router>
      <div>
        <Header />
      </div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/productpage/:id" element={<ProductPage />} />
        <Route path="/searchpage/:searchValue" element={<SearchPage />}></Route>
        <Route path='/loginpage' element={<LoginPage />}></Route>
        <Route path='/createaccount' element={<CreateAccount />}></Route>
        <Route path='/logout' element={<Logout />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
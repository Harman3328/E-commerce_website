import './App.css';
import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './components/Home';
import ProductPage from './components/ProductPage'
import SearchPage from './components/SearchPage';
import LoginPage from './components/LoginPage';
import CreateAccount from './components/CreateAccount';
import Logout from './components/Logout';
import OrderPage from './components/OrderPage';
import Order from './components/Order'
import PaymentPage from './components/PaymentPage';

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
        <Route path='/orders' element={<OrderPage />}></Route>
        <Route path='/order/:orderNumber' element={<Order />}></Route>
        <Route path='/payment' element={<PaymentPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
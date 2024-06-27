import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/Login'
import Home from './Pages/Home'


const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
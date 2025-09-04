import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Navbar from './components/Navbar'
import Signup from './components/Signup'
import Login from './components/Login'
import Explore from './components/Explore'
import Blog from './components/Blog'
import Upload from './components/Upload'
// import Logout from './components/Logout'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/blog/" element={<Blog />} />
            <Route path="/upload" element={<Upload />} />
            {/* <Route path="/logout" element={<Logout />} /> */}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Navbar from './components/Navbar'
import Signup from './components/Signup'
import Login from './components/Login'
import Explore from './components/Explore'
import Blog from './components/Blog'
import Upload from './components/Upload'
import VerifyEmail from './components/VerifyEmail'
import VerificationPending from './components/VerificationPending'
import ResendVerification from './components/ResendVerification'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import ProjectPage from './components/ProjectPage';
import WriteBlog from './components/WriteBlog';

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
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/write" element={<WriteBlog />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/projects/:id" element={<ProjectPage />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/verification-pending" element={<VerificationPending />} />
            <Route path="/resend-verification" element={<ResendVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
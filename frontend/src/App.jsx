import { BrowserRouter, Routes, Route } from 'react-router-dom';

// ************** Context **************
import { AuthProvider } from './context/AuthProvider';
import { ProjectsProvider } from './context/ProjectsProvider';

// ************** Layouts **************
import AuthLayout from './layouts/AuthLayout';
import ProtectedLayout from './layouts/ProtectedLayout';

// ************** Components **************
import Login from './pages/Login'
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Confirm from './pages/Confirm';
import Projects from './pages/Projects';
import Project from './pages/Project';
import NewProject from './pages/NewProject';
import EditProject from './pages/EditProject';
import NewCollaborator from './pages/NewCollaborator'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProjectsProvider>
          <Routes>
            <Route path="/" element={<AuthLayout />}>
              <Route index element={<Login />} />
              <Route path='register' element={<Register />} />
              <Route path='forgot-password' element={<ForgotPassword />} />
              <Route path='forgot-password/:token' element={<ResetPassword />} />
              <Route path='confirm/:id' element={<Confirm />} />
            </Route>
            <Route path="/projects" element={<ProtectedLayout />}>
              <Route index element={<Projects />}/>
              <Route path='create' element={<NewProject />} />
              <Route path='new-collaborator/:id' element={<NewCollaborator />} />
              <Route path=':id' element={<Project />} />
              <Route path='edit/:id' element={<EditProject />} />
            </Route>
          </Routes>   
        </ProjectsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

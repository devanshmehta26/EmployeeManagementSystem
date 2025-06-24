import { Routes ,Route} from 'react-router-dom'
import './App.css'
import Dashboard from "./Pages/Dashboard"
import Profile from "./Pages/Profile"
import Cover from './Pages/Cover'
import Register from './Pages/Register'
import ProtectedRoute from './Components/ProtectedRoutes'
import Error from './Pages/Error'
import Home from './Pages/Home'
import Login from './Pages/Login'

function App() {
  
  return (
   <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route element={<ProtectedRoute/>}>
        <Route  element={<Cover/>}>
          <Route path='/dashboard' element={<Dashboard/>}></Route>
          <Route path='/profile' element={<Profile/>}></Route>
        </Route>
      </Route>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path="/*" element={<Error/>}/>
    </Routes>
   </>
  )
}

export default App

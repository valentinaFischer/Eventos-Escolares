import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'

import Login from './pages/authPages/Login'
import Signin from './pages/authPages/Signin'

import Home from './pages/Home'
import Profile from './pages/Profile'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import LandingPage from './pages/LandingPage'
import UserList from './pages/UserList'

import AdminRoute from './components/layoutRoutes/AdminRoute'
import MainLayout from './components/layoutRoutes/MainLayout'
import { SessionProvider } from './hooks/useSession'

function App() {
  return (
    <>
      <BrowserRouter>
        <SessionProvider>
          <Routes>
            <Route path='/login' element={<Login />}/>
            <Route path='/signin' element={<Signin />}/>

            <Route element={<MainLayout />} >
              <Route path='/' element={<LandingPage />}/>
              <Route path='/home' element={<Home />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/events' element={<Events />} />
              <Route path='/event/:id' element={<EventDetails />} />

              <Route element={<AdminRoute />}>
                <Route path='/users' element={<UserList />}/>
                <Route path='/profile/:id' element={<Profile />}/>
              </Route>

            </Route>
          </Routes>
        </SessionProvider>
      </BrowserRouter>
    </>
  )
}

export default App
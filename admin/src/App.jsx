import React from 'react'
import {Navigate, Route,Routes} from "react-router"
import {useAuth} from "@clerk/clerk-react"

import LoginPage from './pages/LoginPage.jsx'
import Dashboard from './pages/DashboardPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import CustomersPage from './pages/CustomersPage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import PageLoader from './components/PageLoader.jsx'


const App = () => {

  const {isSignedIn, isLoaded} = useAuth()

  if(!isLoaded) return <PageLoader/>

  return (
    <Routes>
      <Route path='/login' element={isSignedIn ? <Navigate to ={"/dashboard"}/> : <LoginPage/>}/>

      <Route path="/" element={isSignedIn ? <DashboardLayout/> : <Navigate to={"/login"}/>}>
      <Route index element={<Navigate to={"dashboard"}/>}/>
      <Route path="dashboard" element={<Dashboard/>}/>
      <Route path ="products" element={<ProductsPage/>}/>
      <Route path ="orders" element={<OrdersPage/>}/>
      <Route path ="customer" element={<CustomersPage/>}/>
      </Route>

    </Routes>
  )
}

export default App
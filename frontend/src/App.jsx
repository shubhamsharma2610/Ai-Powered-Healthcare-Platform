import React from 'react'

import './index.css'
import { Toaster } from 'react-hot-toast';

import AppRoutes from './app.routes.jsx'
function App() {
  // const [count, setCount] = useState(0)

  return (
 <>
    <Toaster position="top-right" />
<AppRoutes/>
 </>
  )
}

export default App

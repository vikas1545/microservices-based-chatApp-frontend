
import './App.css'
import { AppProvider } from './context/AppContext'
import PageRoutes from './pages/routes/pageRoutes'

function App() {

  return (
    <div>
      <AppProvider>
        <PageRoutes />
      </AppProvider>
    </div>
  )
}

export default App

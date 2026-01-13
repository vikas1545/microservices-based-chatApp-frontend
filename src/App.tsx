
import './App.css'
import { AppProvider } from './context/AppContext'
import PageRoutes from './pages/routes/pageRoutes'
import { SocketProvider } from './context/SocketContext'

function App() {

  return (
    <div>
      <AppProvider>
        <SocketProvider>
          <PageRoutes />
        </SocketProvider>

      </AppProvider>
    </div>
  )
}

export default App

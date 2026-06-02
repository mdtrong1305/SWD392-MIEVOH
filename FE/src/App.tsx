import { BrowserRouter, Routes } from 'react-router-dom'
import { routes, generateRoutes } from './router/router.tsx'
import { Provider } from 'react-redux'
import { store } from './store/index.tsx'
import { ToastContainer } from './components/Toast/Toast.tsx'
import { ThemeProvider } from './contextAPI/ThemeContext.tsx'

function App() {
  return (
    <Provider store={store}> 
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {generateRoutes(routes)}
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  )
}

export default App

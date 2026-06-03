import { BrowserRouter, Routes } from 'react-router-dom'
import { routes, generateRoutes } from './router/router.tsx'
import { Provider } from 'react-redux'
import { store } from './store/index.tsx'
import { ToastContainer } from './components/Toast/Toast.tsx'
import { ThemeProvider } from './contextAPI/ThemeContext.tsx'
import { LanguageProvider } from './contextAPI/LanguageContext.tsx'

function App() {
  return (
    <Provider store={store}> 
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Routes>
              {generateRoutes(routes)}
            </Routes>
            <ToastContainer />
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default App

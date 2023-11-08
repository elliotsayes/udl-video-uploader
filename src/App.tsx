import './App.css'
import { ThemeButton } from './components/ThemeButton'
import { ThemeProvider } from './components/ThemeProvider'
import { UploadPage } from './components/UploadPage'

function App() {
  return (
    <ThemeProvider>
      <UploadPage />
      <div className='fixed top-0 right-0 md:top-2 md:right-4'>
        <ThemeButton />
      </div>
    </ThemeProvider>
  )
}

export default App

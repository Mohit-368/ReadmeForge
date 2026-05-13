import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BuilderPage from './pages/BuilderPage'
import Toast from './components/ui/Toast'
import { useReadme } from './context/ReadmeContext'

function App() {
  const { state } = useReadme()
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/builder" element={<BuilderPage />} />
      </Routes>
      <Toast message={state.toastMsg} />
    </>
  )
}

export default App

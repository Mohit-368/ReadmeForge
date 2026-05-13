import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'
import Editor from '../components/editor/Editor'
import Preview from '../components/preview/Preview'
import Footer from '../components/layout/Footer'

export default function BuilderPage() {
  return (
    <div className="relative z-10 flex flex-col" style={{ minHeight: '100vh' }}>
      <Header />
      {/* Three-panel workspace */}
      <div
        className="flex flex-1"
        style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}
      >
        <Sidebar />
        <Editor />
        <Preview />
      </div>
      <Footer />
    </div>
  )
}

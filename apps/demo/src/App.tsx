import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './components/Landing'
import SupportDemo from './components/SupportDemo'
import DocumentDemo from './components/DocumentDemo'
import WorkflowDemo from './components/WorkflowDemo'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#030712] text-gray-100 antialiased">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/support" element={<SupportDemo />} />
          <Route path="/document" element={<DocumentDemo />} />
          <Route path="/workflow" element={<WorkflowDemo />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

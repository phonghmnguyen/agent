import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from '@/pages/Landing';
import Questionnaire from '@/pages/Questionnaire';
import Routine from '@/pages/Routine';
import RootLayout from '@/layouts/Layout';

function App() {

  return (
    <Router>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/routine" element={<Routine />} />
        </Routes>
      </RootLayout>

    </Router>
  )
}

export default App

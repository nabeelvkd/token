import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './assets/pages/Home';


import './App.css'

function App() {
  return (
    <div className="pb-16 min-h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        
          <Route path="*" element={<div className="p-4 text-center text-red-600">404: Route Not Found</div>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
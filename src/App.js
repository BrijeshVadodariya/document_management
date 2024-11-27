import './App.css';
import DocumentList from './components/documnetList';
import DocumentForm from './components/documentForm';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
          <Route path="/" element={<DocumentList />} /> {/* Display DocumentList on Home page */}
          {/* <Route path="/document-form" element={<DocumentForm />} /> Display DocumentForm when clicked */}
        </Routes>
    </div>
  </Router>

  );
}

export default App;

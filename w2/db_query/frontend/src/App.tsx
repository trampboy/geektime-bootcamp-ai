import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { QueryPage } from './pages/QueryPage';

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/query/:name?" element={<QueryPage />} />
      </Routes>
    </Router>
  );
}

export default App;

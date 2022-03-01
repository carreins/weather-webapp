import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import FrontPage from './components/FrontPage/FrontPage';
import SearchLocations from './components/SearchLocations/SearchLocations';
import TravelSuggestions from './components/TravelSuggestions/TravelSuggestions';

import Menu from './components/UI/Menu';
import MainArea from './components/UI/MainArea';

import './App.css';

function App() {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const toggleHandler = () => setMenuIsOpen(prev => !prev);

  return (
    <div className="App">
      <header>
        
      </header>
      <Menu isOpen={menuIsOpen} onToggle={toggleHandler}/>
      <MainArea menuIsOpen={menuIsOpen}>
        <Routes>
          <Route path='/' element={<FrontPage />}/>
          <Route path='/search' element={<SearchLocations/>}/>
          <Route path='/suggestions' element={<TravelSuggestions/>}/>
        </Routes>
      </MainArea>
    </div>
  );
}

export default App;

/*IMPORTS */
/*React and React module dependencies */
import { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

/*Custom component pages */
import FrontPage from './components/FrontPage/FrontPage';
import SearchLocations from './components/SearchLocations/SearchLocations';
import TravelSuggestions from './components/TravelSuggestions/TravelSuggestions';

/*Custom UI components */
import Menu from './components/UI/Menu';
import MainArea from './components/UI/MainArea';

/*Component stylesheet import */
import './App.css';

/*IMPORTS END */

function App() {

  /*useState */
  const [menuIsOpen, setMenuIsOpen] = useState(false);


  /*Functions */
  const toggleHandler = () => setMenuIsOpen(prev => !prev);


  /*Content */
  return (
    <div className="App">
      <BrowserRouter>
        <Menu isOpen={menuIsOpen} onToggle={toggleHandler}/>
        <MainArea menuIsOpen={menuIsOpen}>
          <Routes>
            <Route path='/' element={<FrontPage />}/>
            <Route path='/search' element={<SearchLocations/>}/>
            <Route path='/suggestions' element={<TravelSuggestions/>}/>
          </Routes>
        </MainArea>
      </BrowserRouter>
    </div>
  );
}

export default App;
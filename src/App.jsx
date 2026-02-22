import React, { useState, createContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from './Pages/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import Video from './Pages/Video/Video';
import Search from './Pages/Search/Search';

// Create Theme Context
export const ThemeContext = createContext();


function App() {
  const [sidebar, setSidebar] = useState(true);
  const [catagory, setCatagory] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // Update localStorage and apply theme when darkMode changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <Navbar sidebar={sidebar} setSidebar={setSidebar} />
      <Routes>
        <Route path='/' element={<Home sidebar={sidebar} setSidebar={setSidebar} catagory={catagory} setCatagory={setCatagory} />} />
        <Route path='/video/:catagoryId/:videoId' element={<Video/>} />
        <Route path='/search' element={<Search sidebar={sidebar} setSidebar={setSidebar} catagory={catagory} setCatagory={setCatagory} />} />
      </Routes>
    </ThemeContext.Provider>
  )
}

export default App

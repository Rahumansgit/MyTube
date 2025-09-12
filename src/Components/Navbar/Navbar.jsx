import React, { useState, useContext } from 'react'
import './Navbar.css';
import menu_icon from '../../../assets/menu.png';
/* import logo from '../../../assets/org_full_logo.png'; */
import logo_dark from '../../../assets/mytube_logo_dark.png';
import logo_light from '../../../assets/mytube_logo_light.png';
import search_icon from '../../../assets/search.png';
import upload from '../../../assets/upload.png'
import more from '../../../assets/more.png'
import notification from '../../../assets/notification.png'
import profil1 from '../../../assets/jack.png'
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeContext } from '../../App';


export default function Navbar({setSidebar , sidebar}) {

    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const { darkMode, setDarkMode } = useContext(ThemeContext);
    
    // Check if we're on the video page or search page
    const isVideoPage = location.pathname.startsWith('/video/');
    /* const isSearchPage = location.pathname.startsWith('/search'); */
    
    // Toggle theme function
    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

  return (
    <div className='navbar'>
        <div className="navbar-left">
            {!isVideoPage && (
                <img onClick={()=>{setSidebar(sidebar? false : true);}} src={menu_icon} className='menu-icon' />
            )}
            <img src={`${darkMode ? logo_dark : logo_light}`} alt="LOGO" className='logo' onClick={()=>{navigate('/')}}/>
        </div>
    <div className="navbar-middle">
        <form className="search-box" onSubmit={handleSearch}>
            <input 
                type="text" 
                placeholder='Search...' 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
                <img src={search_icon} alt="Search" />
            </button>
        </form>
    </div>
    <div className="navbar-right">
        <div className="theme-toggle" onClick={toggleTheme}>
            <div className={`toggle-switch ${darkMode ? 'active' : ''}`}>
                <div className="toggle-circle"></div>
            </div>
        </div>
        <img src={upload} />
        <img src={more} />
        <img src={notification} />
        <img src={profil1} className='profile' />
    </div>

    </div>
  )
}

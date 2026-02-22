import React, { useEffect } from 'react'
import './Sidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import home from '../../../assets/home.png';
import game from '../../../assets/game_icon.png';
import automobiles from '../../../assets/automobiles.png';
import sports from '../../../assets/sports.png';
import entertainment from '../../../assets/entertainment.png';
import tech from '../../../assets/tech.png';
import music from '../../../assets/music.png';
import blogs from '../../../assets/blogs.png';
import news from '../../../assets/news.png';
import profile1 from '../../../assets/jack.png';
import profile2 from '../../../assets/simon.png';
import profile3 from '../../../assets/tom.png';
import profile4 from '../../../assets/megan.png';
import profile5 from '../../../assets/cameron.png';

export default function Sidebar({sidebar , catagory, setCatagory, setSidebar}) {
  const navigate = useNavigate();
  const location = useLocation();
  const isSearchPage = location.pathname.startsWith('/search');

  const handleCategoryClick = (newCategory) => {
    setCatagory(newCategory);
    if (location.pathname.startsWith('/search')) {
      navigate('/');
    }
  };

  // Check if we're on mobile
  const isMobile = window.innerWidth <= 600;

  // Handle overlay click to close sidebar on mobile
  const handleOverlayClick = () => {
    if (isMobile && sidebar && setSidebar) {
      setSidebar(false);
    }
  };

  // Add/remove body scroll lock when mobile sidebar is open
  useEffect(() => {
    if (isMobile && sidebar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebar, isMobile]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && sidebar && (
        <div 
          className="sidebar-overlay show" 
          onClick={handleOverlayClick}
        />
      )}
      
      <div className={`${sidebar? `sidebar ${isMobile ? 'mobile-open' : ''}` : 'sidebar small-sidebar'}`}>
        <div className="shortcut-links">
          <div className={`side-link ${catagory===0 && !isSearchPage? "active" : ""}`} onClick={()=>{handleCategoryClick(0)}}>
            <img src={home} /> <p>Home</p>
          </div>
          <div className={`side-link ${catagory===20 && !isSearchPage? "active" : ""}`} onClick={()=>{handleCategoryClick(20)}}>
            <img src={game} /> <p>Gaming</p>
          </div>
          <div className={`side-link ${catagory===2 && !isSearchPage? "active" : ""}`} onClick={()=>{handleCategoryClick(2)}}>
            <img src={automobiles} /> <p>Automobiles</p>
          </div>
          <div className={`side-link ${catagory===17 && !isSearchPage? "active" : ""}`} onClick={()=>{handleCategoryClick(17)}}>
            <img src={sports} /> <p>Sports</p>
          </div>
          <div className={`side-link ${catagory===24 && !isSearchPage? "active" : ""}`} onClick={()=>{handleCategoryClick(24)}}>
            <img src={entertainment} /> <p>Entertainment</p>
          </div>
          <div className={`side-link ${catagory===28 && !isSearchPage? "active" : ""}`} onClick={()=>{handleCategoryClick(28)}}>
            <img src={tech} /> <p>Technology</p>
          </div>
          <div className={`side-link ${catagory===10 && !isSearchPage? "active" : ""}`} onClick={()=>{handleCategoryClick(10)}}>
            <img src={music} /> <p>Music</p>
          </div>
          <div className={`side-link ${catagory===22 && !isSearchPage? "active" : ""}`} onClick={()=>{handleCategoryClick(22)}}>
            <img src={blogs} /> <p>Blogs</p>
          </div>
          <div className={`side-link ${catagory===25 && !isSearchPage? "active" : ""}`} onClick={()=>{handleCategoryClick(25)}}>
            <img src={news} /> <p>News</p>
          </div>
          <hr />
        </div>
        <div className='subscribed-list'>
          <h3>Subscribed</h3>
          <div className='side-link'>
            <img src={profile1} /> <p>A2D Channel</p>
          </div>
          <div className='side-link'>
            <img src={profile2} /> <p>PewDiePie</p>
          </div>
          <div className='side-link'>
            <img src={profile3} /> <p>Techno Blade</p>
          </div>
          <div className='side-link'>
            <img src={profile4} /> <p>Reshi Pedia</p>
          </div>
          <div className='side-link'>
            <img src={profile5} /> <p>Magnet Family</p>
          </div>
        </div>
      </div>
    </>
  )
}

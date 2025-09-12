import React, { useState, useEffect } from 'react'
import '../Search/Search.css';
import { API_KEY, valueConverter } from '../../Data';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Sidebar from '../../Components/Sidebar/Sidebar';

export default function Search({ sidebar, setSidebar, catagory, setCatagory }) {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);

    const formatDuration = (duration) => {
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    
        match.shift(); 
    
        const [hours, minutes, seconds] = match.map(part => part ? parseInt(part.replace(/\D/, '')) : 0);
    
        const h = hours > 0 ? `${hours}:` : '';
        const m = hours > 0 && minutes < 10 ? `0${minutes}:` : `${minutes}:`;
        const s = seconds < 10 ? `0${seconds}` : seconds;
    
        return `${h}${m}${s}`;
    };

    const fetchSearchResults = async (pageToken = null) => {
        if (!query) return;
        
        setLoading(true);
        const pageTokenParam = pageToken ? `&pageToken=${pageToken}` : '';
        const searchUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}${pageTokenParam}`;
        
        try {
            const response = await fetch(searchUrl);
            const data = await response.json();
            
            // Fetch video statistics and categoryId for each result
            const videoIds = data.items.map(item => item.id.videoId).join(',');
            const statsUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=statistics,snippet,contentDetails&id=${videoIds}&key=${API_KEY}`;
            const statsResponse = await fetch(statsUrl);
            const statsData = await statsResponse.json();
            
            // Combine search results with statistics and categoryId
            const resultsWithStats = data.items.map((item, index) => ({
                ...item,
                statistics: statsData.items[index]?.statistics || { viewCount: '0' },
                categoryId: statsData.items[index]?.snippet?.categoryId || '0',
                contentDetails: statsData.items[index]?.contentDetails || { duration: 'PT0S' }
            }));
            
            if (pageToken) {
                setSearchResults(prev => [...prev, ...resultsWithStats]);
            } else {
                setSearchResults(resultsWithStats);
            }
            setNextPageToken(data.nextPageToken);
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMoreResults = async () => {
        if (!nextPageToken || loadingMore) return;
        
        setLoadingMore(true);
        const searchUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&pageToken=${nextPageToken}&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`;
        
        try {
            const response = await fetch(searchUrl);
            const data = await response.json();
            
            // Fetch video statistics and categoryId for each result
            const videoIds = data.items.map(item => item.id.videoId).join(',');
            const statsUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=statistics,snippet,contentDetails&id=${videoIds}&key=${API_KEY}`;
            const statsResponse = await fetch(statsUrl);
            const statsData = await statsResponse.json();
            
            // Combine search results with statistics and categoryId
            const resultsWithStats = data.items.map((item, index) => ({
                ...item,
                statistics: statsData.items[index]?.statistics || { viewCount: '0' },
                categoryId: statsData.items[index]?.snippet?.categoryId || '0',
                contentDetails: statsData.items[index]?.contentDetails || { duration: 'PT0S' }
            }));
            
            setSearchResults(prev => [...prev, ...resultsWithStats]);
            setNextPageToken(data.nextPageToken);
        } catch (error) {
            console.error('Error loading more results:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    // Auto-load more results when scrolling
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
                loadMoreResults();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [nextPageToken, loadingMore]);

    useEffect(() => {
        if (query) {
            setSearchResults([]);
            setNextPageToken(null);
            fetchSearchResults();
        }
    }, [query]);

    return (
        <div className="search-page-container">
            <Sidebar sidebar={sidebar} setSidebar={setSidebar} catagory={catagory} setCatagory={setCatagory} />
            <div className={`search-page ${sidebar ? '' : 'large-search-page'}`}>
                <div className="search-header">
                    <h2>Search results for "{query}"</h2>
                </div>
                
                <div className="search-results">
                    {loading && searchResults.length === 0 ? (
                        // Skeleton loading
                        Array.from({ length: 8 }).map((_, index) => (
                            <div className="search-result skeleton-result" key={index}>
                                <div className="skeleton-thumbnail"></div>
                                <div className="skeleton-content">
                                    <div className="skeleton-title"></div>
                                    <div className="skeleton-channel"></div>
                                    <div className="skeleton-stats"></div>
                                </div>
                            </div>
                                         ))
                 ) : (
                     searchResults.map((item, index) => (
                         <Link 
                             to={`/video/${item.categoryId}/${item.id.videoId}`} 
                             className="search-result" 
                             key={index}
                         >
                            <div className="thumbnail">
                                <img src={item.snippet.thumbnails.medium.url} alt={item.snippet.title} />
                                <span className="video-duration">{formatDuration(item.contentDetails.duration)}</span>
                            </div>
                                                         <div className="content">
                                 <h3>{item.snippet.title}</h3>
                                 <p className="channel">{item.snippet.channelTitle}</p>
                                 <p className="stats">
                                     {valueConverter(item.statistics.viewCount)} views • {moment(item.snippet.publishedAt).fromNow()}
                                 </p>
                             </div>
                        </Link>
                    ))
                )}
            </div>
            
                         {loadingMore && (
                 <div className="load-more-results">
                     <div className="loading-spinner"></div>
                     <p>Loading more results...</p>
                 </div>
             )}
            </div>
        </div>
    )
}

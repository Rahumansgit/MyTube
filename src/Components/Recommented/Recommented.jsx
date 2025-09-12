import React, { useEffect, useState } from 'react'
import '../Recommented/Recommented.css';
/* import thumbnail1 from '../../../assets/thumbnail1.png';
import thumbnail3 from '../../../assets/thumbnail3.png';
import thumbnail4 from '../../../assets/thumbnail4.png';
import thumbnail5 from '../../../assets/thumbnail5.png';
import thumbnail6 from '../../../assets/thumbnail6.png';
import thumbnail7 from '../../../assets/thumbnail7.png';
import thumbnail8 from '../../../assets/thumbnail8.png';
import thumbnail2 from '../../../assets/thumbnail2.png'; */
import { API_KEY, valueConverter } from '../../Data';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';

export default function Recommented({catagoryId}) {

    const [videoData, setVideoData] = useState([]);
    const [visibleVideos, setVisibleVideos] = useState(50);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [loading, setLoading] = useState(false);

    const formatDuration = (duration) => {
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    
        match.shift(); 
    
        const [hours, minutes, seconds] = match.map(part => part ? parseInt(part.replace(/\D/, '')) : 0);
    
        const h = hours > 0 ? `${hours}:` : '';
        const m = (hours > 0 || minutes > 0) ? (minutes < 10 && hours > 0 ? `0${minutes}:` : `${minutes}:`) : '';
        const s = seconds < 10 ? `0${seconds}` : seconds;

        if (hours === 0 && minutes === 0) {
            return `0:${s}`;
        }
    
        return `${h}${m}${s}`;
    };

    const fetchRecommendation = async(pageToken = null)=>{
        setLoading(true);
        const maxResults = pageToken ? 25 : 50; // Initial 50, then 25
        const pageTokenParam = pageToken ? `&pageToken=${pageToken}` : '';
        const videoData_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=${maxResults}&regionCode=IN&videoCategoryId=${catagoryId}&key=${API_KEY}${pageTokenParam}`;
        
        console.log('Fetching videos:', { pageToken, maxResults, url: videoData_url });
        
        try {
            const response = await fetch(videoData_url);
            const data = await response.json();
            
            console.log('API Response:', { 
                itemsCount: data.items?.length, 
                nextPageToken: data.nextPageToken,
                hasNextPage: !!data.nextPageToken 
            });
            
            if (pageToken) {
                setVideoData(prev => [...prev, ...data.items]);
            } else {
                setVideoData(data.items);
            }
            setNextPageToken(data.nextPageToken);
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        // Reset state when category changes
        setVideoData([]);
        setNextPageToken(null);
        setLoading(false);
        fetchRecommendation();
    },[catagoryId])

    // Infinite scroll handler
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
        
        // Load more when user scrolls to 90% of the content
        if (scrollPercentage >= 0.9 && !loading && nextPageToken) {
            console.log('Loading more videos...', { scrollPercentage, loading, hasNextPage: !!nextPageToken });
            fetchRecommendation(nextPageToken);
        }
    };

  return (
    <div className='Recommented' onScroll={handleScroll}>
        <div className="recommended-container">
            {videoData.map((item , index)=>{
                return(
                <Link to={`/video/${item.snippet.categoryId}/${item.id}`} className="side-video-list" key={index}>
                    <div className="recommend-thumbnail">
                        <img src={item.snippet.thumbnails.medium.url} alt="" />
                        <span className="video-duration">{formatDuration(item.contentDetails.duration)}</span>
                    </div>
                    <div className="vid-info">
                        <h2>{item.snippet.title}</h2>
                        <h3>{item.snippet.channelTitle}</h3>
                        <p>{valueConverter(item.statistics.viewCount)} &bull; {moment(item.snippet.publishedAt).fromNow()}</p>
                    </div>
                </Link>
                )
            })}
            {loading && (
                <div className="loading-indicator">
                    <div className="loading-spinner"></div>
                    <p>Loading more videos...</p>
                </div>
            )}
            {!loading && !nextPageToken && videoData.length > 0 && (
                <div className="no-more-videos">
                    <p>No more videos to load</p>
                </div>
            )}
        </div>
    </div>
  )
}

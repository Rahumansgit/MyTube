import React,{useEffect, useState} from 'react'
import '../Feed/Feed.css';
/* import thumbnail1 from '../../../assets/thumbnail1.png';
import thumbnail3 from '../../../assets/thumbnail3.png';
import thumbnail4 from '../../../assets/thumbnail4.png';
import thumbnail5 from '../../../assets/thumbnail5.png';
import thumbnail6 from '../../../assets/thumbnail6.png';
import thumbnail7 from '../../../assets/thumbnail7.png';
import thumbnail8 from '../../../assets/thumbnail8.png';
import thumbnail2 from '../../../assets/thumbnail2.png'; */
import { Link } from 'react-router-dom';
import { API_KEY, valueConverter } from '../../Data';
import moment from "moment";


export default function Feed({catagory}) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);

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

    const fetchData = async()=>{
        setLoading(true);
        const videolist_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=20&regionCode=IN&videoCategoryId=${catagory}&key=${API_KEY}`
        try {
            const response = await fetch(videolist_url);
            const result = await response.json();
            setData(result.items);
            setNextPageToken(result.nextPageToken);
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    }

    const loadMoreVideos = async() => {
        if (!nextPageToken || loadingMore) return;
        
        setLoadingMore(true);
        const videolist_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=20&pageToken=${nextPageToken}&regionCode=IN&videoCategoryId=${catagory}&key=${API_KEY}`
        try {
            const response = await fetch(videolist_url);
            const result = await response.json();
            setData(prev => [...prev, ...result.items]);
            setNextPageToken(result.nextPageToken);
        } catch (error) {
            console.error('Error loading more videos:', error);
        } finally {
            setLoadingMore(false);
        }
    }

    // Auto-load more videos when scrolling
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
                loadMoreVideos();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [nextPageToken, loadingMore, catagory]);

    useEffect(()=>{
        setData([]);
        setNextPageToken(null);
        fetchData();
    },[catagory])

  return (
    <div className='feed'>
        {loading ? (
            // Skeleton loading
            Array.from({ length: 12 }).map((_, index) => (
                <div className="card skeleton-card" key={index}>
                    <div className="skeleton-thumbnail"></div>
                    <div className='card-info'>
                        <div className="skeleton-title"></div>
                        <div className="skeleton-channel"></div>
                        <div className="skeleton-stats"></div>
                    </div>
                </div>
            ))
        ) : (
            data.map((item , index)=>{
                return(
                    <Link to={`/video/${item.snippet.categoryId}/${item.id}`} className="card" key={index}>
                    <div className="feed-thumbnail">
                        <img src={item.snippet.thumbnails.medium.url} alt="" />
                        <span className="video-duration">{formatDuration(item.contentDetails.duration)}</span>
                    </div>
                    <div className='card-info'>
                    <h2>{item.snippet.title}</h2>
                    <h3>{item.snippet.channelTitle}</h3>
                    <p>{valueConverter(item.statistics.viewCount)} &bull; {moment(item.snippet.publishedAt).fromNow()}</p>
                    </div>
                </Link>
                                 )
             })
         )}
        {loadingMore && (
            <div className="load-more-feed">
                <div className="loading-spinner"></div>
                <p>Loading more videos...</p>
            </div>
        )}
    </div>
  )
}
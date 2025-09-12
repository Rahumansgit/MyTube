import React, { useEffect, useState } from 'react'
import '../PlayVideo/PlayVideo.css';
import video1 from '../../../assets/video.mp4';
import like from '../../../assets/like.png';
import dislike from '../../../assets/dislike.png';
import share from '../../../assets/share.png';
import save from '../../../assets/save.png';
import jack from '../../../assets/jack.png';
import user_profile from '../../../assets/user_profile.jpg';
import { API_KEY, valueConverter } from '../../Data';
import moment from 'moment';
import { useParams } from 'react-router-dom';

export default function PlayVideo() {

    const { videoId } = useParams();

    const [apiData, setApiData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentData, setCommentData] = useState([]);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [visibleComments, setVisibleComments] = useState(50);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchVideoData = async()=>{
        setLoading(true);
        const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
        await fetch(videoDetails_url).then(response => response.json()).then(data => {
            setApiData(data.items[0]);
            setLoading(false);
        })
    }

    const fetchChannelData = async() =>{
        const channelDetails_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
        await fetch(channelDetails_url).then(res => res.json()).then(data => setChannelData(data.items[0]))

        const commentData_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`;
        await fetch(commentData_url).then(res => res.json()).then(data => {
            setCommentData(data.items);
            setNextPageToken(data.nextPageToken);
        });
    }

    const loadMoreComments = async() => {
        if (!nextPageToken) return;
        
        const commentData_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&pageToken=${nextPageToken}&videoId=${videoId}&key=${API_KEY}`;
        await fetch(commentData_url).then(res => res.json()).then(data => {
            setCommentData(prev => [...prev, ...data.items]);
            setNextPageToken(data.nextPageToken);
            setVisibleComments(prev => prev + 50);
        });
    }

    // Function to convert URLs to clickable links
    const convertUrlsToLinks = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, (url) => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="description-link">${url}</a>`;
        });
    }


    useEffect(()=>{
        fetchVideoData();
    },[videoId])

    useEffect(()=>{
        fetchChannelData();
    },[apiData])

  return (
    <div className='play-video'>
        <div className="video">
            {/* <video src={video1} controls autoPlay muted ></video> */}
            <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            <h3>{apiData ? apiData.snippet.title : <div className="skeleton-title"></div>}</h3>
            <div className="video-info">
                <p>
                    {apiData ? (
                        `${valueConverter(apiData.statistics.viewCount)} • ${moment(apiData.snippet.publishedAt).fromNow()}`
                    ) : (
                        <div className="skeleton-text"></div>
                    )}
                </p>
                <div className="btns">
                    <span>
                        <img src={like} alt="" /> 
                        {apiData ? valueConverter(apiData.statistics.likeCount) : <div className="skeleton-text-small"></div>}
                    </span>
                    <span><img src={dislike} alt="" /></span>
                    <span><img src={share} alt="" /> Share</span>
                    <span><img src={save} alt="" /> Save</span>
                </div>
            </div>
            <hr />
        </div>
        <div className="publisher">
            {channelData ? (
                <img src={channelData.snippet.thumbnails.default.url} alt="" />
            ) : (
                <div className="skeleton-avatar"></div>
            )}
            <div>
                <p>{apiData ? apiData.snippet.channelTitle : <div className="skeleton-text"></div>}</p>
                <span>
                    {channelData ? (
                        `${valueConverter(channelData.statistics.subscriberCount)} Subscribers`
                    ) : (
                        <div className="skeleton-text-small"></div>
                    )}
                </span>
            </div>
            <button>Subscribe</button>
        </div>
        <div className="vid-discription">
            <p>
                {apiData ? (
                    <>
                        <span dangerouslySetInnerHTML={{
                            __html: convertUrlsToLinks(
                                showFullDescription 
                                    ? apiData.snippet.description 
                                    : apiData.snippet.description.length > 300 
                                        ? `${apiData.snippet.description.slice(0, 300)}...` 
                                        : apiData.snippet.description
                            )
                        }} />
                        {apiData.snippet.description.length > 300 && (
                            <span 
                                className="show-more-btn" 
                                onClick={() => setShowFullDescription(!showFullDescription)}
                            >
                                {showFullDescription ? ' Show less' : ' Show more'}
                            </span>
                        )}
                    </>
                ) : (
                    <div className="skeleton-description">
                        <div className="skeleton-line"></div>
                        <div className="skeleton-line"></div>
                        <div className="skeleton-line-short"></div>
                    </div>
                )}
            </p>
        </div>
        <hr />
        <h4>
            {apiData ? (
                `${valueConverter(apiData.statistics.commentCount)} Comments`
            ) : (
                <div className="skeleton-text"></div>
            )}
        </h4>
        <div className="comment-section">
            {loading ? (
                // Skeleton comments
                Array.from({ length: 3 }).map((_, index) => (
                    <div className="comment skeleton-comment" key={index}>
                        <div className="skeleton-avatar-small"></div>
                        <div>
                            <div className="skeleton-text"></div>
                            <div className="skeleton-text-long"></div>
                            <div className="skeleton-text-small"></div>
                        </div>
                    </div>
                ))
            ) : (
                commentData.slice(0, visibleComments).map((item , index)=>{
                    return(
                    <div className="comment" key={index}>
                        <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
                        <div>
                            <h3>{item.snippet.topLevelComment.snippet.authorDisplayName}<span>{moment(item.snippet.topLevelComment.snippet.publishedAt).fromNow()}</span> </h3>
                            <p dangerouslySetInnerHTML={{ __html: item.snippet.topLevelComment.snippet.textDisplay }}></p>
                            <div className="com-actions">
                                <img src={like} alt="" /> <span>{item.snippet.topLevelComment.snippet.likeCount}</span>
                                <img src={dislike} alt="" />
                            </div>
                        </div>
                    </div>)
                })
            )}
        </div>
        {nextPageToken && commentData.length >= visibleComments && (
            <div className="load-more-comments">
                <button onClick={loadMoreComments} className="load-more-btn">
                    Load more comments
                </button>
            </div>
        )}
    </div>
  )
}


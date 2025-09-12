import React from 'react'
import '../Video/Video.css';
import PlayVideo from '../../Components/PlayVideo/PlayVideo';
import Recommented from '../../Components/Recommented/Recommented';
import { useParams } from 'react-router-dom';

export default function Video() {

  const {videoId , catagoryId } = useParams();

  return (
    <div className='video-container'>
      <PlayVideo videoId={videoId} />
      <Recommented catagoryId={catagoryId}/>
    </div>
  )
}

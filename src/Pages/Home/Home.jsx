import React,{useState} from 'react'
import '../Home/Home.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Feed from '../../Components/Feed/Feed';

export default function Home({sidebar, setSidebar}) {

  const [catagory, setCatagory] = useState(0);

  return (
    <div>
        <Sidebar sidebar={sidebar} catagory={catagory} setCatagory={setCatagory} setSidebar={setSidebar} />
        <div className={`container ${sidebar? '' : 'large-container'}`}>
        <Feed catagory={catagory} setCatagory={setCatagory} />
        </div>
    </div>
  )
}

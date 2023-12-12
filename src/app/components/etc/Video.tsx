"use client";
import { useRef, useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { useRecoilValue } from 'recoil';
import { selectedPinState } from '../../recoil/dataRecoil';

export default function Video() {
  const videoRef = useRef(null);
  const [videoUrls, setVideoUrl] = useState([]);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const pathname = usePathname().split('/');
  // const dID = pathname[2] //URL에서 dID 파라미터 추출
  const dID = useRecoilValue(selectedPinState);

  useEffect(() => {
    
    //API 호출을 통해 비디오 URL 배열 가져오기
    async function fetchVideoUrls() {
      if (!dID) return;
      try {
        const response = await fetch(`https://worldisaster.com/api/upload/${dID}`);
        const data = await response.json();
    
        if (data && data.length > 0 && data[0].video_url) {
          console.log(data[0]);
          console.log(data[0].video_url);
          setVideoUrl(data.map((item: { video_url: any; }) => item.video_url));
          setCurrentVideoUrl(data[0].video_url);
        } else {
          // 데이터가 비어있거나 예상된 형식이 아닌 경우 처리
          console.error("No video data available");
        }
      } catch (error) {
        console.error("Error fetching video URLs:", error);
      }
    }

    fetchVideoUrls();
  }, [dID]); //dID가 변경될때마다 fetchVideoUrls() 실행

  useEffect(() => {
    if(videoRef.current && currentVideoUrl) {
      videojs(videoRef.current, {
        sources: [
          {
            src: currentVideoUrl,
            type: "application/x-mpegURL"
          }
        ]
      });
    }

  }, [currentVideoUrl]);

  return (
    <div>
      <video controls ref={videoRef} className="video-js" />
    </div>
  );
}
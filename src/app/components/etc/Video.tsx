"use client";
import { useRef, useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { useRecoilValue } from 'recoil';
import { selectedPinState } from '../../recoil/dataRecoil';

export function Video() {
  const videoRef = useRef(null);
  const [videoUrls, setVideoUrls] = useState([]);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dID = useRecoilValue(selectedPinState);

  useEffect(() => {
    //API 호출을 통해 비디오 URL 배열 가져오기
    async function fetchVideoUrls() {
      if (!dID) return;
      try {
        const response = await fetch(`https://worldisaster.com/api/upload/${dID}`);
        const data = await response.json();

        if (data && data.length > 0 && data[0].video_url) {
          setVideoUrls(data.map((item: { video_url: any; }) => item.video_url));
          setCurrentVideoUrl(data[0].video_url);
        } else {
          setError("No approved videos available");
        }
      } catch (error) {
        console.error("Error fetching video URLs:", error);
      }
    }
    fetchVideoUrls();
  }, [dID]); //dID가 변경될때마다 fetchVideoUrls() 실행

  useEffect(() => {
    if (videoRef.current && currentVideoUrl) {
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
    <div className="bg-blue-500 max-w-[80%] max-h-[600px] m-auto p-auto overflow-hidden flex items-center justify-center">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <video controls ref={videoRef} className="video-js object-contain" />
      )}
    </div>
  );
}

export default Video;
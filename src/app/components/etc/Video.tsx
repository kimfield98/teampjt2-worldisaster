import React, { useEffect, useState,useRef, createRef, RefObject } from "react";
import axios from "axios";
import videojs from "video.js"
import "video.js/dist/video-js.css";

interface VideoData {
  video_url: string;
}

interface VideoPlayerProps {
  dID: string;
}

const Video: React.FC<VideoPlayerProps> = ({ dID }) => {
  const [videoData, setVideoData] = useState<VideoData[]>([]);
  const [videoRefs, setVideoRefs] = useState<RefObject<HTMLVideoElement>[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios(`https://worldisaster.com/api/upload/${dID}`, { timeout: 5000 });
        if (response.data.length > 0) {
          setVideoData(response.data);
        }
      } catch (err) {
        console.error("Error fetching videos:", err);
      }
    };
    fetchVideos();
  }, [dID]);

  useEffect(() => {
    videoData.forEach((video, index) => {
      const videoRef = createRef<HTMLVideoElement>();
      setVideoRefs((prev) => [...prev, videoRef]);
      // Video.js 초기화 및 설정
    });
    // Clean up
    return () => {
      videoRefs.forEach((ref) => {
        if (ref.current && videojs.getPlayers()[ref.current.id]) {
          videojs.getPlayers()[ref.current.id].dispose();
        }
      });
    };
  }, [videoData]);

  return (
    <>
      {videoData.length > 0 && (
        <div className="flex overflow-x-scroll snap-x snap-mandatory">
          {videoRefs.map((video, index) => (
            <div key={index} className="mx-60 snap-center w-80 bg-blue-500 flex-shrink-0">
              <video
                ref={video}
                className="video-js !w-full !h-[500px]"
                controls
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Video;
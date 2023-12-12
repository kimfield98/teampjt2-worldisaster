import React, { useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { Button } from "@nextui-org/react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { set } from "video.js/dist/types/tech/middleware";

interface VideoUploaderProps {
  dID: string;
  onUploadComplete: (videoUrl: string) => void;
}

interface VideoPlayerProps {
  dID: string;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ dID }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];

      // 파일 크기 및 이름 검사 로직
      if (file.size > 10 * 1024 * 1024) {
        setFileError('파일 크기가 10MB를 초과합니다.');
        return;
      }

      if (file.name.length > 12) {
        setFileError('파일 이름 길이가 12자를 초과합니다.');
        return;
      }

      setFile(file);
      setFileName(file.name);
      setFileError('');
    }
  };

  const DropCancel = () => {
    setFile(null);
    setFileName("");
  };

  const uploadVideo = async () => {
    if (!file) {
      setFileError('파일을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setFileError('');

    try {
      const response = await axios.post(`https://worldisaster.com/api/upload/${dID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }});
      console.log(response.data);
      setFileError('업로드가 완료되었습니다.');
    } catch (error:any) {
      if (error.code === 'ECONNABORTED') {
        console.error("업로드 시간 초과",error);
        setFileError('업로드 시간이 초과되었습니다.');
      } else {
        console.error("업로드 실패", error);
        setFileError('업로드 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
      alert(fileError)
    }
  };

  return (
    <div>
      {fileError && <div>{fileError}</div>}
      <div
        className=" rounded-lg bg-white text-black w-full h-20 flex justify-center items-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {fileName ? 
        <>
        선택된 파일: {fileName}
          <div className="m-2" onClick={DropCancel}>
            <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-black hover:text-gray-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </div>
        </>: '비디오 파일을 여기에 드래그하세요'}
      </div>
      <Button onClick={uploadVideo}>업로드</Button>
    </div>
  );
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ dID }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`https://worldisaster.com/api/upload/${dID}`);
        setVideoUrls(response.data[0].video_url);
      } catch (err) {
        setError("동영상을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [dID]);

  useEffect(() => {
    if (videoRef.current && videoUrls.length > 0) {
      if (!videojs.getPlayers()[videoRef.current.id]) {
        // Video.js 플레이어가 아직 초기화되지 않았으면 초기화
        videojs(videoRef.current, {
          sources: [{ src: videoUrls[0], type: "application/x-mpegURL" }],
        });
      } else {
        // 이미 초기화된 플레이어가 있으면 소스만 변경
        const player = videojs.getPlayers()[videoRef.current.id];
        player.src({ src: videoUrls[0], type: "application/x-mpegURL" });
      }
    }

    // 컴포넌트 언마운트 시 플레이어 제거
    return () => {
      if (videoRef.current && videojs.getPlayers()[videoRef.current.id]) {
        videojs.getPlayers()[videoRef.current.id].dispose();
      }
    };
  }, [videoUrls, dID]); // dID도 종속성 배열에 추가

  return (
    <div>
      {loading && <p>동영상 불러오는 중...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <div>
          <video ref={videoRef} className="video-js !w-[100%]" controls />
        </div>
      )}
      {/* {videoData.name.map((item:any,index:number) => (
        <div key={index} >
          {item}
        </div>
      ))}; */}
    </div>
  );
};


const DidVideo: React.FC<VideoPlayerProps> = ({ dID }) => {
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>("");

  const handleUploadComplete = (videoUrl: string) => {
    setUploadedVideoUrl(videoUrl); // 업로드된 비디오 URL 상태 업데이트
    // 추가적으로 필요한 작업 수행 (예: 메시지 표시, 로그 기록 등)
  };

  return (
    <div>
      <VideoPlayer dID={dID} />
      <VideoUploader dID={dID} onUploadComplete={handleUploadComplete} />
    </div>
  );
};

export default DidVideo;
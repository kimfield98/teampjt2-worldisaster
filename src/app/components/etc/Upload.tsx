import React, { useState } from "react";
import axios from "axios";
import { useRecoilValue } from 'recoil';
import { darkModeState } from "../../recoil/dataRecoil";

interface VideoUploaderProps {
  dID: string;
}

const Upload: React.FC<VideoUploaderProps> = ({ dID }) => {
  const [file, setFile] = useState<File | null>(null); // 선택된 파일
  const [fileName, setFileName] = useState<string>(""); // 파일 이름
  const [fileError, setFileError] = useState<string>(""); // 파일 업로드 오류
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태
  const isDarkMode = useRecoilValue(darkModeState); // 다크모드

  // 파일 드래그 오버 이벤트 핸들러
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // 기본 이벤트 방지
  };

  // 파일 드롭 이벤트 핸들러
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // 기본 이벤트 방지
    const files = e.dataTransfer.files; // 드롭된 파일들
    if (files.length > 0) {
      const file = files[0]; // 첫 번째 파일

      // 파일 크기 및 이름 검사
      if (file.size > 10 * 1024 * 1024) {
        setFileError('File size exceeds 10 MB.'); // 파일 크기 제한 초과
        return;
      }

      if (file.name.length > 12) {
        setFileError('File name exceeds 12 characters.'); // 파일 이름 길이 제한 초과
        return;
      }

      // 파일 상태 업데이트
      setFile(file);
      setFileName(file.name);
      setFileError('');
    }
  };

  // 파일 선택 취소 함수
  const DropCancel = () => {
    setFile(null); // 파일 상태 초기화
    setFileName(""); // 파일 이름 초기화
  };

  // File upload function
  const uploadVideo = async () => {
    if (!file) {
      setFileError('Please select a file to upload.'); // 파일 선택 여부 체크
      return;
    }

    // File upload logic
    const formData = new FormData();
    formData.append("file", file); // 폼 데이터 생성

    setLoading(true); // 로딩 상태 활성화
    setFileError('');

    try {
      // 파일 업로드 요청
      const response = await axios.post(`https://worldisaster.com/api/upload/${dID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }, timeout: 30000
      });
      // 업로드 완료 메시지 설정
      setFileError('Upload completed.');
    } catch (error: any) {
      // 에러 핸들링
      if (error.code === 'ECONNABORTED') {
        console.error("Upload time exceeded", error);
        setFileError('Request timed out during upload.'); // 업로드 시간 초과
      } else {
        console.error("Upload failed.", error);
        setFileError('An error occurred during upload.'); // 업로드 실패
      }
    } finally {
      setLoading(false); // 로딩 상태 비활성화
      alert(fileError) // 에러 메시지 표시
    }
  };

  // 에러 메시지 자동 초기화
  setTimeout(() => {
    setFileError("")
  }, 5000)

  return (
    <>
      <div>
        <div style={{ margin: '20px' }}>
          <p>Should you find yourself at the location of a disaster, or if you've acquired local footage <b>without breaching relevant copyright laws</b>, we encourage you to support our community by submitting any videos related to this specific event. Your submission will be reviewed then put on display.</p>
        </div>
        <div onDragOver={handleDragOver} onDrop={handleDrop}>
          {fileName ?
            (
              <div className={`card2 ${isDarkMode ? 'darkMode' : ''}`}>
                <div className="flex justify-between items-center">
                  <span>Selected file: {fileName}</span>
                  <div onClick={DropCancel}>
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-black hover:text-gray-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              fileError ? (
                <div className={`card2 ${isDarkMode ? 'darkMode' : ''} flex justify-center items-center text-red-400`}>{fileError}</div>
              ) : (
                <div className={`card2 ${isDarkMode ? 'darkMode' : ''} flex justify-center items-center`}>
                  <div className="cardContent ">Please drag your file here (10MB limit).</div>
                </div>
              )
            )
          }
        </div>
        <div className="btnBox">
          <button className="btn" onClick={uploadVideo}>Upload</button>
        </div>
      </div>
    </>
  );
};

export default Upload;

"use client"

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from "next/navigation";
import Cookies from 'js-cookie';
import axios from 'axios'
import { useRecoilState } from 'recoil';
import { UserType, userLoginState } from '../recoil/dataRecoil';

interface UserInfo {
  name: string;
  email: string;
  provider: string;
}

///////////// Navbar /////////////
export const Navbar = () => {
  const [userInfo, setuserInfo] = useState<UserInfo[]>([]);
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [loginState, setLoginState] = useRecoilState<UserType>(userLoginState);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const settingButtonRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = Cookies.get("access-token");
    const getuserInfo = async () => {
      try {
        const response = await axios.get<UserInfo>(
          "https://worldisaster.com/api/auth/info",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data) {
          setuserInfo([response.data]);
        } else {
          setuserInfo([]);
        }
      } catch (error) {
        console.log("Log: Failed to retrieve UserInfo data:", error);
        setuserInfo([]);
      }
    };
    getuserInfo();
  }, [pathname]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("access-token");
        const response = await axios.get<UserInfo>("https://worldisaster.com/api/auth/info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );
        console.log("Log: Successfully fetched subscription details:", response.data);
      } catch (error) {
        console.error("Log: Failed to fetch subscription details.", error);
      }
    };

    fetchData();
  }, []);


  // 로그아웃 클릭 시 get 요청
  const handleLogout = async () => {
    const token = Cookies.get('access-token');
    try {
      await axios.get('https://worldisaster.com/api/auth/logout/', {
        headers: {
          'Authorization': `Bearer ${token}` // 헤더에 토큰 추가
        }
      });
      setLoginState({ isLoggedIn: false, userInfo: null });
      alert('Log-out successful. Hope to see you again soon!');
    } catch (error) {
      console.error('Log: Logout failed:', error);
    }
  };

  const handleWithdrawal = async () => {
    const isConfirmed = confirm("Are you sure you want to delete your account? We do more good with you on board.");
    if (!isConfirmed) {
      return;
    }

    const token = Cookies.get("access-token");

    try {
      setLoading(true);

      const response = await axios.post(
        "https://worldisaster.com/api/auth/delete",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Log: Successfully deleted your account:", response.data);
      // Check if there is a redirectUrl in the response
      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl; // Redirect to the specified URL
      } else {
        alert('Your account was successfully deleted. We hope to win you back soon.'); // Change confirmation message
      }
    } catch (error) {
      console.error("Log: Failed to delete your account:", error);
    } finally {
      setLoading(false);
    }
  };

  // 모달을 토글하는 함수
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // 외부 클릭 감지를 위한 함수
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && !settingButtonRef.current?.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalRef, settingButtonRef]);

  return (
    <div className="navbar">
      <input
        type="text"
        placeholder="Search for a country or region"
        className='navSearchbar'
      />
      <div className='navIcon'>
        <img src="/Nav/light.svg" alt="Light" />
      </div>
      <div>
        {loginState.isLoggedIn ? (
          <>
            <div className='navIcon' ref={settingButtonRef} onClick={toggleModal}>
              <img src="/Nav/setting.svg" alt="Setting" />
            </div>
            {isModalOpen && (
              <div className="navSettingModal" ref={modalRef}>
                <div className='cardTitle'>👤 Account Details 👤</div>
                <div className="cardContent">
                  {userInfo.map((data, index) => (
                    <div key={index}>
                      <p>Name: {data.name}</p>
                      <p>Email: {data.email}</p>
                    </div>
                  ))}
                </div>
                <div className='cardTitle'>👋 Account Delete 👋</div>
                <div className="cardContent">
                  <p>Are you sure you want to</p>
                  <p>opt-out of WorlDisasters?</p>
                  <p> There is no going back.</p>
                  <div className='btnBox'>
                    <button className="btn" onClick={handleWithdrawal} disabled={loading}>
                      Yes, I'd like to delete anyways.
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div>
              <a onClick={handleLogout}>Logout</a>
            </div>
          </>
        ) : (
          <>
            <div>
              <a href="https://worldisaster.com/api/auth/google">Login</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
  
};

export default Navbar;

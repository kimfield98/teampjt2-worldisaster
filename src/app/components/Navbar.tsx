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
    const fetchUserInfo = async () => {
      const token = Cookies.get('access-token');
      if (token) {
        try {
          const response = await axios.get('https://worldisaster.com/api/auth/', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setLoginState({ isLoggedIn: true, userInfo: response.data });
          console.log('Log: Please provide login information', response);
        } catch (error) {
          console.error('Log: Error fetching user info:', error);
        }
      }
    };

    fetchUserInfo();
  }, [setLoginState]);


  // const handleLogin = async () => {
  //   try {
  //     const currentUrl = window.location.href;
  //     const encodedUrl = encodeURIComponent(currentUrl);
  //     const response = await axios.get(`https://worldisaster.com/api/auth/google/url?preLoginUrl=${encodedUrl}`);
  //     const { url } = response.data;
  //     window.location.href = url; // 받아온 URL로 리다이렉트
  //   } catch (error) {
  //     console.error('Log: Error fetching auth URL:', error);
  //   }
  // };


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
      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      } else {
        alert('Your account was successfully deleted. We hope to win you back soon.');
      }
    } catch (error) {
      console.error("Log: Failed to delete your account:", error);
    } finally {
      setLoading(false);
    }
  };


  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };


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

"use client"

import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios'
import { useRecoilState } from 'recoil';
import { userLoginState } from '../recoil/dataRecoil';


///////////// Navbar /////////////
export const Navbar = () => {
  const [loginState, setLoginState] = useRecoilState(userLoginState);

  // 토큰이 있으면 로그인 상태로 바꾸는 함수
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
      <div className='navIcon'>
        <img src="/Nav/setting.svg" alt="Setting" />
      </div>
      <div>
        {loginState.isLoggedIn ? (
          <>
            <span>
              <a onClick={handleLogout}>Logout</a>
            </span>
          </>
        ) : (
          <>
            <span>
              <a href="https://worldisaster.com/api/auth/google">Login</a>
            </span>
          </>
        )}
      </div>
    </div>
  );
  
};

export default Navbar;

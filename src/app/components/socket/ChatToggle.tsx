"use client"

import React, { useEffect } from 'react';
import ChatModule from './ChatModule';
import { useRecoilState } from 'recoil';
import { chatState, leftSidebarState, rightSidebarState } from '@/app/recoil/dataRecoil';


const ChatToggleComponent = () => {
    const [isChatOpen, setIsChatOpen] = useRecoilState(chatState);
    const [{ activeIcon }, setLeftSidebar] = useRecoilState(leftSidebarState);
    const [, setRightSidebar] = useRecoilState(rightSidebarState);

    // 채팅이 활성화될 때 필터를 비활성화
    useEffect(() => {
        if (isChatOpen) {
        setRightSidebar(prevState => ({
            ...prevState,
            isOpen: false
        }));
        }
    }, [isChatOpen, setRightSidebar]);

    /* 채팅 토글을 열면 스크롤 이동 */
    useEffect(() => {
        if (isChatOpen) {
            const messageList = document.querySelector('.message-list');
            if (messageList) {
                const lastMessage = messageList.querySelector('.rce-container-mbox:last-child');
                if (lastMessage) {
                    lastMessage.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
        if (!isChatOpen && activeIcon === 'chat') {
            setLeftSidebar(prev => ({ ...prev, activeIcon: '' }));
        }
    }, [isChatOpen, activeIcon, setLeftSidebar]);

    /* 채팅창 상단바 클릭용 함수 */
    const handleTopBarClick = (e: any) => {
        // Prevents the click from reaching the top bar if it's the button that's clicked
        e.stopPropagation();
    };


    const chatModuleContainerStyle: React.CSSProperties = {
        display: isChatOpen ? 'flex' : 'none',
        flexDirection: 'column',
        position: 'fixed',
        justifyContent: 'flex-start',
        bottom: '0',
        right: '10px',
        maxWidth: '400px',
        width: '90%',
        maxHeight: '600px',
        height: '80vh',
        borderRadius: '10px',
        padding: '0',
        zIndex: 200,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
    };

    const topChatBarStyle: React.CSSProperties = {
        width: '100%',
        padding: '10px 15px',
        backgroundColor: '#2f648ded',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
    };

    const closeButtonStyle: React.CSSProperties = {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '20px',
    };

    return (
        <>
            <div style={chatModuleContainerStyle}>
              <div style={topChatBarStyle} onClick={handleTopBarClick}>
                WorlDisaster Global Chat
                <button
                  onClick={(e) => {
                      e.stopPropagation();
                      setIsChatOpen(false);
                  }}
                  style={closeButtonStyle}
                >
                <img src="/Left/x.svg" alt="X" />
                </button>
              </div>
              <ChatModule />
            </div>
        </>
    );
};

export default ChatToggleComponent;
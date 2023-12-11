"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { MessageList, Input, Button, Popup } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import { useRecoilValue } from 'recoil';
import { userLoginState } from '@/app/recoil/dataRecoil';
/* 채팅 메시지의 구조 */
interface ChatMessage {
  chatSenderID: string;
  chatRoomID: string;
  chatMessage: string;
  chatMessageID: number;
  createdAt: string;
}
/* 로그인 및 유저 정보 활용을 위한 구조 */
interface User {
  email: string;
  name: string;
  provider: string;
}
/* 실제 모듈 */
const ChatModule = () => {
  /* 유저 로그인상태 확인 */
  const loginState = useRecoilValue(userLoginState);
  const user = loginState.isLoggedIn ? (loginState.userInfo as User) : null;
  const socketRef = useRef<Socket | null>(null); // 소켓 연결은 단 한번만 (연결되면 not null로 상태값이 바뀜)
  const [message, setMessage] = useState(''); // 작성중인 메시지
  const [inputKey, setInputKey] = useState(Math.random()); // input 클리어링 버그 해결
  const [chat, setChat] = useState<ChatMessage[]>([]); // 채팅 히스토리
  const [messageListArray, setMessageListArray] = useState<any>([]); // react-chat-element 전용 리스트
  const messageListRef = useRef(); // react-chat-element에서 필요한 Reference 선언
  /* 웹소켓 연결 기능 */
  useEffect(() => {
    /* 소켓 연결이 없어야만 연결 시도 */
    if (!socketRef.current) {
      socketRef.current = io('https://worldisaster.com/chats', {
        withCredentials: true, // CORS 문제를 해결하기 위한 옵션
        path: '/socket.io', // Sockets.io 라이브러리의 표준값
        transports: ['websocket'], // 트랜스포트 방식을 "websocket"으로 지정
      });
    }
    /* 소켓 연결에 성공하면 본격적으로 소켓 기능들 접근 */
    if (socketRef.current) {
      socketRef.current.on('connect', () => {
        socketRef.current?.emit('joinRoom', 'main');
        console.log('Log: Chats websocket connection successful');
      });
      /* 연결이 끊기면 로그 발신 */
      socketRef.current.on('disconnect', () => {
        console.log('Log: Chats websocket disconnected from the server.');
      });
    }
    return () => {
      if (socketRef.current?.connected) {
        socketRef.current.disconnect();
      }
    };
  }, []);
  /* 메시지 호출, 로딩, 그리고 실시간 처리 */
  useEffect(() => {
    if (socketRef.current) {
      /* 채팅 히스토리를 불러오는 함수 */
      const fetchChatHistory = async () => {
        try {
          const response = await axios.get(`https://worldisaster.com/api/chat/room/main/12H`);
          const initialChat = response.data;
          // setChat()을 통해서 원본을 저장하긴 하지만, 이는 추후 활용 여지가 있기 때문이지 당장 필요한건 아님
          setChat(initialChat);
          // 당장 필요한건 이 메시지를 react-chat-element에서 기대하는 배열 형태로 가공하는 것
          const transformedInitialChat = initialChat.map((msg: ChatMessage) => transformMessage(msg, user));
          setMessageListArray(transformedInitialChat);
        } catch (error) {
          // console.error("Error fetching chat history:", error); // debug-only
        }
      };
      fetchChatHistory();
      /* 서버에서 newMessage 라는 제목으로 메시지를 발송, 여기서 받아서 처리 */
      socketRef.current.on('newMessage', (receivedMessage: ChatMessage) => {
        setChat((prevChat) => [...prevChat, receivedMessage]);
        const transformedMessage = transformMessage(receivedMessage, user);
        setMessageListArray((prevMessages: any) => [...prevMessages, transformedMessage]);
      });
    }
  }, [user]);
  /* 채팅 스크롤 및 유저네임 클릭 기능 관리 (react에서 추천되는 방식은 아니나, 라이브러리 한계로 부득이하게 적용) */
  useEffect(() => {
    const messageList = document.querySelector('.message-list');
    if (messageList) {
      const lastMessage = messageList.querySelector('.rce-container-mbox:last-child');
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: 'smooth' });
      }
    }
    const messageTitles = document.querySelectorAll('.rce-mbox-title');
    messageTitles.forEach((title) => {
      const htmlTitle = title as HTMLElement;
      htmlTitle.style.pointerEvents = 'none';
    });
  }, [messageListArray]);
  /* API나 웹소켓으로 받은 채팅 메시지를 react-chat-element에서 해석 가능하도록 변환하는 함수 */
  const transformMessage = (msg: ChatMessage, currentUser: User | null) => {
    const currentUserHandle = currentUser?.email.split('@')[0].trim().toLowerCase();
    const senderHandle = msg.chatSenderID.trim().toLowerCase();
    const isCurrentUser = currentUserHandle === senderHandle;
    return {
      id: msg.chatMessageID,
      position: isCurrentUser ? 'right' : 'left',
      type: 'text',
      title: senderHandle,
      text: msg.chatMessage,
      dateString: new Date(msg.createdAt).toLocaleString(),
    };
  };
  /* 메시지를 서버로 전송하는 함수 */
  const onMessageSubmit = useCallback(() => {
    if (user && message && socketRef.current) {
      const currentUserHandle = user?.email.split('@')[0].trim().toLowerCase();
      const newMessage = {
        chatSenderID: currentUserHandle,
        chatRoomID: 'main',
        chatMessage: message,
      };
      socketRef.current.emit('message', newMessage);
      setMessage('');
      setInputKey(Math.random()); // 인풋 섹션만 강제 로딩 (react-chat-element 버그로 보임)
      setTimeout(() => { // input textarea에 커서를 이동 (query-selector는 react에서 추천되는 방식이 아니지만, 라이브러리 toBottomHeight() 오작동으로 불가피)
        const textarea = document.querySelector('.chat-input textarea') as HTMLTextAreaElement;
        if (textarea) {
          textarea.focus();
        }
      }, 0);
    }
  }, [user, message, socketRef]);
  /* Component 반환값 CSS 적용 */
  const messageListStyle: React.CSSProperties = {
    margin: '20px 0',
    color: 'white',
  };
  const chatInputStyle: React.CSSProperties = {
    backgroundColor: '#262626',
    borderTop: '1px solid gray',
  };
  const loginMessageStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#7EA2BD',
    margin: '20px 0',
    padding: '10px 0px 0px 0px',
  };
  const popupStyle: React.CSSProperties = {
    color: '#1C1C1C',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '90%',
    height: 'auto',
    zIndex: 500, // 맨 위에 두기
  };
  /* 채팅 내 팝업 처리 (글자수 초과) */
  const [showPopup, setShowPopup] = React.useState(false);
  const tooManyCharacters = () => {
    setShowPopup(true);
  }
  const popup = {
    show: showPopup,
    header: "Chat Limitations",
    headerButtons: [
      {
        type: "transparent",
        color: "black",
        text: "X",
        onClick: () => {
          setShowPopup(false);
        },
      },
    ],
    text: "Your chat message is too long. Please cut it down to less than 200 characters.",
    footerButtons: [
      {
        color: "white",
        backgroundColor: "green",
        text: "Okay",
        onClick: () => {
          setShowPopup(false);
        },
      },
    ]
  }
  /* Component 전체 반환값 */
  return (
    <>
      <div className='chat'>
        <div style={messageListStyle}>
          <MessageList
            toBottomHeight={'100%'}
            className='message-list'
            referance={messageListRef}
            dataSource={messageListArray}
            lockable={true}
            messageBoxStyles={{ backgroundColor: '#333333' }} // Darker boxes for each message
            notchStyle={{ fill: '#333333' }}
          />
        </div>
        {user ? (
          <div style={chatInputStyle}>
            <Input
              key={inputKey}
              className='chat-input'
              placeholder='Type a message...'
              defaultValue=''
              multiline={true}
              maxlength={100}
              onMaxLengthExceed={tooManyCharacters}
              maxHeight={150}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
              onKeyPress={(e: any) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onMessageSubmit();
                }
              }}
              rightButtons={
                <Button
                  color='white'
                  text='Send'
                  onClick={onMessageSubmit}
                />
              }
            />
          </div>
        ) : (
          <div style={loginMessageStyle}>Please log in to use the chat.</div>
        )}
      </div>
      <div style={popupStyle}>
        <Popup popup={popup} />
      </div>
    </>
  );
};
export default ChatModule;
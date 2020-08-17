import React, { useEffect, useRef } from 'react';
import styles from './Chat.module.css'
import axios from 'axios';
import ChatInput from "../ChatInput/ChatInput"
import Dropzone from 'react-dropzone';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const Chat = ({handleAside}) => {
  //방정보를 store에 넣어서 가져올 필요가 있어보임
  let { userData } = useSelector(state => state.user)
  let { currentNs, currentRoom, nsSocket } = useSelector(state => state.chatInfo)
  // member, _id,  namespace, nsEndpoint 도 있음
  let { roomTitle, _id} = currentRoom; //roomindex를 버릴경우 여기서 에러남
  let NS_id = currentNs._id
  const [amountOfUsers, setAmountOfUsers] = useState(0);
  const [messages, setMessages] = useState([]);
  let chat_messages = useRef();
  let ulTag = useRef();
  
  useEffect(() => {
    console.log(`[${_id}]에 입장했습니다`);
    nsSocket.emit('joinRoom', NS_id, _id, (numberOfMembers) => {
      setAmountOfUsers(numberOfMembers);
    });
    setTimeout(()=>{ chat_messages.current.scrollTo(0,chat_messages.current.scrollHeight) }, 70)
    return () => { 
      console.log(`[${_id}]에서 나갔습니다`);
      //isPrivate을 false만들기
    }
  }, [nsSocket, _id, NS_id])

  useEffect(() => {
    //히스토리 추가 : 방 변경시 socket.on중복실행방지로 새 effect로정의
    nsSocket.on('historyCatchUp', (history) => {
      setMessages(history)
    });
    //메시지 수신
    nsSocket.on('messageToClients', (message) => {
      setMessages(messages => [...messages, message]);
      //스크롤부분 넣어주어야한다
      let {scrollTop, offsetHeight, scrollHeight} = chat_messages.current
      scrollTop+offsetHeight >(scrollHeight-200) && chat_messages.current.scrollTo(0,scrollHeight)
    });
    //인원수 추가
    nsSocket.on('updateMembers', numberOfMembers => {
      setAmountOfUsers(numberOfMembers);
    });
  }, [nsSocket]);

  function onDrop(files) {
    let formData = new FormData();
    formData.append('file', files[0]);
    const config = {
      header: { 'content-type': 'multipart/form-data' }
    }
    axios.post('/api/chat/uploadfiles', formData, config)
      .then((res) => {
        let { url, mimetype, filename, success } = res.data
        let { name, image } = userData
        if(success){
          nsSocket.emit('newMessageToServer', { NS_id : currentNs._id, text: url, type: mimetype, filename, userName: name, userImg: image })
          setTimeout(()=>{scrollBottom()}, 300);
        }else{
          console.log(res)
        }
      })
  }
  function roomTitleLoad() {
    if (currentRoom.isDM === undefined) { // dm이 아니면
      return (roomTitle)
    } else { // dm이면
      let dataOfOpponent = currentRoom.member.find(ele => {
        return (ele._id !== userData._id)
      })
      return (dataOfOpponent ? dataOfOpponent.name : "나간상대")
    }
  }
  function scrollBottom() {
    // scrollIntoView는 true일시 자신의 맨 위, false일시 자신의 맨 아래를 보여주게된다
    // ulTag.current.scrollIntoView(false)
    chat_messages.current.scrollTo(0,chat_messages.current.scrollHeight)
  }

  return (
    <>
      <div id={styles.chat_header}>
        <div id={styles.roomtitle}>
          {roomTitleLoad()}
        </div>
        <i
          onClick={handleAside}
          className={`large info circle icon ${styles.aside_icon}`}
        ></i>
      </div>
      <Dropzone onDrop={onDrop}>
        {({ getRootProps }) => (
          <section className={styles.dropzone}>
            <div {...getRootProps()} className={styles.dropzone}>
              <div ref={chat_messages} id={styles.chat_messages}>
                <ul ref={ulTag} id={styles.chatset_ul}>
                  {newChatList(messages, chat_messages)} {/* 채팅목록 */}
                </ul>
              </div>
            </div>
          </section>
        )}
      </Dropzone>
      <ChatInput scrollBottom={scrollBottom}></ChatInput>
    </>
  );
}
export default React.memo(Chat);

function newChatList(messages) {
  let newChatList = messages.map((message, index) => {
    let { text, type, filename, time, userName, avatar } = message;
    const convertedDate = new Date(time).toLocaleTimeString();

    const convertedMsg = convertMsg(text, type, filename);//switch문 이용해서 데이터 타입에 따라 다른 태그를 넣어줌
    return (
      <li className={styles.chatset_li} key={index}>
        <img className={styles.chatset_image} src={avatar} alt="아바타" />
        <div className={styles.chatset_message}>
          <div className={styles.chatset_name}>{userName}<small className={styles.chatset_time}>&ensp;{convertedDate}</small></div>
          {convertedMsg}
        </div>
      </li>
    )
  })
  return newChatList
}

function convertMsg(text, type, filename) {
  let tag = "";
  switch (type) {
    case 'text':
      tag = <p>{text}</p>
      break;
    case 'image/png': case 'image/jpeg': case 'image/gif':
      tag = <img src={text} alt="이미지"></img>
      break;
    case 'video/mp4':
      tag = <video src={text} width='400' controls></video>
      break;
    default:
      tag = <a href={text} download>{filename}</a>
      break;
  }
  return tag;
}

// joinRoom마지막에 검색창 기능추가 
// <input type="text" id="search-box" placeholder="Search" onchange={handleSearch}/>
//     Array.from(messages).forEach((message) => {
//       // 검색값과 채팅값의 비교 ? 검색값이 채팅내용에 있을 경우 : 없을경우
//       message.textContent.indexOf(event.target.value) === -1
//         ? (message.style.display = "none")
//         : (message.style.display = "block");
//     });
// let {scrollTop, offsetHeight, scrollHeight} = chat_messages.current
// console.log(scrollTop); // 현재 스크롤 위치(위 높이)
// console.log(offsetHeight); // 눈에보이는 스크롤 높이 (고정)
// console.log(scrollTop+offsetHeight); // 아래높이
// console.log(scrollHeight); // 전체높이 (안보이는거 포함) (채팅이 늘어나면 같이늘어남)


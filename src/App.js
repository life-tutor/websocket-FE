import logo from './logo.svg';
import Test from './nggoong/Test';
import './App.css';
import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import * as StompJS from "stompjs";
import styled from 'styled-components';

function App() {
  const roomId = 0;
  const [contents, setContents] = useState(null);
  const [message, setMessage] = useState('');
  const [number, setNumber] = useState(0);
  const [receiv_msg, setReceiv_msg] = useState([]);
  const [send_msg, setSend_msg] = useState([]);

  const sock = new SockJS('http://3.37.89.214/life-tutor') // 바꾸기
  const client = StompJS.over(sock);

  const headers = {"temp":"temp"};

  useEffect(()=> {
    const connect = () => {
    
      client.connect({}, ()=> {
        client.subscribe(`/sub/chat`, (data) => {
          const newMessage = JSON.parse(data.body);
          // setContents(newMessage);
          // 상대방에게서 메세지를 받을 때 마다 실행됨
          console.log(newMessage)
          let new_data = receiv_msg.concat(newMessage.message);
          setReceiv_msg(new_data);
          console.log(newMessage.message);
        })
      })
    }
    connect();
  }, [])

  const disConnect = () => {
    client.disconnect(() => {
        client.unsubscribe()
    });
    // navigate('/home');
  }

  const sendMsg = (message) => {
    client.send(
      `/pub/receive`,
      {},
      // JSON.stringify({nickname, message})
      JSON.stringify({"message":message})
    );
    setMessage("");
    // setNumber(number+1);
  };

  const inputChange = (e) => {
    setMessage(e.target.value);
  }
  const submithandler = (e) => {
    // sendMsg('홍길동', message)
    e.preventDefault();
    sendMsg(message);
    let new_data = [...send_msg, message];
    setSend_msg(new_data);
  }

  
  return (
    <div className="App">
      <input type="text" value={message} onChange={inputChange}></input>
      <button onClick={submithandler}>submit</button>
      <MsgWrapper>
        <ReceivWrapper>
         {receiv_msg.map((item, index) => <div key={index}>{item}</div>)}
        </ReceivWrapper>
        <SendWrapper>
          {send_msg.map((item, index) => <div key={index}>{item}</div>)}
        </SendWrapper>
      </MsgWrapper>
    </div>
  );
}

export default App;


const MsgWrapper = styled.div`
  width:80vw;
  height:80vh;
  background:yellow;
  display:flex;
`


const ReceivWrapper = styled.div`
  width:50%;
  height:100%;
  background:gray;
`

const SendWrapper = styled(ReceivWrapper)`
  background:lightgray;
`




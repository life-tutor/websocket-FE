import React from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

let sockJS = new SockJS("http://localhost:8080/webSocket");
let stompClient = Stomp.over(sockJS);
stompClient.debug= () => {};

const Test = ({ sockstate }) => {
    const inputRef = React.useRef(null);
    const [contents, setContents] = React.useState([]);
    const [username, setUsername] = React.useState('홍길동');
    const [message, setMessage] = React.useState('');

    React.useEffect(()=> {
        stompClient.connect({}, () => {
            stompClient.subscribe('/topic/roomId', (data) => {
                const newMessage = JSON.parse(data.body)
            })
        })
    }, [])

    
    return(
        <div className='container'>
            <input type="text" ref={inputRef}></input>
            <button>send</button>
        </div>
    )
}

export default Test;
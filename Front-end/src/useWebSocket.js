import { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export default function useWebSocket(url) {
  const [data, setData] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    const socket = new SockJS(url);

    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe('/topic/bandwidth', message => {
          setData(JSON.parse(message.body));
        });
      },
      debug: str => {
        console.log(str);
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [url]);

  return data;
}

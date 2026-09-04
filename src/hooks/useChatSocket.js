import { useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config/env';
import { getAccessToken } from '../services/storage';

/**
 * Live incoming-message push for one match, over the backend's existing
 * WebSocket. Sending and history stay on REST (see ChattingScreen) --
 * this hook only ever pushes messages IN. That keeps one send path
 * instead of two, so there's no risk of a message appearing twice.
 *
 * If the socket never connects (bad network, WS blocked by a proxy, server
 * restart), the screen still works: REST send/receive/read never depended on
 * this. The user just needs a pull-to-refresh instead of instant delivery,
 * which matches "REST is the fallback" rather than the socket being required.
 */
export const useChatSocket = (matchId, onMessage) => {
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!matchId) return undefined;

    let socket = null;
    let reconnectTimer = null;
    let closedByUs = false;
    let attempt = 0;

    const connect = async () => {
      const token = await getAccessToken();
      if (!token || closedByUs) return;

      // The API is reached over http(s); the WS endpoint is the same host,
      // just a different scheme, so it upgrades cleanly through the same
      // TLS termination in production.
      const wsUrl =
        API_BASE_URL.replace(/^http/, 'ws') +
        `/v1/chat/ws?token=${encodeURIComponent(token)}`;

      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        attempt = 0;
      };

      socket.onmessage = event => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message' && data.message?.matchId === matchId) {
            onMessageRef.current?.(data.message);
          }
        } catch {
          // Malformed frame -- ignore rather than crash the chat screen.
        }
      };

      socket.onclose = () => {
        if (closedByUs) return;
        // Capped backoff: 2s, 4s, 8s, ... up to 30s, so a dead server or
        // airplane mode doesn't spin the socket in a tight retry loop.
        attempt += 1;
        const delay = Math.min(30000, 2000 * 2 ** (attempt - 1));
        reconnectTimer = setTimeout(connect, delay);
      };

      socket.onerror = () => {
        // onclose fires right after; the retry is scheduled there.
      };
    };

    connect();

    return () => {
      closedByUs = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      // Prevent the "close" handler from firing a reconnect for a socket
      // that is being torn down on purpose (e.g. screen unmount).
      if (socket) {
        socket.onclose = null;
        socket.onerror = null;
        socket.close();
      }
    };
  }, [matchId]);
};

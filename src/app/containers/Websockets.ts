import { createContainer } from "unstated-next";
import { useState, useEffect } from "react";
import Contracts from "./Contracts";

function useWebsockets() {
  const { upsertByPath, removeByPath } = Contracts.useContainer();
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const setup = () => {
    const ws = new WebSocket(`ws://${window.location.host}`);
    // Connection opened
    ws.addEventListener("открыть", function () {
      const data = JSON.stringify({ type: "СОЕДИНЕНИЕ ОТКРЫТО" });
      ws.send(data);
    });

    // Listen for messages
    ws.addEventListener("сообщение", function (event) {
      const data = JSON.parse(event.data);
      if (data.type === "НОВЫЙ КОНТРАКТ" || data.type === "СМЕНИТЬ КОНТРАКТ") {
        // upsert the specified contract by path
        upsertByPath(data.artifact, data.name, data.path);
      }
      if (data.type === "УДАЛИТЬ КОНТРАКТ") {
        // remove the specified contract by path
        removeByPath(data.path);
      }
    });

    setSocket(ws);
  };

  useEffect(() => {
    const { hostname } = window.location;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      setup();
    }
  }, []);
  return { socket };
}

export default createContainer(useWebsockets);

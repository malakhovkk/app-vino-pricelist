import { Routes, Route, Navigate } from "react-router-dom";
import appInfo from "./app-info";
import routes from "./app-routes";
import { SideNavOuterToolbar as SideNavBarLayout } from "./layouts";
import { Footer } from "./components";
import logo from "./chat.png";
import { useState, useEffect, useRef } from "react";
import mqtt from "mqtt";
import axios from "axios";
import Button from "devextreme-react/button";
import { fetchMessagesAPI, poll, sendMessageAPI } from "./restApi";
import { Chat } from "devextreme-react/chat";

function generateUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function Content() {
  const [uid, setUid] = useState(generateUID());
  const uidRef = useRef(uid);
  useEffect(() => {
    uidRef.current = uid;
  }, [uid]);

  const currentUser = {
    id: uid,
    name: localStorage.getItem("login") ?? "Anonymous",
  };

  const [messages, setMessages] = useState([]);
  const [days, setDays] = useState(1);
  const lastMessageIdRef = useRef("");
  const timerRef = useRef(null);
  const mqttClientRef = useRef(null);
  const [showChat, setShowChat] = useState(false);
  const [lastDate, setLastDate] = useState("");
  // Нормализация сообщений
  const normalizeIncomingMessage = (m) => {
    return {
      _id: m._id ?? m.id ?? `${Date.now()}-${Math.random()}`,
      text: m.text ?? m.message ?? "",
      authorId:
        typeof m.author === "string"
          ? m.author
          : m.author?.id ?? m.authorId ?? "unknown",
      authorName: m.authorName ?? m.author?.name ?? m.name ?? "Unknown",
      createdAt: m.createdAt ?? m.timestamp ?? new Date().toISOString(),
      date: m.date.split("T")[0],
    };
  };

  // Fetch сообщений за days дней
  const fetchMessages = async () => {
    try {
      const response = await fetchMessagesAPI(lastDate);
      const arr = (response ?? []).map(normalizeIncomingMessage);
      console.log(arr);
      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m._id));
        const newMessages = arr.filter((m) => !existingIds.has(m._id));
        console.log(newMessages);
        if (newMessages.length > 0)
          setLastDate(newMessages[newMessages.length - 1].date.split("T")[0]);
        if (!lastDate) return [...prev, ...newMessages];
        else {
          return [...newMessages, ...prev];
        }
      });

      if (arr.length > 0 && !lastDate) {
        lastMessageIdRef.current = arr[arr.length - 1]._id;
      }

      return arr;
    } catch (err) {
      console.error("fetchMessages error", err);
      return [];
    }
  };

  // Отправка сообщения
  const sendMessage = async ({ message }) => {
    try {
      if (!message?.text?.trim()) return;
      await sendMessageAPI(message.text, message.author.id);
    } catch (err) {
      console.error("sendMessage error", err);
    }
  };

  // Поллинг новых сообщений
  const pollForNewMessagesOnce = async () => {
    try {
      const lastId = lastMessageIdRef.current;
      if (!lastId) {
        const initial = await fetchMessages();
        if (initial.length > 0) {
          lastMessageIdRef.current = initial[initial.length - 1]._id;
        }
        scheduleNextPoll();
        return;
      }

      const response = await poll(lastId);
      const arr = (response ?? []).map(normalizeIncomingMessage);

      if (arr.length > 0) {
        setMessages((prev) => [
          ...prev,
          ...arr.filter((m) => !prev.some((pm) => pm._id === m._id)),
        ]);
        console.log(arr);
        lastMessageIdRef.current = arr[arr.length - 1]._id;
      }
    } catch (err) {
      console.error("poll error", err);
    } finally {
      scheduleNextPoll();
    }
  };

  const scheduleNextPoll = (ms = 2000) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(pollForNewMessagesOnce, ms);
  };

  const startPolling = () => {
    if (!timerRef.current) scheduleNextPoll(1000);
  };

  const stopPolling = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Инициализация пользователя и MQTT
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const r = await axios.get(
          `http://localhost:8000/getIdByName?name=${encodeURIComponent(
            localStorage.getItem("login")
          )}`
        );
        if (!mounted) return;
        if (r?.data?.[0]?.author) {
          setUid(r.data[0].author);
        } else {
          await axios.post(`http://localhost:8000/author`, {
            name: localStorage.getItem("login"),
            author: uidRef.current,
          });
        }
      } catch (err) {
        console.warn("author init error", err);
      }

      await fetchMessages();
      startPolling();
    })();

    // MQTT
    // const options = {
    //   keepalive: 60,
    //   username: "vinopark",
    //   password: "vinopark",
    //   port: 9001,
    //   reconnectPeriod: 5000,
    //   connectTimeout: 30000,
    // };
    // const mqttClient = mqtt.connect("ws://194.87.92.32:9001", options);
    // mqttClientRef.current = mqttClient;

    // mqttClient.on("connect", () => {
    //   console.log("Connected to MQTT broker");
    //   mqttClient.subscribe("deal/status");
    //   mqttClient.subscribe("messages/send");
    // });

    // mqttClient.on("message", (topic, buffer) => {
    //   try {
    //     const raw = JSON.parse(buffer.toString());
    //     const normalized = normalizeIncomingMessage(raw);

    //     if (normalized.authorId !== uidRef.current) {
    //       setMessages((prev) => [...prev, normalized]);
    //       lastMessageIdRef.current = normalized._id;
    //     }
    //   } catch (err) {
    //     console.error("MQTT parse error", err);
    //   }
    // });

    return () => {
      mounted = false;
      stopPolling();
      // if (mqttClientRef.current) {
      //   mqttClientRef.current.end(true);
      //   mqttClientRef.current = null;
      // }
    };
  }, []);
  // useEffect(() => {
  //   if (!messages.length) return;
  //   console.log(messages);
  //   alert(messages[messages.length - 1].date.split("T")[0]);
  //   setLastDate(messages[messages.length - 1].date.split("T")[0]);
  // }, [messages]);
  // chatItems для Chat
  const chatItems = messages.map((m) => ({
    id: m._id,
    author: { id: m.authorId, name: m.authorName },
    text: m.text,
    createdAt: m.createdAt,
  }));
  console.log(chatItems);

  return (
    <SideNavBarLayout title={appInfo.title}>
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>

      <img
        src={logo}
        style={{
          width: "100px",
          position: "fixed",
          right: "20px",
          bottom: "20px",
        }}
        onClick={() => setShowChat((prev) => !prev)}
      />

      <Footer>
        Copyright © 2011-{new Date().getFullYear()} {appInfo.title} Inc.
        <br />
        All trademarks or registered trademarks are property of their respective
        owners.
      </Footer>

      {showChat && (
        <>
          <div
            style={{
              position: "fixed",
              top: 100,
              right: 50,
              width: 300,
              height: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
            }}
          >
            <Button text="History" onClick={() => fetchMessages()} />
          </div>

          <Chat
            style={{
              position: "fixed",
              bottom: 200,
              right: 50,
              height: "50%",
              width: 1000,
              backgroundColor: "white",
            }}
            keyExpr="_id"
            user={currentUser}
            items={chatItems}
            onMessageEntered={sendMessage}
          />
        </>
      )}
    </SideNavBarLayout>
  );
}

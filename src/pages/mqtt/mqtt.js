// import React, { useEffect, useState } from "react";
// import mqtt from "mqtt";

// export default function Mqtt() {
//   const [client, setClient] = useState(null);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     // Подключение к брокеру
//     const mqttClient = mqtt.connect("ws://localhost:9001"); // Убедитесь, что используете правильный адрес и порт
//     // console.log(2);
//     mqttClient.on("connect", () => {
//       console.log("Подключено к брокеру");
//       //   alert(1);
//       mqttClient.subscribe("test/topic", (err) => {
//         if (!err) {
//           console.log("Подписались на тему: test/topic");
//         }
//       });
//     });

//     mqttClient.on("message", (topic, message) => {
//       console.log(message, topic);
//       setMessages((prevMessages) => [...prevMessages, message.toString()]);
//     });

//     setClient(mqttClient);

//     return () => {
//       mqttClient.end(); // Закрываем соединение при размонтировании компонента
//     };
//   }, []);

//   const handlePublish = () => {
//     if (client && message) {
//       client.publish("test/topic", message);
//       setMessage(""); // Очищаем поле ввода после отправки
//     }
//   };

//   return (
//     <div>
//       <h1>MQTT Клиент</h1>
//       <div>
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Введите сообщение"
//         />
//         <button onClick={handlePublish}>Отправить</button>
//       </div>
//       <h2>Полученные сообщения:</h2>
//       <div>
//         {messages.map((msg, index) => (
//           <div key={index}>{msg}</div>
//         ))}
//       </div>
//     </div>
//   );
// }
// src / MqttComponent.js;
import React, { useEffect, useState } from "react";
import mqtt from "mqtt";
import axios from "axios";
const Mqtt = () => {
  const [client, setClient] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Connect to the MQTT broker

    var options = {
      keepalive: 60,
      username: "u_CDJB7G",
      password: "7lPcnMU7",
      port: 19823,
    };

    const mqttClient = mqtt.connect("wss://m6.wqtt.ru:19823", options); // Use a WebSocket connection

    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
      mqttClient.subscribe("test/topic", (err) => {
        if (!err) {
          mqttClient.publish("test/topic", "hello123");
          console.log("Subscribed to topic: test/topic");
        }
      });
    });

    mqttClient.on("message", (topic, message) => {
      // Message is a Buffer
      setMessages((prevMessages) => [...prevMessages, message.toString()]);
    });

    setClient(mqttClient);

    // Cleanup on unmount
    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, []);

  const handlePublish = async () => {
    if (client) {
      client.publish("test/topic", message);
      // try {
      //   const token = "slwBo9yDT8ze3daAnkjgv6n8h383dUx7fzlVVWNrUCFlDtzDl5FD2n02";
      //   console.log(token);
      //   const response = await axios.get(
      //     `https://dash.wqtt.ru/api/broker/messages/pub`,
      //     {
      //       headers: {
      //         "Content-Type": "application/json",
      //         Authorization: `Token ${token}`,
      //       },
      //     },
      //     [{ topic: "test/topic1", payload: message }]
      //   );
      //   return response.data;
      // } catch (e) {}
      setMessage("");
    }
    // }
  };

  return (
    <div>
      <h1>MQTT Example</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handlePublish}>Publish</button>
      <h2>Полученные сообщения:</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
    </div>
  );
};

export default Mqtt;

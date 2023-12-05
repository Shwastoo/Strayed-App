import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function ChatList({ username }) {
  const [user, setUser] = useState(username);
  const [chats, setChats] = useState(null);
  const [chatmates, setChatmates] = useState([]);
  const [lastMessages, setLastMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChatsData();
  }, []);

  const getChatsData = async () => {
    console.log(user);
    await axios
      .get(`/api/chats/${user}`)
      .then((response) => {
        console.log(response.data);
        setChats(response.data);
        var chatmateList = [];
        var lastMSGs = [];
        for (var i = 0; i < response.data.length; i++) {
          var users = response.data[i].chatID.split("~");
          if (users[0] == user) chatmateList.push(users[1]);
          else chatmateList.push(users[0]);
          lastMSGs.push(
            response.data[i].messages[response.data[i].messages.length - 1]
          );
        }
        console.log(chatmateList);
        console.log(lastMSGs);
        setChatmates(chatmateList);
        setLastMessages(lastMSGs);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Błąd pobierania danych:", error);
      });
  };

  return (
    <div>
      {!loading ? (
        <div>
          <ul className="chat-list">
            {chats.map((chat, i) => (
              <li key={i} className="chat-item">
                <Link to={`/chat/${chatmates[i]}`}>
                  <b>{chatmates[i]}</b>
                  <br />
                  {lastMessages[i]["sender"] == user ? <span>Ty: </span> : ""}
                  {lastMessages[i]["msgtype"] == "text" ? (
                    <span>{lastMessages[i]["msg"]}</span>
                  ) : (
                    <span>
                      <i>Przesłano zdjęcie</i>
                    </span>
                  )}
                  <br />
                  <span>
                    {new Intl.DateTimeFormat("pl-PL", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    }).format(lastMessages[i]["timestamp"])}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Ładowanie danych...</p>
      )}
    </div>
  );
}

export default ChatList;

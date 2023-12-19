//import React, { Component } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function Chat({ username, sendChatImage }) {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [name, setName] = useState(username); // logged user
  const [room, setRoom] = useState(null);
  const [connecting, setConnecting] = useState(true);
  const [haveRun, setHaveRun] = useState(false);
  const { user } = useParams(); // user we want to chat with
  const [client, setClient] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const chatEnd = useRef(null);

  useEffect(() => {
    if (!haveRun && name) {
      getUsers();
    }
    if (client != null) initChatRoom();
  }, [client, messages]);

  useEffect(() => {
    if (chatEnd.current != null) {
      chatEnd.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  const getUsers = async () => {
    setHaveRun(true);
    var idA = null;
    var idB = null;
    await axios
      .get(`/api/users/${name}`) // logged user
      .then((response) => {
        console.log(response);
        idA = response.data.pk;
        axios
          .get(`/api/users/${user}`) // user we want to chat with
          .then((response) => {
            idB = response.data.pk;
            console.log(idA, idB);
            var chatRoom;
            if (idA < idB) chatRoom = name + "~" + user;
            else chatRoom = user + "~" + name;
            setRoom(chatRoom);
            axios
              .get(`/api/chats/${chatRoom}`)
              .then((response) => {
                console.log(response);
                setMessages(response.data.messages);
                setConnecting(false);
              })
              .catch((error) => {
                console.error("Błąd pobierania usera:", error);
                setNotFound(true);
              });
            setClient(
              new W3CWebSocket("ws://127.0.0.1:8000/ws/" + chatRoom + "/")
            );
          })
          .catch((error) => {
            console.error("Błąd pobierania usera:", error);
            setNotFound(true);
          });
      })
      .catch((error) => {
        console.error("Błąd pobierania usera:", error);
        setNotFound(true);
      });
  };

  const initChatRoom = async () => {
    //console.log(client);
    client.onopen = () => {
      //console.log("WebSocket Client Connected");
    };
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      if (dataFromServer) {
        //console.log(dataFromServer);
        setMessages([
          ...messages,
          {
            msg: dataFromServer.msg,
            sender: dataFromServer.sender,
            msgtype: dataFromServer.msgtype,
            timestamp: dataFromServer.timestamp,
          },
        ]);
        //console.log(messages);
      }
    };
  };

  const handleInputChange = (event) => {
    setValue(event.target.value);
  };
  const handlePhotoChange = (event) => {
    setPhoto(event.target.files[0]);
    setPhotoName(event.target.files[0].name);
    //console.log(event.target.files[0]);
  };
  const clearPhoto = (event) => {
    setPhoto("");
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (photo == "") {
      client.send(
        JSON.stringify({
          msgtype: "text",
          msg: value,
          sender: name,
          timestamp: Date.now(),
          //chatroom: room,
        })
      );
    } else {
      var formData = new FormData();
      formData.append("photo", photo);
      //console.log(sendChatImage);
      sendChatImage(formData);
      //console.log("ZDJ WRZUCONE");

      client.send(
        JSON.stringify({
          msgtype: "image",
          msg: photoName.replace(" ", "_"),
          sender: name,
          timestamp: Date.now(),
          //chatroom: room,
        })
      );
    }
    setValue("");
    setPhoto("");
    setPhotoName("");
  };

  return (
    <div>
      {!notFound ? (
        <div>
          {name ? (
            <div>
              {connecting ? (
                <p>Wczytywanie...</p>
              ) : (
                <div>
                  <h2>Czat z użytkownikiem {user}</h2>
                  <div className="chat-container">
                    {messages.map((message, i) => (
                      <div
                        className={
                          message.sender == name
                            ? "logged-user-row"
                            : "other-user-row"
                        }
                        key={i}
                      >
                        <div
                          className={
                            message.sender == name
                              ? "logged-user-msg"
                              : "other-user-msg"
                          }
                        >
                          <p className="sender-name">{message.sender}</p>
                          {message.msgtype == "text" ? (
                            <p className="user-message">{message.msg}</p>
                          ) : (
                            <p className="user-message">
                              <img
                                src={"/media/images/chat/" + message.msg}
                                alt={"Zdjęcie"}
                                className="animal-image"
                              />
                            </p>
                          )}
                          <p className="msg-timestamp">
                            {new Intl.DateTimeFormat("pl-PL", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            }).format(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEnd}></div>
                  </div>
                  <form onSubmit={handleFormSubmit}>
                    <div className="form-group msg-inputs">
                      <button
                        className={
                          photo == "" ? "btn-photo no-photo" : "btn-photo"
                        }
                        type="button"
                      >
                        {photo == ""
                          ? "Prześlij zdjęcie"
                          : "Przesłano plik: " + photoName}
                        <label htmlFor="btn-photo-label">
                          <input
                            id="btn-photo-label"
                            type="file"
                            name="photo"
                            accept="image/*"
                            onChange={handlePhotoChange}
                          />
                        </label>
                      </button>

                      <button
                        type="reset"
                        onClick={clearPhoto}
                        className={
                          photo == "" ? "btn-reset hide-input" : "btn-reset"
                        }
                      >
                        Wyczyść
                      </button>

                      <input
                        className={
                          photo == "" ? "btn-msg" : "btn-msg hide-input"
                        }
                        type="text"
                        name="message"
                        value={value}
                        onChange={handleInputChange}
                        placeholder="Wiadomość"
                        disabled={photo == "" ? false : true}
                      />
                    </div>
                    <div className="form-group">
                      <button
                        type="submit"
                        className="send-button"
                        disabled={value == "" && photo == "" ? true : false}
                      >
                        Wyślij
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p>Aby skontaktować się z użytkownikiem musisz się zalogować.</p>
              <Link to="/login" className="submit-button1">
                Zaloguj się
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>Nie znaleziono czatu.</p>
          <Link to="/" className="submit-button1">
            Przejdź do strony głównej
          </Link>
        </div>
      )}
    </div>
  );
}

export default Chat;

/*
class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      value: "",
      name: this.props.username,
      room: "test",
    };
  }

  client = new W3CWebSocket("ws://127.0.0.1:8000/ws/" + "test" + "/");

  componentDidMount() {
    this.client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    this.client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      if (dataFromServer) {
        this.setState((state) => ({
          messages: [
            ...state.messages,
            {
              msg: dataFromServer.text,
              username: dataFromServer.sender,
            },
          ],
        }));
      }
    };
  }

  handleInputChange = (event) => {
    this.setState({ value: event.target.value });
  };

  handleFormSubmit = async (event) => {
    this.client.send(
      JSON.stringify({
        type: "message",
        text: this.state.value,
        sender: this.state.name,
      })
    );
    this.state.value = "";
    event.preventDefault();
  };

  render() {
    return (
      <div>
        <h2>Czat "{this.state.room}"</h2>
        <div>
          {this.state.messages.map((message, i) => (
            <p key={i}>
              {message.username}: {message.msg}
            </p>
          ))}
        </div>
        <form onSubmit={this.handleFormSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="message"
              value={this.state.value}
              onChange={this.handleInputChange}
              placeholder="Wiadomość"
              required
            />
          </div>
          <div className="form-group">
            <button type="submit" className="send-button">
              Wyślij
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Chat;
*/

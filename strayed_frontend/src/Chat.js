//import React, { Component } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Chat({ username }) {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");
  const [name, setName] = useState(username); // logged user
  const [room, setRoom] = useState(null);
  const [connecting, setConnecting] = useState(true);
  const [haveRun, setHaveRun] = useState(false);
  const { user } = useParams(); // user we want to chat with
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (!haveRun) {
      getUsers();
    }
    if (client != null) initChatRoom();
  }, [client, messages]);

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
            if (idA < idB) chatRoom = "A_" + idA + "-B_" + idB;
            else chatRoom = "A_" + idB + "-B_" + idA;
            setRoom(chatRoom);
            setClient(
              new W3CWebSocket("ws://127.0.0.1:8000/ws/" + chatRoom + "/")
            );
          })
          .catch((error) => {
            console.error("Błąd pobierania usera:", error);
          });
      })
      .catch((error) => {
        console.error("Błąd pobierania usera:", error);
      });
  };

  const initChatRoom = async () => {
    console.log(client);
    setConnecting(false);
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      if (dataFromServer) {
        console.log(dataFromServer);
        var newmessages = {
          messages: [
            ...messages,
            {
              msg: dataFromServer.text,
              username: dataFromServer.sender,
            },
          ],
        };
        console.log(newmessages);
        setMessages([
          ...messages,
          {
            msg: dataFromServer.text,
            username: dataFromServer.sender,
          },
        ]);
        console.log(messages);
      }
    };
  };

  const handleInputChange = (event) => {
    setValue(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    client.send(
      JSON.stringify({
        type: "message",
        text: value,
        sender: name,
      })
    );
    setValue("");
  };

  return (
    <div>
      {connecting ? (
        <p>Wczytywanie...</p>
      ) : (
        <div>
          <h2>Czat "{room}"</h2>
          <div>
            {messages.map((message, i) => (
              <p key={i}>
                {message.username}: {message.msg}
              </p>
            ))}
          </div>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="message"
                value={value}
                onChange={handleInputChange}
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

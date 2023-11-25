import React, { Component } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filledForm: false,
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

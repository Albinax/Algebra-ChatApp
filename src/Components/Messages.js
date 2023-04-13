import { Component } from "react";
import React from "react";

class Messages extends Component {
    renderMessage(message, index) {
        const { member, text } = message;
        const { currentMember } = this.props;
        const messageFromMe = member.id === currentMember.id;
        const className = messageFromMe
            ? "messages-message currentMember"
            : "messages-message";

        let time = new Date(Date.now());
        //console.log(time.getHours(), time.getMinutes(), time.getSeconds());
        return (
            <li className={className} key={index}>
                <span
                    className="avatar"
                    style={{ backgroundColor: member.clientData.color }}
                />
                <div className="message-content">
                    <div className="username">{member.clientData.username}</div>
                    <div className="text">{text}</div>
                    <div className="timestamp" style={{ fontSize: 11 }}>
                        {time.getHours() + ":" + time.getMinutes()}
                    </div>
                </div>
            </li>
        );
    }

    render() {
        const { messages } = this.props;
        return (
            <ul className="messages-list">
                {messages.map((m, i) => this.renderMessage(m, i))}
            </ul>
        );
    }
}

export default Messages;

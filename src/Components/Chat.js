import { Component } from "react";
import React from "react";
import "../Chat.css";
import Messages from "./Messages";
import Input from "./Input";
import { adjectives, nouns } from "./RandomWords";
import swal from "sweetalert";
import RoomMembers from "./RoomMembers";

function randomName() {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return adjective + noun;
}

function randomColor() {
    return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}

class Chat extends Component {
    state = {
        member: {
            username: randomName(),
            color: randomColor(),
        },
        messages: [],
        onlineMembers: [],
        roomMembers: [],
    };

    constructor(props) {
        super(props);
        this.drone = new window.Scaledrone("veZFVe007cWlhUL4", {
            data: this.state.member,
        });

        this.drone.on("open", (error) => {
            if (error) {
                return console.error(error);
            }
            console.log("Successfully connected to Scaledrone");
            const member = this.state.member;
            member.id = this.drone.clientId;
            this.setState({ member });
        });

        const room = this.drone.subscribe("observable-test-room");

        room.on("data", (data, member) => {
            const messages = this.state.messages;
            messages.push({ member, text: data });
            this.setState({ messages });
        });

        room.on("members", (current) => {
            this.setState({ roomMembers: current });
            //console.log(current);
        });

        room.on("member_join", (memberOn) => {
            this.setState((prevState) => {
                return {
                    roomMembers: [...prevState.roomMembers, memberOn],
                };
            });
            //console.log("Joined: ", memberOn);
        });

        room.on("member_leave", (memberOff) => {
            this.setState((prevState) => {
                return {
                    roomMembers: prevState.roomMembers.filter(
                        (member) => member.id !== memberOff.id
                    ),
                };
            });
        });
    }

    onSendMessage = (message) => {
        if (message.trim() === "") {
            swal("Oops..", "You forgot to enter a message!", {
                buttons: false,
            });
        } else {
            this.drone.publish({
                room: "observable-test-room",
                message,
            });
        }
    };

    renderMembersList() {
        const { roomMembers } = this.state;
        //console.log(roomMembers);
        return <RoomMembers roomMembers={roomMembers} />;
    }

    render() {
        return (
            <div className="Chat">
                <h1 className="Chat-header">My Chat App</h1>
                <h3 className="Chat-header">observable-test-room</h3>
                <div className="col-sm-8">
                    <Messages
                        messages={this.state.messages}
                        currentMember={this.state.member}
                    />
                    <Input onSendMessage={this.onSendMessage} />
                </div>
                <div class="col-sm-4">
                    <div className="Member-list">
                        {this.renderMembersList()}
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;

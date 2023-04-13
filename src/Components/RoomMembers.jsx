import React from "react";

const RoomMembers = ({ roomMembers }) => {
    return (
        <div className="member-list">
            <h3>Current members in the room:</h3>
            <ul>
                {roomMembers.map((member, index) => (
                    <li key={index}>{member.clientData.username}</li>
                ))}
            </ul>
        </div>
    );
};

export default RoomMembers;

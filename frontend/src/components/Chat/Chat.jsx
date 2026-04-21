import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { useSocket } from "../../context/SocketContext";
import { Navigate } from "react-router-dom";
import { FaPaperPlane, FaSearch, FaUser, FaUsers } from "react-icons/fa";

const Chat = () => {
  const { isAuthorized, user } = useContext(Context);
  const { socket, joinGroup, leaveGroup, isConnected } = useSocket();
  const [activeChats, setActiveChats] = useState([]);
  const [activeGroups, setActiveGroups] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch user's chats and groups
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/message/chats`,
          { withCredentials: true }
        );
        setActiveChats(data.directChats || []);
        setActiveGroups(data.chatGroups || []);
      } catch (error) {
        toast.error("Failed to load chats");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized) {
      fetchChats();
    }
  }, [isAuthorized]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (data) => {
      const { type, message, groupId } = data;
      
      if (type === "direct" && selectedChat && selectedChat._id === message.sender._id) {
        setMessages((prev) => [...prev, message]);
      } else if (type === "group" && selectedChat && selectedChat._id === groupId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("typing", (data) => {
      const { userId, userName, type } = data;
      setTypingUsers((prev) => {
        if (!prev.find((u) => u.userId === userId)) {
          return [...prev, { userId, userName, type }];
        }
        return prev;
      });

      // Clear typing after 3 seconds
      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
      }, 3000);
    });

    socket.on("stop_typing", (data) => {
      const { userId } = data;
      setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
    });

    return () => {
      socket.off("receive_message");
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [socket, selectedChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages when selecting a chat
  const handleSelectChat = async (chat, type) => {
    setSelectedChat({ ...chat, type });
    setMessages([]);
    setTypingUsers([]);

    try {
      let url;
      if (type === "direct") {
        url = `${import.meta.env.VITE_API_URL}/message/history/direct/${chat._id || chat.user?._id}`;
      } else {
        url = `${import.meta.env.VITE_API_URL}/message/history/group/${chat._id}`;
        joinGroup(chat._id);
      }

      const { data } = await axios.get(url, { withCredentials: true });
      setMessages(data.messages || []);

      // Mark as read
      await axios.put(
        `${import.meta.env.VITE_API_URL}/message/read`,
        { chatType: type, chatId: chat._id || chat.user?._id },
        { withCredentials: true }
      );
    } catch (error) {
      toast.error("Failed to load messages");
    }
  };

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const content = newMessage.trim();
    setNewMessage("");

    try {
      let url;
      let payload;

      if (selectedChat.type === "direct") {
        url = `${import.meta.env.VITE_API_URL}/message/send/direct`;
        payload = { recipientId: selectedChat._id || selectedChat.user?._id, content };
      } else {
        url = `${import.meta.env.VITE_API_URL}/message/send/group`;
        payload = { chatGroupId: selectedChat._id, content };
      }

      const { data } = await axios.post(url, payload, { withCredentials: true });
      setMessages((prev) => [...prev, data.message]);
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim() || searchQuery.length < 2) return;

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/message/search?query=${searchQuery}`,
        { withCredentials: true }
      );
      setSearchResults(data.users || []);
    } catch (error) {
      toast.error("Search failed");
    }
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (!socket || !isConnected || !selectedChat) return;

    if (selectedChat.type === "direct") {
      socket.emit("typing_direct", { recipientId: selectedChat._id || selectedChat.user?._id });
    } else {
      socket.emit("typing_group", { groupId: selectedChat._id });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", {
        recipientId: selectedChat.type === "direct" ? selectedChat._id || selectedChat.user?._id : null,
        groupId: selectedChat.type === "group" ? selectedChat._id : null,
      });
    }, 2000);
  };

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="chat page">
      <div className="chat-container">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="chat-header">
            <h3>Messages</h3>
            <div className={`connection-status ${isConnected ? "connected" : "disconnected"}`}>
              {isConnected ? "Connected" : "Disconnected"}
            </div>
          </div>

          {/* Search */}
          <div className="search-box">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch}>
              <FaSearch />
            </button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="search-results">
              <h4>Search Results</h4>
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="chat-item"
                  onClick={() => {
                    handleSelectChat(user, "direct");
                    setSearchResults([]);
                    setSearchQuery("");
                  }}
                >
                  <div className="chat-avatar">
                    <FaUser />
                  </div>
                  <div className="chat-info">
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Groups */}
          {activeGroups.length > 0 && (
            <div className="chat-section">
              <h4>
                <FaUsers /> Groups
              </h4>
              {activeGroups.map((group) => (
                <div
                  key={group._id}
                  className={`chat-item ${selectedChat?._id === group._id ? "active" : ""}`}
                  onClick={() => handleSelectChat(group, "group")}
                >
                  <div className="chat-avatar">
                    <FaUsers />
                  </div>
                  <div className="chat-info">
                    <h4>{group.name}</h4>
                    <p>{group.lastMessage?.content || "No messages yet"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Direct Messages */}
          {activeChats.length > 0 && (
            <div className="chat-section">
              <h4>
                <FaUser /> Direct Messages
              </h4>
              {activeChats.map((chat) => (
                <div
                  key={chat._id}
                  className={`chat-item ${selectedChat?._id === chat._id ? "active" : ""}`}
                  onClick={() => handleSelectChat(chat, "direct")}
                >
                  <div className="chat-avatar">
                    <FaUser />
                  </div>
                  <div className="chat-info">
                    <h4>{chat.user?.name}</h4>
                    <p>{chat.lastMessage?.content || "No messages yet"}</p>
                    {chat.unreadCount > 0 && (
                      <span className="unread-badge">{chat.unreadCount}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {loading && <div className="loading">Loading chats...</div>}
          {!loading && activeChats.length === 0 && activeGroups.length === 0 && (
            <div className="no-chats">No conversations yet</div>
          )}
        </div>

        {/* Chat Window */}
        <div className="chat-window">
          {selectedChat ? (
            <>
              <div className="chat-window-header">
                <div className="chat-user-info">
                  <div className="chat-avatar">
                    {selectedChat.type === "group" ? <FaUsers /> : <FaUser />}
                  </div>
                  <div>
                    <h4>{selectedChat.name || selectedChat.user?.name}</h4>
                    {selectedChat.type === "group" && (
                      <p>{selectedChat.members?.length || 0} members</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="messages-container">
                {messages.map((msg, index) => (
                  <div
                    key={msg._id || index}
                    className={`message ${msg.sender._id === user?._id ? "sent" : "received"}`}
                  >
                    <div className="message-content">
                      {selectedChat.type === "group" && msg.sender._id !== user?._id && (
                        <span className="sender-name">{msg.sender.name}</span>
                      )}
                      <p>{msg.content}</p>
                      <span className="message-time">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
                {typingUsers.length > 0 && (
                  <div className="typing-indicator">
                    {typingUsers.map((u) => u.userName).join(", ")} typing...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className="message-input" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                />
                <button type="submit" disabled={!newMessage.trim()}>
                  <FaPaperPlane />
                </button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <h3>Select a chat to start messaging</h3>
              <p>Search for users or select from your existing conversations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;

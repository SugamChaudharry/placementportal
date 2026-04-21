import React, { useContext, useEffect, useState, useRef } from "react";
import { Context } from "../../main";
import { Navigate, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { FaPaperPlane, FaPhone, FaVideo, FaInfoCircle, FaSearch, FaUser, FaUsers, FaCheck, FaCheckDouble } from "react-icons/fa";
import { Card, Container } from "../UI";
import { useSocket } from "../../context/SocketContext";
import axios from "axios";
import toast from "react-hot-toast";

const Chat = () => {
  const { isAuthorized, user } = useContext(Context);
  const { socket, isConnected, emitTyping, emitStopTyping, joinGroup, leaveGroup } = useSocket();
  const [directChats, setDirectChats] = useState([]);
  const [chatGroups, setChatGroups] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedType, setSelectedType] = useState(null); // 'direct' or 'group'
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [typingUsers, setTypingUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const messagesEndRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      if (!isAuthorized) return;
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/message/chats`,
          { withCredentials: true }
        );
        
        // Store direct chats and groups separately
        setDirectChats(data.directChats || []);
        setChatGroups(data.chatGroups || []);
        
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
        toast.error("Failed to load chats");
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [isAuthorized]);

  // Select chat and load messages
  const handleSelectChat = async (chat, type) => {
    // Leave previous group if any
    if (selectedType === 'group' && selectedChat?._id) {
      leaveGroup(selectedChat._id);
    }
    
    setSelectedChat(chat);
    setSelectedType(type);
    setMessages([]);
    setTypingUsers({});
    
    try {
      let url;
      if (type === 'direct') {
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

  // Handle search users
  const handleSearch = async () => {
    if (!searchQuery.trim() || searchQuery.length < 2) return;
    
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/message/search?query=${searchQuery}`,
        { withCredentials: true }
      );
      setSearchResults(data.users || []);
      setShowSearchResults(true);
    } catch (error) {
      toast.error("Search failed");
    }
  };

  // Listen for socket events
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data) => {
      const { type, message, groupId } = data;
      
      // Add message to current chat if relevant
      if (selectedType === 'direct' && type === 'direct' && selectedChat && 
          (message.sender._id === selectedChat._id || message.sender._id === selectedChat.user?._id)) {
        setMessages((prev) => [...prev, message]);
      } else if (selectedType === 'group' && type === 'group' && selectedChat && groupId === selectedChat._id) {
        setMessages((prev) => [...prev, message]);
      }
      
      // Update conversation list
      if (type === 'direct') {
        const otherUserId = message.sender._id === user._id ? message.recipient : message.sender._id;
        setDirectChats((prev) => {
          const updated = prev.map((chat) => {
            if (chat._id === otherUserId || chat.user?._id === otherUserId) {
              return { ...chat, lastMessage: message, unreadCount: chat.unreadCount + (message.sender._id !== user._id ? 1 : 0) };
            }
            return chat;
          });
          return updated.sort((a, b) => new Date(b.lastMessage?.createdAt || 0) - new Date(a.lastMessage?.createdAt || 0));
        });
      } else if (type === 'group') {
        setChatGroups((prev) => {
          const updated = prev.map((group) => {
            if (group._id === groupId) {
              return { ...group, lastMessage: { content: message.content, sentAt: message.createdAt } };
            }
            return group;
          });
          return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        });
      }
    };

    const handleTyping = (data) => {
      const { userId } = data;
      setTypingUsers((prev) => ({ ...prev, [userId]: true }));
      setTimeout(() => {
        setTypingUsers((prev) => ({ ...prev, [userId]: false }));
      }, 3000);
    };

    const handleStopTyping = (data) => {
      setTypingUsers((prev) => ({ ...prev, [data.userId]: false }));
    };

    socket.on("receive_message", handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      socket.off("receive_message", handleNewMessage);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, [socket, selectedChat, selectedType, user]);

  // Handle URL params and navigation state after data is loaded
  useEffect(() => {
    // Check for navigation state from PublicProfile first
    const navStateUser = location.state?.startChatWith;
    // Then check URL params from ProfileModal
    const targetUserId = searchParams.get("userId");
    
    if ((!targetUserId && !navStateUser) || loading) return;

    const handleNavigation = async () => {
      let userId, userData;
      
      if (navStateUser) {
        // From PublicProfile navigation state
        userId = navStateUser._id;
        userData = navStateUser;
        // Clear state so it doesn't re-trigger
        navigate(location.pathname, { replace: true, state: {} });
      } else {
        // From URL params (ProfileModal)
        userId = targetUserId;
        // Clear URL params
        setSearchParams({});
      }
      
      // Check if chat already exists
      const existingChat = directChats.find(c => c._id === userId || c.user?._id === userId);
      
      if (existingChat) {
        handleSelectChat(existingChat, 'direct');
      } else {
        // Create temporary chat with user data (or fetch if needed)
        const tempChat = {
          _id: userId,
          user: userData || await fetchUserData(userId),
          lastMessage: null,
          unreadCount: 0,
        };
        setDirectChats(prev => [tempChat, ...prev]);
        handleSelectChat(tempChat, 'direct');
      }
    };
    
    const fetchUserData = async (id) => {
      try {
        const userRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/profile/${id}`,
          { withCredentials: true }
        );
        return userRes.data.user;
      } catch (err) {
        console.error("Failed to fetch user:", err);
        toast.error("Failed to load user for chat");
        return { _id: id, name: "Unknown", email: "" };
      }
    };

    handleNavigation();
  }, [searchParams, loading, directChats, handleSelectChat, setSearchParams, location.state, navigate, location.pathname]);

  // Handle typing indicator
  useEffect(() => {
    if (!selectedChat || !messageInput.trim()) return;
    
    const timeout = setTimeout(() => {
      if (selectedType === 'direct') {
        emitTyping(selectedChat._id || selectedChat.user?._id);
      } else {
        socket?.emit('typing_group', { groupId: selectedChat._id });
      }
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [messageInput, selectedChat, selectedType, emitTyping, socket]);

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat) return;

    const content = messageInput.trim();
    setMessageInput("");

    try {
      let url;
      let payload;

      if (selectedType === 'direct') {
        url = `${import.meta.env.VITE_API_URL}/message/send/direct`;
        payload = { recipientId: selectedChat._id || selectedChat.user?._id, content };
      } else {
        url = `${import.meta.env.VITE_API_URL}/message/send/group`;
        payload = { chatGroupId: selectedChat._id, content };
      }

      const { data } = await axios.post(url, payload, { withCredentials: true });
      setMessages((prev) => [...prev, data.message]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Messages</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Connect with employers and candidates
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <Container className="flex-1 py-6 flex gap-6">
        {/* Conversations List */}
        <div className="w-full md:w-80 lg:w-96">
          <Card className="h-full">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full px-3 py-2 pr-10 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-neutral-400 hover:text-primary-500"
                >
                  <FaSearch />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-96">
              {loading ? (
                <div className="p-4 text-center">
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">Loading...</p>
                </div>
              ) : (
                <>
                  {/* Search Results */}
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="border-b border-neutral-200 dark:border-neutral-700">
                      <div className="p-2 bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-500">
                        Search Results
                      </div>
                      {searchResults.map((user) => (
                        <div
                          key={user._id}
                          onClick={() => {
                            handleSelectChat(user, 'direct');
                            setShowSearchResults(false);
                            setSearchQuery('');
                          }}
                          className="p-3 border-b border-neutral-200 dark:border-neutral-700 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                        >
                          <div className="flex items-center gap-3">
                            <FaUser className="text-primary-500" />
                            <div>
                              <p className="font-medium text-sm">{user.name}</p>
                              <p className="text-xs text-neutral-500">{user.email}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Groups */}
                  {chatGroups.length > 0 && (
                    <div className="border-b border-neutral-200 dark:border-neutral-700">
                      <div className="p-2 bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-500 flex items-center gap-2">
                        <FaUsers /> Job Groups
                      </div>
                      {chatGroups.map((group) => (
                        <div
                          key={group._id}
                          onClick={() => handleSelectChat(group, 'group')}
                          className={`p-4 border-b border-neutral-200 dark:border-neutral-700 cursor-pointer transition-colors ${
                            selectedChat?._id === group._id && selectedType === 'group'
                              ? "bg-primary-50 dark:bg-primary-900/20"
                              : "hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white">
                              <FaUsers />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">{group.name}</p>
                              <p className="text-xs text-neutral-500 truncate">
                                {group.lastMessage?.content || `${group.members?.length || 0} members`}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Direct Messages */}
                  {directChats.length > 0 && (
                    <div>
                      <div className="p-2 bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-500 flex items-center gap-2">
                        <FaUser /> Direct Messages
                      </div>
                      {directChats.map((chat) => (
                        <div
                          key={chat._id}
                          onClick={() => handleSelectChat(chat, 'direct')}
                          className={`p-4 border-b border-neutral-200 dark:border-neutral-700 cursor-pointer transition-colors ${
                            selectedChat?._id === chat._id && selectedType === 'direct'
                              ? "bg-primary-50 dark:bg-primary-900/20"
                              : "hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                              {chat.user?.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">{chat.user?.name}</p>
                              <p className="text-xs text-neutral-500 truncate">
                                {chat.lastMessage?.content || "No messages yet"}
                              </p>
                            </div>
                            {chat.unreadCount > 0 && (
                              <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-0.5">
                                {chat.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Empty State */}
                  {!loading && chatGroups.length === 0 && directChats.length === 0 && !showSearchResults && (
                    <div className="p-4 text-center">
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                        No conversations yet
                      </p>
                      <p className="text-neutral-500 text-xs mt-1">
                        Search for users to start chatting
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="flex-1">
          {selectedChat ? (
            <Card className="h-full flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    selectedType === 'group' 
                      ? 'bg-gradient-to-br from-accent-400 to-accent-600' 
                      : 'bg-gradient-to-br from-primary-400 to-primary-600'
                  }`}>
                    {selectedType === 'group' ? <FaUsers /> : (selectedChat.user?.name?.[0] || selectedChat.name?.[0] || '?')}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {selectedType === 'group' ? selectedChat.name : selectedChat.user?.name}
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {selectedType === 'group' 
                        ? `${selectedChat.members?.length || 0} members` 
                        : (typingUsers[selectedChat?._id] ? 'typing...' : 'Online')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors">
                    <FaPhone className="text-neutral-600 dark:text-neutral-400" />
                  </button>
                  <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors">
                    <FaVideo className="text-neutral-600 dark:text-neutral-400" />
                  </button>
                  <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors">
                    <FaInfoCircle className="text-neutral-600 dark:text-neutral-400" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-neutral-600 dark:text-neutral-400">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isOwn = msg.sender?._id === user?._id || msg.sender === user?._id;
                    return (
                      <div
                        key={msg._id || `${msg.sender?._id || msg.sender}-${msg.createdAt}`}
                        className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            isOwn
                              ? "bg-primary-500 text-white"
                              : "bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                          }`}
                        >
                          {/* Show sender name for group messages from others */}
                          {selectedType === 'group' && !isOwn && msg.sender?.name && (
                            <p className="text-xs font-semibold mb-1 opacity-75">{msg.sender.name}</p>
                          )}
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${isOwn ? 'text-primary-200' : 'text-neutral-500 dark:text-neutral-400'}`}>
                            {formatTime(msg.createdAt || msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                {typingUsers[selectedChat?._id] && (
                  <div className="flex justify-start">
                    <div className="bg-neutral-200 dark:bg-neutral-700 px-4 py-2 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-neutral-600 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-neutral-600 animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 rounded-full bg-neutral-600 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={isConnected ? "Type your message..." : "Connecting..."}
                    disabled={!isConnected}
                    className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="submit"
                    disabled={!isConnected}
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <FaPaperPlane /> Send
                  </button>
                </form>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Select a conversation to start messaging
                </p>
              </div>
            </Card>
          )}
        </div>
      </Container>
    </main>
  );
};

export default Chat;

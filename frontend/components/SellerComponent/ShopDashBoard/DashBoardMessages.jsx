"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { backend_url, server } from "@/lib/server";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { IoImagesOutline } from "react-icons/io5";
import socketIO from "socket.io-client";
import Image from "next/image";

// Update to your WebSocket server URL
const ENDPOINT = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "https://your-websocket-server.com";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

function DashBoardMessages() {
  const { user } = useSelector((state) => state.user);
  const { seller } = useSelector((state) => state.seller);
  const [conversation, setConversation] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [images, setImages] = useState();
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const response = await axios.get(
          `${server}/conversation/get-all-conversation-seller/${seller?._id}`,
          {
            withCredentials: true,
          },
        );

        setConversation(response.data.conversations);
      } catch (error) {
        console.log(error);
      }
    };
    getConversation();
  }, [seller, messages]);

  useEffect(() => {
    if (seller) {
      const sellerId = seller?._id;
      socketId.emit("addUser", sellerId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [seller]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== seller?._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);

    return online ? true : false;
  };

  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat?._id}`,
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const message = {
      sender: seller._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== seller._id,
    );

    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      text: newMessage,
    });

    try {
      if (newMessage !== "") {
        await axios
          .post(`${server}/message/create-new-message`, message)
          .then((res) => {
            setMessages([...messages, res.data.message]);
            updateLastMessage();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: seller._id,
    });

    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: seller._id,
      })
      .then((res) => {
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="no-scrollbar m-3 h-[82vh] w-[90%] overflow-y-scroll rounded bg-white">
      {!open && (
        <>
          <h1 className="py-4 text-center font-Poppins text-2xl font-semibold">
            All Messages
          </h1>
          {conversation &&
            conversation.map((item, index) => (
              <MessageList
                key={index}
                data={item}
                index={index}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                me={seller._id}
                setUserData={setUserData}
                userData={userData}
                online={onlineCheck(item)}
                setActiveStatus={setActiveStatus}
              />
            ))}
        </>
      )}

      {open && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={seller._id}
          userData={userData}
          activeStatus={activeStatus}
          scrollRef={scrollRef}
          setMessages={setMessages}
        />
      )}
    </div>
  );
}

function MessageList({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  online,
  setActiveStatus,
}) {
  const [active, setActive] = useState(0);

  const handleClick = (id) => {
    setOpen(true);
    setCurrentChat(data);
    setActiveStatus(online);
    setActive(index);
  };

  return (
    <div
      className={`flex w-full cursor-pointer p-2 px-3 ${
        active === index ? "bg-gray-300" : "bg-transparent"
      }`}
      onClick={() => handleClick(data._id)}
    >
      <div className="relative">
        <Image
          className="h-12 w-12 flex-shrink-0 rounded-full"
          src="https://cdn-icons-png.flaticon.com/128/9131/9131529.png"
          alt="User Avatar"
          width={48}
          height={48}
        />
        <span className="absolute left-8 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-400 dark:border-gray-800"></span>
      </div>
      <div className="pl-3">
        <h1 className="text-lg">Shafiq Ur Rehman</h1>
        <p className="text-[#000c]">You: Yeah, Im good</p>
      </div>
    </div>
  );
}

function SellerInbox({
  scrollRef,
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
}) {
  return (
    <div className="flex min-h-full w-full flex-col justify-between">
      {/* message header */}
      <div className="flex w-full items-center justify-between bg-slate-200 p-4">
        <div className="flex items-center">
          <Image
            src={
              userData?.avatar
                ? `${backend_url}${userData.avatar}`
                : "/assets/fallback-avatar.png"
            }
            className="h-12 w-12 rounded-full"
            alt="User Avatar"
            width={48}
            height={48}
          />
          <div className="pl-3">
            <h1 className="text-lg font-semibold">Hamaad Afzal</h1>
            <p>{activeStatus ? "Active now" : "Offline"}</p>
          </div>
        </div>
        <div>
          <AiOutlineArrowRight
            size={20}
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>
      </div>

      {/* messages */}
      <div className="no-scrollbar h-[55vh] overflow-y-scroll p-4">
        <div className="flex items-center gap-2">
          <Image
            src={
              userData?.avatar
                ? `${backend_url}${userData.avatar}`
                : "/assets/fallback-avatar.png"
            }
            alt="User Avatar"
            className="h-12 w-12 rounded-full"
            width={48}
            height={48}
          />
          <div className="h-max w-max rounded bg-green-500 px-3 py-2 text-white">
            Hello there!
          </div>
        </div>

        <div className="my-2 flex items-center gap-2">
          <Image
            src={
              userData?.avatar
                ? `${backend_url}${userData.avatar}`
                : "/assets/fallback-avatar.png"
            }
            alt="User Avatar"
            className="h-12 w-12 rounded-full"
            width={48}
            height={48}
          />
          <div className="h-max w-max rounded bg-green-500 px-3 py-2 text-white">
            How can I help you?
          </div>
        </div>

        <div className="my-2 flex items-center gap-2">
          <Image
            src={
              userData?.avatar
                ? `${backend_url}${userData.avatar}`
                : "/assets/fallback-avatar.png"
            }
            alt="User Avatar"
            className="h-12 w-12 rounded-full"
            width={48}
            height={48}
          />
          <div className="h-max w-max rounded bg-green-500 px-3 py-2 text-white">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            posuere erat a ante.
          </div>
        </div>

        {messages &&
          messages.map((item, index) => (
            <div
              className={`flex w-full ${
                item.sender === sellerId ? "justify-end" : "justify-start"
              }`}
              key={index}
            >
              {item.sender !== sellerId && (
                <Image
                  src={
                    userData?.avatar
                      ? `${backend_url}${userData.avatar}`
                      : "/assets/fallback-avatar.png"
                  }
                  className="h-8 w-8 rounded-full"
                  alt="User Avatar"
                  width={32}
                  height={32}
                />
              )}
              <div
                className={`mx-2 mt-2 flex h-min max-w-[40%] flex-col items-start rounded p-2 px-3 text-[#fff] ${
                  item.sender === sellerId ? "bg-[#38c776]" : "bg-[#38bdf8]"
                }`}
              >
                <p>{item.text}</p>
              </div>
            </div>
          ))}

        <div ref={scrollRef} />
      </div>

      {/* send message input */}
      <div className="flex w-full items-center justify-between border-t border-gray-300 p-3">
        <div className="w-[30px]">
          <IoImagesOutline size={25} className="cursor-pointer" />
        </div>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Enter your message..."
            className="w-full rounded-lg border border-[#38bdf8] bg-[#f5f5f5] p-3"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
        </div>
        <div className="ml-1 flex cursor-pointer items-center justify-center rounded-full bg-[#38bdf8] p-2">
          <AiOutlineSend size={20} className="text-white" onClick={sendMessageHandler} />
        </div>
      </div>
    </div>
  );
}

export default DashBoardMessages;
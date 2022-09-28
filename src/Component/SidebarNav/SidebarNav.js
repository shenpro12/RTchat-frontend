import styles from "./SidebarNav.module.css";
import MainTab from "../maintab/MainTab";
import Messenger from "../Messenger/Messenger";
import PhoneBook from "../PhoneBook/PhoneBook";
import Notification from "../Notifications/Notifications";
import Intro from "../Intro/Intro";
import ChatContent from "../ChatContent/ChatContent";
import Message from "../Message/Message";
import FriendNav from "../FriendNav/FriendNav";
import Profile from "../Profile/Profile";
import Setting from "../Setting/Setting";
import request from "../../utils/request";
import { SocketContext } from "../../index";
import { useState, createContext, useEffect, useContext, useRef } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceGrin, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
export const chatContext = createContext();

function SideBarNav() {
  let [notify, setNotify] = useState(false);
  const [typing, setTyping] = useState("");
  const [messageIsSeen, setMessageIsSeen] = useState(false);
  const [chatContentData, setChatContentData] = useState();
  const [emojiPicker, setEmojiPicker] = useState(false);
  //console.log(Date.now());
  const [chatcontent, setChatContent] = useState(false);
  const [mess, setMess] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [phoneBook, setPhoneBook] = useState(false);
  const [profile, setProfile] = useState(false);
  const [setting, setSetting] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sendMessageBtn, setSendMessageBtn] = useState(false);
  const input = useRef();
  const socket = useContext(SocketContext);

  if (chatContentData) {
    socket.on("friendSeeMessage", (id) => {
      if (chatContentData._id == id) {
        setMessageIsSeen(true);
      }
    });
    socket.on("friendIsTyping", (userName) => {
      setTyping(userName);
    });
    socket.on("friendIsStopTyping", (userName) => {
      if (userName == chatContentData.contact[0].userName) {
        setTyping("");
      }
    });
    socket.on("friendSendMessage", (message, id) => {
      //console.log(message);
      //console.log(chatContentData.contact[0].userName);
      if (chatContentData.contact[0]._id == message.userId) {
        setChatContentData({
          _id: id,
          ...chatContentData,
          contents: [...chatContentData.contents, message],
        });
        socket.emit("userSeeMessage", id, chatContentData.contact[0]._id);
      }
    });
  }
  socket.on("cantSendMessage", () => {
    setNotify(true);
  });
  useEffect(() => {
    setTimeout(() => {
      setNotify(false);
    }, 3000);
  }, [chatContentData]);
  useEffect(() => {
    if (Cookies.get("_data")) {
      const decode = JSON.parse(Cookies.get("_data").replace("j:", ""));
      socket.emit("userLogin", {
        userName: decode.userName,
        userId: decode._id,
        friends: decode.friends,
      });
    } else {
      window.location.reload();
    }
  }, []);

  const handletab = (type) => {
    if (type === "mess") {
      setMess(true);
      setPhoneBook(false);
      setNotifications(false);
    }
    if (type === "phoneBook") {
      setPhoneBook(true);
      setMess(false);
      setNotifications(false);
    }
    if (type === "notifications") {
      setPhoneBook(false);
      setMess(false);
      setNotifications(true);
    }
    if (type === "profile") {
      setProfile(true);
    }
    if (type === "setting") {
      setSetting(true);
    }
    if (type === "close") {
      setProfile(false);
    }
    if (type === "closeSetting") {
      setSetting(false);
    }
  };
  const showChat = (data) => {
    if (data) {
      setChatContent(true);
      setChatContentData(data);
      socket.off("friendSendMessage");
      socket.off("friendSeeMessage");
      //console.log(data);
    } else {
      setChatContent(false);
      setChatContentData(false);
      socket.off("friendSendMessage");
      socket.off("friendSeeMessage");
    }
  };
  const closeChat = () => {
    setChatContent(false);
    setChatContentData(false);
    socket.off("friendSendMessage");
    socket.off("friendSeeMessage");
  };

  //
  async function sendMessHandle(str) {
    if (!Cookies.get("_data")) {
      return;
    }
    input.current.focus();
    setEmojiPicker(false);
    if (messageText || str) {
      setMessageText("");
      const res = await request.post("user/objId");
      if (res.data._id) {
        let temp = [];
        temp.push({
          createdAt: Date.now(),
          _id: res.data._id,
          delete: [],
          content: str ? str : messageText,
          userId: JSON.parse(Cookies.get("_data").replace("j:", ""))._id,
        });
        socket.emit(
          "userSendMessage",
          temp,
          chatContentData.contact[0]._id,
          chatContentData._id //for only user have chat before
        );
        setChatContentData({
          ...chatContentData,
          contents: [...chatContentData.contents, ...temp],
          newMessage: {
            userId: chatContentData.newMessage.userId,
            count: chatContentData.newMessage.count + 1,
          },
        });
      }
      if (res.data.isAuth == false) {
        window.location.reload();
      }
    }
  }
  useEffect(() => {
    if (chatContentData) {
      if (chatContentData.newMessage.count > 0) {
        setMessageIsSeen(false);
      } else {
        setMessageIsSeen(true);
      }
    }
  }, [chatContentData]);
  useEffect(() => {
    if (messageText) {
      setSendMessageBtn(true);
    } else {
      setSendMessageBtn(false);
    }
  }, [messageText]);
  return (
    <div className={styles.container}>
      {profile && <Profile onhandletab={handletab} />}
      {setting && <Setting onhandletab={handletab} />}
      <MainTab onhandletab={handletab} onCloseChat={closeChat} />
      {mess && (
        <chatContext.Provider value={showChat}>
          <Messenger active={chatContentData ? chatContentData._id : false} />
        </chatContext.Provider>
      )}
      {phoneBook && (
        <chatContext.Provider value={showChat}>
          <PhoneBook active={chatContentData ? chatContentData._id : false} />
        </chatContext.Provider>
      )}
      {notifications && (
        <chatContext.Provider value={showChat}>
          <Notification />
        </chatContext.Provider>
      )}
      {chatcontent && (
        <ChatContent>
          <FriendNav
            callBack={closeChat}
            userName={chatContentData.contact[0].userName}
            name={chatContentData.contact[0].name}
            avatar={chatContentData.contact[0].image}
          />
          <Message
            id={chatContentData._id}
            data={chatContentData.contents}
            contact={{
              id: chatContentData.contact[0]._id,
              image: chatContentData.contact[0].image,
            }}
            messageIsSeen={messageIsSeen}
          />
          {notify && (
            <div className={styles.notify}>
              <p>Người này không nhận tin nhắn từ người lạ!</p>
            </div>
          )}
          <div className={styles.chatContent_input_continer}>
            {typing == chatContentData.contact[0].userName && (
              <p className={styles.typing}>Soạn tin...</p>
            )}
            <div className={styles.chatContent_input}>
              <textarea
                style={{ width: "90%" }}
                value={messageText}
                ref={input}
                autoFocus
                placeholder="Nhập tin nhắn..."
                onFocus={() => {
                  if (Cookies.get("_data")) {
                    socket.emit("usertyping", {
                      contact: chatContentData.contact[0].userName,
                      userName: JSON.parse(
                        Cookies.get("_data").replace("j:", "")
                      ).userName,
                    });
                  }
                }}
                onBlur={() => {
                  if (Cookies.get("_data")) {
                    socket.emit("userStopTyping", {
                      contact: chatContentData.contact[0].userName,
                      userName: JSON.parse(
                        Cookies.get("_data").replace("j:", "")
                      ).userName,
                    });
                  }
                }}
                onInput={(e) => {
                  setMessageText(e.target.value);
                }}
              ></textarea>
              {emojiPicker && (
                <div className={styles.emojiPicker}>
                  <Picker
                    theme="light"
                    previewPosition="none"
                    skin="2"
                    data={data}
                    onEmojiSelect={(e) => {
                      setMessageText(messageText + e.native);
                      input.current.focus();
                    }}
                  />
                </div>
              )}
              <p
                className={styles.emoji_btn_container}
                onClick={() => {
                  setEmojiPicker(!emojiPicker);
                }}
              >
                <FontAwesomeIcon
                  icon={faFaceGrin}
                  className={styles.emoji_btn}
                />
              </p>

              <p className={styles.sendMess}>
                {sendMessageBtn ? (
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    onClick={() => {
                      sendMessHandle();
                    }}
                  />
                ) : (
                  <img
                    alt="emoji"
                    title="Gửi nhanh biểu tượng cảm xúc"
                    src="http://localhost:3001/img/like.png"
                    onClick={() => {
                      sendMessHandle("👍");
                    }}
                  />
                )}
              </p>
            </div>
          </div>
        </ChatContent>
      )}
      {!chatcontent && <Intro />}
    </div>
  );
}

export default SideBarNav;

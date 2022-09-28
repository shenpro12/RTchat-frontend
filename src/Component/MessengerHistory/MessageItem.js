import styles from "./MessengerHistory.module.css";
import Avartar from "../Avartar/Avartar";
import Modal from "../Modal/Modal";
import { useContext, useState, useEffect } from "react";
import { chatContext } from "../SidebarNav/SidebarNav";
import { SocketContext } from "../../index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
function MessageItem({ data, setMessage, active }) {
  const [modal, setModal] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const socket = useContext(SocketContext);
  const chatHandle = useContext(chatContext);
  //console.log(data);
  socket.on("friendIsOnline", (userName) => {
    if (data.contact[0].userName == userName) {
      setIsOnline(true);
    }
  });
  /*socket.on("seeDone", () => {
    data.newMessage = { userId: "" };
    setIsOnline(isOnline);
  });*/
  socket.on("friendsOff", (userName) => {
    if (data.contact[0].userName == userName) {
      setIsOnline(false);
    }
  });
  useEffect(() => {
    socket.emit("checkFriendOnline", data.contact[0].userName, (res) => {
      setIsOnline(res);
    });
  });
  //console.log(data);
  let lastMessage = data.contents[data.contents.length - 1].content;

  if (data.contents[data.contents.length - 1].userId != data.contact[0]._id) {
    lastMessage = "Bạn:" + lastMessage;
  }
  let boldText = "";
  if (data.newMessage.userId == data.contact[0]._id) {
    boldText = ` ${styles.boldText}`;
  }
  function getTime() {
    let time = "Vừa xong";
    let date1 = new Date(data.updatedAt);
    let date2 = new Date(Date.now());
    let Difference_In_Time = (date2.getTime() - date1.getTime()) / 1000 / 60;
    let Difference_In_minute = Math.abs(Math.round(Difference_In_Time));
    if (Difference_In_minute < 60 && Difference_In_minute > 0) {
      time = `${Difference_In_minute} phút`;
    } else if (Difference_In_minute > 59) {
      if (Math.floor(Difference_In_minute / 60) < 24) {
        time = `${Math.floor(Difference_In_minute / 60)} giờ`;
      } else {
        time = `${Math.floor(Difference_In_minute / 60 / 24)} ngày`;
      }
    }
    return time;
  }
  function textFormat(text) {
    //format for text is emoji encoded
    return { __html: text };
  }
  return (
    <div
      className={`${styles.MessageItem_container} ${
        active ? styles.active : ""
      }`}
      onClick={() => {
        chatHandle(data);
        if (data.newMessage.userId == data.contact[0]._id) {
          socket.emit("userSeeMessage", data._id, data.contact[0]._id);
          data.newMessage = { userId: "", count: 0 };
          setIsOnline(isOnline);
        }
      }}
    >
      {modal && (
        <Modal
          type="message"
          text={data.name ? data.name : data.userName}
          onClose={() => {
            setModal(!modal);
          }}
          onChoose={() => {
            chatHandle(false);
            setMessage(data._id);
          }}
        />
      )}
      <div>
        <Avartar src={data.contact[0].image} onlineDot={isOnline} />
      </div>
      <div>
        {data.contact.map((item) => (
          <p className={styles.name} key={item._id}>
            {item.name ? item.name : item.userName}
          </p>
        ))}
        <p
          className={styles.lastMessage + boldText}
          dangerouslySetInnerHTML={textFormat(lastMessage)}
        ></p>
      </div>
      {data.newMessage.userId == data.contact[0]._id ? (
        <p className={styles.newMessage}>
          {data.newMessage.count < 100 ? data.newMessage.count : "N+"}
        </p>
      ) : (
        ""
      )}
      <div
        className={styles.options_container}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <p className={styles.time}>{getTime()}</p>
        <FontAwesomeIcon
          title="Xóa tin nhắn"
          icon={faTrash}
          className={`${styles.options} ${styles.delete}`}
          onClick={(e) => {
            e.stopPropagation();
            setModal(true);
          }}
        />
      </div>
    </div>
  );
}

export default MessageItem;

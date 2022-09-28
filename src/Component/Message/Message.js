import styles from "./Message.module.css";
import { SocketContext } from "../../index";
import { useEffect, useRef, memo, useState, useContext } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
function Message({ id, data, contact, messageIsSeen, children }) {
  let [messageData, setMessageData] = useState();
  const socket = useContext(SocketContext);
  socket.emit("userCheckMessage", contact.id, id);
  messageData = data;
  //console.log(data);
  const div = useRef();

  useEffect(() => {
    div.current.scrollTop = div.current.scrollHeight;
  }, [data]);
  function checkTime(item, pre) {
    if (pre) {
      let itemDate = new Date(item.createdAt);
      let preDate = new Date(pre.createdAt);
      if (
        `${itemDate.getDate()}/${
          itemDate.getMonth() + 1
        }/${itemDate.getFullYear()}` ==
        `${preDate.getDate()}/${
          preDate.getMonth() + 1
        }/${preDate.getFullYear()}`
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
  function getTime(time) {
    let itemDate = new Date(time);
    //console.log(messageData);
    let now = new Date(Date.now());
    if (
      `${itemDate.getDate()}/${
        itemDate.getMonth() + 1
      }/${itemDate.getFullYear()}` ==
      `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`
    ) {
      return "Hôm nay";
    } else {
      return `${itemDate.getDate()}/${
        itemDate.getMonth() + 1
      }/${itemDate.getFullYear()}`;
    }
  }
  return (
    <div className={styles.container} ref={div}>
      {messageData.map((item, index) => {
        if (item.userId == contact.id) {
          return (
            <div key={item._id}>
              {checkTime(item, messageData[index - 1]) && (
                <div className={styles.time}>
                  <div className={styles.time_line}></div>
                  <p className={styles.time_text}>{getTime(item.createdAt)}</p>
                  <div className={styles.time_line}></div>
                </div>
              )}
              <p className={styles.contactMessage}>
                {item.content}
                <span className={styles.time_message}>
                  {new Date(item.createdAt).getHours()}:
                  {new Date(item.createdAt).getMinutes()}
                </span>
              </p>
            </div>
          );
        }
        return (
          <div key={item._id} className={styles.right}>
            {checkTime(item, messageData[index - 1]) && (
              <div className={styles.time}>
                <div className={styles.time_line}></div>
                <p className={styles.time_text}>{getTime(item.createdAt)}</p>
                <div className={styles.time_line}></div>
              </div>
            )}
            <p className={styles.userMessage}>
              {item.content}
              <span className={styles.time_message}>
                {new Date(item.createdAt).getHours()}:
                {new Date(item.createdAt).getMinutes()}
              </span>
            </p>
          </div>
        );
      })}
      {!data.length ? (
        ""
      ) : data[data.length - 1].userId == contact.id ? (
        ""
      ) : messageIsSeen ? (
        <div className={styles.image_container}>
          <img
            alt="Avatar"
            src={
              contact.image
                ? contact.image
                : "https://res.cloudinary.com/dhhkjmfze/image/upload/v1661132447/user_zldhyu.png"
            }
            className={styles.image}
          />
        </div>
      ) : (
        <div className={styles.image_container}>
          <FontAwesomeIcon
            icon={faCircleCheck}
            className={styles.cricleCheck}
          />
        </div>
      )}
      {children}
    </div>
  );
}

export default memo(Message);

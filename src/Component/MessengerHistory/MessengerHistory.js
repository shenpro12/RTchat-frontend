import styles from "./MessengerHistory.module.css";
import MessageItem from "./MessageItem";
import { useState, useEffect } from "react";
function MessengerHistory({ message, setMessage, active }) {
  const [count, setCount] = useState(0);
  let number = 0;
  message.map((item) => {
    if (item.contents.length) {
      number += 1;
    }
  });
  useEffect(() => {
    setCount(number);
  }, [message]);
  return (
    <div className={styles.container}>
      <p>{`Tất cả tin nhắn(${count})`}</p>
      {message.map((item) => {
        if (item.contents.length) {
          return (
            <MessageItem
              key={item._id}
              data={item}
              setMessage={setMessage}
              active={item._id == active ? true : false}
            />
          );
        }
      })}
    </div>
  );
}

export default MessengerHistory;

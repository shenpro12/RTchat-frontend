import styles from "./Intro.module.css";
import { useState, useEffect } from "react";
function Intro() {
  const [index, setIndex] = useState(0);
  const imgSrc = [
    {
      src: "http://localhost:3001/img/intro1.png",
      description: "Nhắn tin nhiều hơn, soạn thảo ít hơn",
    },
    {
      src: "http://localhost:3001/img/intro2.png",
      description: "Trao đổi công việc mọi lúc mọi nơi",
    },
    {
      src: "http://localhost:3001/img/intro3.png",
      description: "Trò truyện, kết bạn bốn phương",
    },
  ];
  useEffect(() => {
    let div = document.querySelectorAll(`.${styles.image}`);

    setTimeout(() => {
      for (let i = 0; i < div.length; i++) {
        div[i].classList.remove(styles.active);
      }
      if (index + 1 > 2) {
        setIndex(0);
      } else {
        setIndex(index + 1);
      }
      div[index].classList.add(styles.active);
    }, 4000);
  });

  //socket.emit("hello", "word");
  return (
    <div className={styles.container}>
      <h1>Chào mừng đến với RTchat!</h1>
      <p>
        Khám phá những tiện ích hỗ trợ và làm việc, trò chuyện cùng người thân,
        bạn bè được tối ưu hóa cho máy tính.
      </p>
      {imgSrc.map((item, index) => (
        <div
          key={index}
          className={`${styles.image} ${index ? "" : styles.active}`}
        >
          <img alt="introductions" src={item.src} />
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Intro;

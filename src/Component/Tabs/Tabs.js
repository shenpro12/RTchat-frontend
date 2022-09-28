import styles from "./Tabs.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMessage,
  faContactBook,
  faAddressCard,
  faBell,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
function Tabs({ onhandletab, onCloseChat, onChangeTab, data }) {
  const [mess, setMess] = useState(true);
  const [phoneBook, setPhoneBook] = useState(false);
  const [notifications, setNotifications] = useState(false);
  useEffect(() => {
    if (mess) {
      onChangeTab("mess");
    }
    if (notifications) {
      onChangeTab("notifications");
    }
  }, [data.message || data.notify]);
  const handleActive = (type) => {
    if (type === "mess") {
      setMess(true);
      setPhoneBook(false);
      setNotifications(false);
    }
    if (type === "phoneBook") {
      setMess(false);
      setPhoneBook(true);
      setNotifications(false);
    }
    if (type === "notifications") {
      setPhoneBook(false);
      setMess(false);
      setNotifications(true);
    }
  };
  return (
    <div className={styles.container}>
      <div
        className={styles.icons + ` ${mess && styles.active}`}
        title="Tin nhắn"
        onClick={() => {
          onhandletab("mess");
          handleActive("mess");
          onChangeTab("mess");
          if (window.innerWidth <= 997) {
            onCloseChat();
          }
        }}
      >
        {data.message ? (
          <div className={styles.count_container}>
            <p className={styles.count}>
              {data.message <= 10 ? data.message : "N"}
            </p>
          </div>
        ) : (
          ""
        )}
        <FontAwesomeIcon icon={faMessage} size="2x" />
      </div>
      <div
        className={styles.icons + ` ${phoneBook && styles.active}`}
        title="Danh bạ"
        onClick={() => {
          onhandletab("phoneBook");
          handleActive("phoneBook");
          if (window.innerWidth <= 997) {
            onCloseChat();
          }
        }}
      >
        <FontAwesomeIcon icon={faContactBook} size="2x" />
      </div>
      <div
        className={styles.icons + ` ${notifications && styles.active}`}
        title="Thông báo"
        onClick={() => {
          handleActive("notifications");
          onhandletab("notifications");
          onChangeTab("notifications");
          if (window.innerWidth <= 997) {
            onCloseChat();
          }
        }}
      >
        {data.notify ? (
          <div className={styles.count_container}>
            <p className={styles.count}>
              {data.notify <= 99 ? data.notify : "N"}
            </p>
          </div>
        ) : (
          ""
        )}
        <FontAwesomeIcon icon={faBell} size="2x" />
        {false && <p className={styles.notify_number}>86</p>}
      </div>
      <div
        className={styles.icons}
        title="Thông tin cá nhân"
        onClick={() => {
          onhandletab("profile");
        }}
      >
        <FontAwesomeIcon icon={faAddressCard} size="2x" />
      </div>
      <div
        className={styles.icons}
        title="Cài đặt"
        onClick={() => {
          onhandletab("setting");
        }}
      >
        <FontAwesomeIcon icon={faGear} size="2x" />
      </div>
    </div>
  );
}

export default Tabs;

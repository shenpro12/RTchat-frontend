import styles from "./Setting.module.css";
import Modal from "../Modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDisplay,
  faMobileAndroidAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
function LoginHistoriesItem({ data, onLogout }) {
  const [modal, setModal] = useState(false);
  const [item, setitem] = useState(data);
  //console.log(data);
  function getTime() {
    let time = "Vừa xong";
    let date1 = new Date(parseInt(item.createdAt));
    let date2 = new Date(Date.now());
    let Difference_In_Time = (date2.getTime() - date1.getTime()) / 1000 / 60;
    let Difference_In_minute = Math.abs(Math.round(Difference_In_Time));
    if (Difference_In_minute < 60 && Difference_In_minute > 0) {
      time = `${Difference_In_minute} phút trước`;
    } else if (Difference_In_minute > 59) {
      if (Math.floor(Difference_In_minute / 60) < 24) {
        time = `${Math.floor(Difference_In_minute / 60)} giờ trước`;
      } else {
        time = `${Math.floor(Difference_In_minute / 60 / 24)} ngày trước`;
      }
    }
    return time;
  }
  return (
    <div className={styles.wrap}>
      {modal && (
        <Modal
          type="logout"
          text="Bạn có chắc muốn đăng xuất khỏi thiết bị này?"
          onClose={() => {
            setModal(!modal);
          }}
          onChoose={() => {
            onLogout(item._id);
          }}
        />
      )}
      {item.thisDevice ? (
        ""
      ) : item.device.type == "Android" || item.device.type == "iOS" ? (
        <div className={styles.loginItem_container}>
          <FontAwesomeIcon icon={faMobileAndroidAlt} className={styles.icons} />
          <div>
            <p>
              {item.device.deviceName}
              {`(${item.device.type})`}
            </p>
            <p className={styles.ua}>{item.device.ua}</p>
            <p className={styles.time}>{getTime()}</p>
          </div>
          <FontAwesomeIcon
            icon={faTrashAlt}
            className={styles.deleteDevice}
            title="Đăng xuất khỏi thiết bị"
            onClick={() => {
              setModal(true);
            }}
          />
        </div>
      ) : (
        <div className={styles.loginItem_container}>
          <FontAwesomeIcon
            icon={faDisplay}
            className={`${styles.icons} ${styles.desktop}`}
          />
          <div>
            <p>
              {item.device.deviceName}
              {`(${item.device.type})`}
            </p>
            <p className={styles.ua}>{item.device.ua}</p>
            <p className={styles.time}>{getTime()}</p>
          </div>
          <FontAwesomeIcon
            icon={faTrashAlt}
            className={styles.deleteDevice}
            title="Đăng xuất khỏi thiết bị"
            onClick={() => {
              setModal(true);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default LoginHistoriesItem;

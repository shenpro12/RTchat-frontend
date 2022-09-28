import styles from "./Modal.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useRef, useEffect } from "react";
function Modal({ type, text, onClose, onChoose }) {
  const content = useRef();
  useEffect(() => {
    let str = "";
    if (type == "friend") {
      str = `Xóa <span style="font-weight:bold">${text}</span> khỏi danh sách bạn bè.`;
    }
    if (type == "message") {
      str = `Toàn bộ nội dung cuộc trò chuyện sẽ bị xóa vĩnh viễn.`;
    }
    if (type == "logout") {
      str = text;
    }
    content.current.innerHTML = str;
  });
  return (
    <div
      className={styles.container}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className={styles.wrap}>
        <div className={styles.header}>
          <p>Xác nhận</p>
          <div
            className={styles.close}
            onClick={() => {
              onClose();
            }}
          >
            <FontAwesomeIcon icon={faClose} className={styles.btn_close} />
          </div>
        </div>
        <div className={styles.content}>
          <p ref={content}></p>
          {type == "logout" ? "" : <p>Bạn có chắc muốn xóa?</p>}
        </div>
        <div className={styles.options}>
          <p
            className={styles.btn_cancel}
            onClick={() => {
              onClose();
            }}
          >
            Hủy
          </p>
          <p
            className={styles.btn_accept}
            onClick={() => {
              onChoose();
            }}
          >
            Xác nhận
          </p>
        </div>
      </div>
    </div>
  );
}

export default Modal;

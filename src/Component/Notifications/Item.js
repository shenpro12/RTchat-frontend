import styles from "./Notifications.module.css";
import Avatar from "../Avartar/Avartar";
import FriendProfile from "../Profile/FriendProfile";
import { SocketContext } from "../../index";
import { useEffect, useState, useContext, useRef } from "react";
import jwt_decode from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
function Item({ data, onDelete }) {
  //console.log(data);
  const socket = useContext(SocketContext);
  const [notify, setNotify] = useState(data);
  const [info, setInfo] = useState(false);
  //const choose = useRef();
  socket.on("resCheckNotify", (id) => {
    if (notify._id == id) {
      setNotify({ ...notify, status: "processed" });
    }
  });
  let str = "";
  if (notify.type == "add") {
    str = `Bạn nhận được lời mời kết bạn từ `;
  }
  if (notify.type == "request") {
    str = ` đã chấp nhận lời mời kết bạn!`;
  }

  const onhandleOptions = () => {
    setInfo(!info);
  };
  const showInfo = () => {
    setInfo(true);
  };
  function getTime() {
    let time = "Vừa xong";
    let date1 = new Date(parseInt(notify.createdAt));
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
    <>
      {info && (
        <FriendProfile data={notify} onhandleOptions={onhandleOptions} />
      )}
      <div className={styles.wrap}>
        <div className={styles.item_container}>
          <div
            title="Xem thông tin cá nhân"
            onClick={(e) => {
              e.stopPropagation();
              showInfo();
              if (
                notify.type == "request" &&
                notify.status == "waiting" &&
                Cookies.get("_data")
              ) {
                socket.emit(
                  "userCheckNotify",
                  notify._id,
                  JSON.parse(Cookies.get("_data").replace("j:", ""))._id
                );
              }
            }}
          >
            <Avatar src={notify.image} margin="auto 5px" />
          </div>
          {notify.type == "request" ? (
            <>
              <div>
                <p className={styles.notify_content}>
                  <span
                    title="Xem thông tin cá nhân"
                    onClick={(e) => {
                      e.stopPropagation();
                      showInfo();
                      if (
                        notify.type == "request" &&
                        notify.status == "waiting" &&
                        Cookies.get("_data")
                      ) {
                        socket.emit(
                          "userCheckNotify",
                          notify._id,
                          JSON.parse(Cookies.get("_data").replace("j:", ""))._id
                        );
                      }
                    }}
                  >
                    {notify.name ? notify.name : notify.userName}
                  </span>
                  {str}
                </p>
                <p className={styles.time}>{getTime()}</p>
              </div>
              <div className={styles.options}>
                <FontAwesomeIcon
                  icon={faEllipsis}
                  className={styles.options_icons}
                />
                <div>
                  <div className={styles.option_choose}>
                    <p
                      onClick={() => {
                        onDelete(notify._id);
                      }}
                    >
                      Xóa thông báo này
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className={styles.notify_content}>
                  {str}
                  <span
                    title="Xem thông tin cá nhân"
                    onClick={(e) => {
                      e.stopPropagation();
                      showInfo();
                    }}
                  >
                    {notify.name ? notify.name : notify.userName}
                  </span>
                </p>
                <p className={styles.time}>{getTime()}</p>
              </div>
              <div className={styles.options}>
                <FontAwesomeIcon
                  icon={faEllipsis}
                  className={styles.options_icons}
                />
                <div>
                  <div className={styles.option_choose}>
                    <p
                      onClick={() => {
                        onDelete(notify._id);
                      }}
                    >
                      Xóa thông báo này
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
          {data.status == "waiting" && notify.status == "waiting" && (
            <div className={styles.dot_container}>
              <div className={styles.dot}></div>
            </div>
          )}
        </div>
        {data.type == "add" && data.status == "waiting" && (
          <div className={styles.add_options}>
            <p
              className={styles.accept_button}
              onClick={(e) => {
                e.stopPropagation();
                if (Cookies.get("_data")) {
                  socket.emit(
                    "userAddFriend",
                    data.userId,
                    JSON.parse(Cookies.get("_data").replace("j:", ""))._id
                  );
                }
              }}
            >
              Chấp nhận
            </p>
            <p className={styles.denie_button}>Từ chối</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Item;

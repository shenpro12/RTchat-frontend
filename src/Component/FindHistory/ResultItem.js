import styles from "./FindHistory.module.css";
import Avatar from "../Avartar/Avartar";
import FriendProfile from "../Profile/FriendProfile";
import request from "../../utils/request";
import { SocketContext } from "../../index";
import { chatContext } from "../SidebarNav/SidebarNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faUserCheck,
  faUserPlus,
  faUserMinus,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef, useContext } from "react";
import Cookies from "js-cookie";
function ResultItem({ data, text, message }) {
  const [dataRender, setDataRender] = useState(data);
  //console.log(data);
  const chatHandle = useContext(chatContext);
  const [info, setInfo] = useState(false);
  const [userData, setUserData] = useState();
  const socket = useContext(SocketContext);
  socket.on("cancelAdd", (id) => {
    if (id == dataRender._id) {
      setDataRender({ ...dataRender, friend: false, notify: false });
    }
  });
  socket.on("resAcceptAddWaiting", (id) => {
    if (id == dataRender._id) {
      setDataRender({ ...dataRender, friend: false, notify: true });
    }
  });
  socket.on("resAcceptAdd", (id) => {
    if (id == dataRender._id) {
      setDataRender({ ...dataRender, friend: true });
    }
  });
  const name = useRef();
  const email = useRef();
  useEffect(() => {
    let regEx = new RegExp(text, "i");
    let userName = dataRender.name ? dataRender.name : dataRender.userName;
    let userEmail = dataRender.userName;
    let n = userName.match(regEx);
    let e = userEmail.match(regEx);
    if (n) {
      [...new Set(n)].map((item) => {
        userName = userName.replace(
          item,
          `<span class="${styles.replace}">${item}</span>`
        );
      });
    }
    if (e) {
      [...new Set(e)].map((item) => {
        userEmail = userEmail.replace(
          item,
          `<span class="${styles.replace}">${item}</span>`
        );
      });
    }
    name.current.innerHTML = userName;
    email.current.innerHTML = `Email:${userEmail}`;
  }, [text]);
  const onhandleOptions = () => {
    setInfo(!info);
  };
  const showInfo = async () => {
    setUserData(dataRender);
    setInfo(true);
  };
  const addSearchHistory = async () => {
    const res = await request.post("user/searchhistories/add", {
      data: {
        historyData: {
          name: data.name,
          phone: data.phone,
          image: data.image,
          gender: data.gender,
          birthday: data.birthday,
          userId: data._id,
          userName: data.userName,
        },
      },
    });
    if (res.data.isAuth == false) {
      window.location.reload();
    }
  };
  return (
    <>
      {info && (
        <FriendProfile data={userData} onhandleOptions={onhandleOptions} />
      )}
      <div
        className={styles.result_container}
        onClick={() => {
          chatHandle(message);
          addSearchHistory();
        }}
      >
        <Avatar src={dataRender.image} />
        <div>
          <p ref={name}>
            {dataRender.name ? dataRender.name : dataRender.userName}
          </p>
          <p ref={email} className={styles.emailText}>
            Email:{dataRender.userName}
          </p>
        </div>
        <div className={styles.options_container}>
          <FontAwesomeIcon
            title="Xem thông tin"
            icon={faAddressCard}
            className={`${styles.options} ${styles.card}`}
            onClick={(e) => {
              e.stopPropagation();
              showInfo();
              addSearchHistory();
            }}
          />
          {dataRender.friend ? (
            <FontAwesomeIcon
              title="Bạn bè"
              icon={faUserCheck}
              className={`${styles.options} ${styles.friend}`}
            />
          ) : dataRender.notify ? (
            <FontAwesomeIcon
              title="Hủy lời mời"
              icon={faUserMinus}
              className={`${styles.options} ${styles.add}`}
              onClick={(e) => {
                e.stopPropagation();
                if (Cookies.get("_data")) {
                  socket.emit(
                    "userCancelAddFriend",
                    dataRender._id,
                    JSON.parse(Cookies.get("_data").replace("j:", ""))._id
                  );
                }
              }}
            />
          ) : (
            <FontAwesomeIcon
              title="Thêm bạn"
              icon={faUserPlus}
              className={`${styles.options} ${styles.add}`}
              onClick={(e) => {
                e.stopPropagation();
                if (Cookies.get("_data")) {
                  socket.emit(
                    "userAddFriend",
                    dataRender._id,
                    JSON.parse(Cookies.get("_data").replace("j:", ""))._id
                  );
                }
                addSearchHistory();
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default ResultItem;

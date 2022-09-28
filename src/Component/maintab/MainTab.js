import styles from "./MainTab.module.css";
import Avartar from "../Avartar/Avartar";
import Tabs from "../Tabs/Tabs";
import request from "../../utils/request";
import messageSound from "../../soundEffect/message.mp3";
import notifySound from "../../soundEffect/notify.wav";
import NotifyMini from "./NotifyMini";
import { SocketContext } from "../../index";
import { useState, useEffect, useContext, useRef } from "react";
function MainTab({ onhandletab, onCloseChat }) {
  const socket = useContext(SocketContext);
  const [notifyMini, setNotifyMini] = useState(false);
  const [notifyMiniData, setNotifyMiniData] = useState({});
  const [data, setData] = useState();
  const [notificationsCount, setNotificationsCount] = useState({
    notify: 0,
    message: 0,
  });
  const messageEffect = useRef();
  const notifyEffect = useRef();
  socket.on("haveNewMessage", () => {
    setNotificationsCount({
      ...notificationsCount,
      message: notificationsCount.message + 1,
    });
    messageEffect.current.play();
  });
  socket.on("haveNewNotify", (data) => {
    setNotificationsCount({
      ...notificationsCount,
      notify: notificationsCount.notify + 1,
    });
    notifyEffect.current.play();
    setNotifyMiniData(data);
    setNotifyMini(true);
  });
  socket.on("strangerCancelAdd", () => {
    setNotificationsCount({
      ...notificationsCount,
      notify: notificationsCount.notify - 1,
    });
  });
  useEffect(() => {
    if (notifyMini) {
      setTimeout(() => {
        setNotifyMini(false);
      }, 3000);
    }
  });
  useEffect(() => {
    async function fetch() {
      const res = await request.post("user/profile");
      //console.log(res);
      if (res.data.isAuth == false) {
        window.location.reload();
      }
      if (res.data.profile) {
        setData(res.data.profile.image);
      }
    }
    fetch();
  }, []);
  useEffect(() => {
    async function fetch() {
      const res = await request.post("user/notificationsCount");
      //console.log(res);
      if (res.data.isAuth == false) {
        window.location.reload();
      }
      if (res.data.data) {
        setNotificationsCount(res.data.data);
      }
    }
    fetch();
  }, []);
  const changeTabhandle = async (type) => {
    if (type == "mess") {
      setNotificationsCount({ ...notificationsCount, message: 0 });
    }
    if (type == "notifications") {
      setNotificationsCount({ ...notificationsCount, notify: 0 });
    }
    const res = await request.post("user/notificationsCount/update", {
      data: {
        notificationsCount: {
          message: type == "mess" ? 0 : notificationsCount.message,
          notify: type == "notifications" ? 0 : notificationsCount.notify,
        },
      },
    });
    //console.log(res);
    if (res.data.isAuth == false) {
      window.location.reload();
    }
  };
  return (
    <div className={styles.container}>
      <audio ref={messageEffect}>
        <source src={messageSound} type="audio/mpeg"></source>
      </audio>
      <audio ref={notifyEffect}>
        <source src={notifySound} type="audio/mpeg"></source>
      </audio>
      <Avartar margin="30px auto 0px" src={data} />
      <Tabs
        data={notificationsCount}
        onhandletab={onhandletab}
        onCloseChat={onCloseChat}
        onChangeTab={changeTabhandle}
      />
      {notifyMini && <NotifyMini data={notifyMiniData} />}
    </div>
  );
}

export default MainTab;

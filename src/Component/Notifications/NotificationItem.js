import styles from "./Notifications.module.css";
import request from "../../utils/request";
import Item from "./Item";
import { SocketContext } from "../../index";
import { useEffect, useState, useContext } from "react";
function Notification() {
  const socket = useContext(SocketContext);
  const [notify, setNotify] = useState([]);
  const [recall, setRecal] = useState(false);
  socket.on("resAcceptAdd", (id) => {
    setRecal(!recall);
  });
  socket.on("strangerCancelAdd", () => {
    setRecal(!recall);
  });
  useEffect(() => {
    async function fetch() {
      //console.log("recall");
      const res = await request.post("user/notifications");
      //console.log(res);
      if (res.data.notify.length) {
        setNotify(res.data.notify);
      } else {
        setNotify([]);
      }

      if (res.data.isAuth == false) {
        window.location.reload();
      }
    }
    fetch();
  }, [recall]);
  const deleteNotify = async (id) => {
    //console.log(id);
    const res = await request.post("user/notifications/delete", {
      data: {
        id: id,
      },
    });
    //console.log(res);
    if (res.data.status) {
      setNotify(
        notify.filter((item) => {
          if (item._id == id) {
            return false;
          }
          return true;
        })
      );
    }

    if (res.data.isAuth == false) {
      window.location.reload();
    }
  };
  const deleteAllNotify = async () => {
    const res = await request.post("user/notifications/deleteall");
    if (res.data.isAuth == false) {
      window.location.reload();
    }

    if (res.data.status) {
      setNotify([]);
    }
  };
  return (
    <div className={styles.notification_container}>
      <div className={styles.notifyHeader_container}>
        <p>{`Thông báo(${notify.length})`}</p>
        {notify.length ? (
          <h3
            className={styles.deleteNotify_btn}
            onClick={() => {
              deleteAllNotify();
            }}
          >
            Xóa tất cả
          </h3>
        ) : (
          ""
        )}
      </div>
      {notify.length
        ? notify.map((item) => {
            return <Item key={item._id} data={item} onDelete={deleteNotify} />;
          })
        : ""}
    </div>
  );
}

export default Notification;

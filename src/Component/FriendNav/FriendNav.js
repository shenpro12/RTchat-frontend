import styles from "./FriendNav.module.css";
import Avartar from "../Avartar/Avartar";
import { SocketContext } from "../../index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState, useEffect } from "react";
function FriendNav({ callBack, userName, avatar, name }) {
  const [status, setStatus] = useState();
  const socket = useContext(SocketContext);
  useEffect(() => {
    socket.emit("checkFriendOnline", userName, (res) => {
      //console.log(res);
      setStatus(res);
    });
  });
  socket.on("resCheckFriendOnline", (res) => {
    if (res.status && res.userName == userName) {
      setStatus(true);
    }
    if (res.status == false && res.userName == userName) {
      setStatus(false);
    }
  });
  return (
    <div className={styles.container}>
      <FontAwesomeIcon
        icon={faAngleLeft}
        size="2x"
        className={styles.backBtn}
        onClick={callBack}
      />
      <div style={{ display: "flex" }}>
        <Avartar margin="auto 0px auto 20px" src={avatar} />
      </div>
      <div className={styles.userName}>
        <h3>{name ? name : userName}</h3>
        <br />
        {status ? (
          <p className={styles.online}>Online</p>
        ) : (
          <p className={styles.offline}>Offline</p>
        )}
      </div>
    </div>
  );
}

export default FriendNav;

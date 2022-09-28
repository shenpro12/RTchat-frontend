import styles from "./PhoneBookList.module.css";
import Avatar from "../Avartar/Avartar";
import request from "../../utils/request";
import FriendProfile from "../Profile/FriendProfile";
import Modal from "../Modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { chatContext } from "../SidebarNav/SidebarNav";
function FriendInfo({ data, message, onDelete, other, active, search }) {
  //console.log(message);
  //console.log("--------------------");
  const chatHandle = useContext(chatContext);
  const [modal, setModal] = useState(false);
  const [info, setInfo] = useState(false);
  const [friendData, setFriendData] = useState();
  let isOnline = false;
  const showFriendInfo = async () => {
    const res = await request.post("user/profile/friend", {
      data: {
        _id: data._id,
      },
    });
    //console.log(res);
    if (res.data.info) {
      setFriendData(res.data.info);
      setInfo(true);
    }
    if (res.data.isAuth == false) {
      window.location.reload();
    }
  };
  if (data.isOnline) {
    isOnline = true;
  }
  const onhandleOptions = () => {
    setInfo(!info);
  };

  return (
    <div
      className={`${styles.friendInfo_container} ${
        active ? styles.active : ""
      }`}
      onClick={async () => {
        chatHandle({ ...message, _id: await message._id });
      }}
    >
      {info && (
        <FriendProfile
          data={other ? data : friendData}
          onhandleOptions={onhandleOptions}
        />
      )}
      {modal && (
        <Modal
          type={other ? "" : "friend"}
          text={data.name ? data.name : data.userName}
          onClose={() => {
            setModal(!modal);
          }}
          onChoose={() => {
            onDelete(data.userName);
          }}
        />
      )}
      <div>
        <Avatar onlineDot={isOnline} src={data.image} />
      </div>
      <p title={data.name ? data.name : data.userName} className={styles.name}>
        {data.name ? data.name : data.userName}
      </p>
      <div className={styles.options_container}>
        <FontAwesomeIcon
          title="Xem thông tin"
          icon={faAddressCard}
          className={`${styles.options} ${styles.card}`}
          onClick={(e) => {
            e.stopPropagation();
            showFriendInfo();
          }}
        />
        {!search && (
          <FontAwesomeIcon
            title="Hủy kết bạn"
            icon={faTrash}
            className={`${styles.options} ${styles.delete}`}
            onClick={(e) => {
              e.stopPropagation();
              setModal(true);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default FriendInfo;

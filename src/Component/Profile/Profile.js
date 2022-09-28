import styles from "./Profile.module.css";
import Info from "../Profile/Info";
import ChangeInfo from "../Profile/ChangeInfo";
import request from "../../utils/request";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, memo } from "react";
function Profile({ onhandletab }) {
  const [info, setInfo] = useState(true);
  const [data, setData] = useState({
    birthday: "",
    gender: "",
    image: "",
    name: "",
    phone: "",
    userName: "",
  });
  //console.log(data);
  useEffect(() => {
    async function fetch() {
      const res = await request.post("user/profile");
      //console.log(res);
      if (res.data.isAuth == false) {
        window.location.reload();
      }
      if (res.data.profile) {
        setData(res.data.profile);
      }
    }
    fetch();
  }, [info]);
  const handleInfo = () => {
    setInfo(!info);
  };
  return (
    <div className={styles.container}>
      <div className={styles.profile_container}>
        <div className={styles.header_container}>
          {info ? (
            <p className={styles.header}>Thông tin tài khoản</p>
          ) : (
            <p className={styles.header}>Cập nhật thông tin</p>
          )}
          <FontAwesomeIcon
            icon={faClose}
            size="1x"
            className={styles.header}
            onClick={() => {
              onhandletab("close");
            }}
          />
        </div>
        {info ? (
          <Info data={data} handleInfo={handleInfo} />
        ) : (
          <ChangeInfo data={data} handleInfo={handleInfo} />
        )}
      </div>
    </div>
  );
}

export default memo(Profile);

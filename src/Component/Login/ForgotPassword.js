import styles from "./Login.module.css";
import request from "../../utils/request";
import Loading from "../Loading/Loading";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
function ForgotPassword({ UIhandle }) {
  const [userName, setUserName] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const forgotHandle = async () => {
    const pattern = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim;
    if (userName && pattern.test(userName)) {
      setLoading(true);
      const res = await request.post("account/resetpassword", {
        data: { userName },
      });
      setLoading(false);
      if (res.data.mess && !res.data.status) {
        setStatus(res.data.mess);
        return;
      }
      UIhandle({ mess: res.data.mess }, "login");
    } else {
      setStatus("Chưa nhập Email hoặc Email không hợp lệ!");
    }
  };
  return (
    <div>
      {loading && <Loading />}
      <h1>Lấy lại mật khẩu</h1>
      {status && <h3>{status}</h3>}
      <div>
        <div>
          <FontAwesomeIcon icon={faUser} className={styles.center} />
          <input
            autoFocus
            value={userName}
            onInput={(e) => {
              setUserName(e.target.value);
            }}
            placeholder="Email"
          />
        </div>
      </div>
      <button onClick={forgotHandle}>Lấy lại mật khẩu</button>
      <p
        onClick={() => {
          UIhandle({}, "login");
        }}
      >
        Đăng Nhập
      </p>
    </div>
  );
}

export default ForgotPassword;

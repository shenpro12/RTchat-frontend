import styles from "./Login.module.css";
import request from "../../utils/request";
import Loading from "../Loading/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
function SignForm({ UIhandle }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const signinHandle = async () => {
    const pattern = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim;
    if (userName && password && repeatPassword && pattern.test(userName)) {
      setLoading(true);
      const res = await request.post("account/signin", {
        data: { userName, password, repeatPassword },
      });
      setLoading(false);
      if (res.data.mess && !res.data.status) {
        setStatus(res.data.mess);
        setPassword("");
        setRepeatPassword("");
        return;
      }
      UIhandle({ mess: res.data.mess }, "login");
    } else if (
      userName &&
      !pattern.test(userName) &&
      password &&
      repeatPassword
    ) {
      setStatus("Email không hợp lệ");
    } else {
      setStatus("Hãy nhập đầy đủ thông tin!");
    }
  };

  return (
    <div>
      {loading && <Loading />}
      <h1>Đăng ký</h1>
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
      <div>
        <div>
          <FontAwesomeIcon icon={faLock} className={styles.center} />
          <input
            value={password}
            onInput={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            placeholder="Mật khẩu"
          />
        </div>
      </div>
      <div>
        <div>
          <FontAwesomeIcon icon={faLock} className={styles.center} />
          <input
            value={repeatPassword}
            onInput={(e) => {
              setRepeatPassword(e.target.value);
            }}
            type="password"
            placeholder="Nhập lại mật khẩu"
          />
        </div>
      </div>
      <button onClick={signinHandle}>Đăng ký</button>
      <p
        onClick={() => {
          UIhandle({}, "login");
        }}
      >
        Đăng nhập
      </p>
    </div>
  );
}

export default SignForm;

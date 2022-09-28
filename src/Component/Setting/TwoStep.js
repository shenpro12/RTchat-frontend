import styles from "./Setting.module.css";
import request from "../../utils/request";
import { Switch } from "@mui/material";
import { useState, useEffect, useRef } from "react";
function TwoStep({ options, onCancel, onUpdateSuccess }) {
  const [check, setCheck] = useState(options.twoStep);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const acceptBtn = useRef();
  //console.log(password);
  useEffect(() => {
    if (password && check != options.twoStep) {
      acceptBtn.current.classList.remove(styles.btn_disable);
    } else {
      acceptBtn.current.classList.add(styles.btn_disable);
    }
  });
  const update_options = async (data) => {
    if (password && check != options.twoStep) {
      setLoading(true);
      const res = await request.post("user/options/towstep/update", {
        data: {
          data,
          password,
        },
      });
      setLoading(false);
      if (res.data.mess) {
        setStatus(res.data.mess);
      }
      if (res.data.status) {
        onUpdateSuccess(check);
      }
      if (res.data.isAuth == false) {
        window.location.reload();
      }
    }
  };
  return (
    <>
      {loading && (
        <div className={styles.loading_container}>
          <p>Đang xử lý...</p>
        </div>
      )}
      <div className={styles.twoStep_container}>
        <div>
          <p>Yêu cầu mã xác thực khi đăng nhập</p>
          <Switch
            checked={check}
            onChange={(e) => {
              setCheck(e.target.checked);
            }}
          />
        </div>
        <p className={styles.twoStep_status}>{status}</p>
        <div className={styles.password_container}>
          <div>
            <input
              value={password}
              placeholder="Mật khẩu..."
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      <div className={styles.options_container}>
        <p
          style={{ fontWeight: 600 }}
          className={styles.cancel}
          onClick={() => {
            onCancel();
          }}
        >
          Hủy
        </p>
        <p
          ref={acceptBtn}
          style={{ fontWeight: 600 }}
          className={styles.accept}
          onClick={() => {
            update_options({ ...options, twoStep: check });
          }}
        >
          Xác nhận
        </p>
      </div>
    </>
  );
}

export default TwoStep;

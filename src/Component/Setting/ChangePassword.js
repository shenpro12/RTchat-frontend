import styles from "./Setting.module.css";
import request from "../../utils/request";
import { useState } from "react";
function ChangePassword({ onCancel }) {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const changedPassword = async () => {
    if (
      password &&
      newPassword &&
      repeatPassword &&
      newPassword == repeatPassword
    ) {
      setLoading(true);
      const res = await request.post("user/password/update", {
        data: {
          password,
          newPassword,
          repeatPassword,
        },
      });
      setLoading(false);
      if (res.data.isAuth == false) {
        window.location.reload();
      }
      if (res.data.message) {
        setStatus(res.data.message);
      }
      if (res.data.status) {
        onCancel();
      }
    } else if (
      password &&
      newPassword &&
      repeatPassword &&
      newPassword != repeatPassword
    ) {
      setStatus("Mật khẩu không trùng khớp!");
    } else {
      setStatus("Vui lòng nhập đầy đủ thông tin!");
    }
  };
  return (
    <>
      {loading && (
        <div className={styles.loading_container}>
          <p>Đang xử lý...</p>
        </div>
      )}
      <div className={styles.changePassword_container}>
        <div>
          {status && <p className={styles.status}>{status}</p>}
          <p>Mật khẩu hiện tại</p>
          <div>
            <input
              autoFocus
              value={password}
              placeholder="Mật khẩu hiện tại..."
              onInput={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <p>Mật khẩu mới</p>
          <div>
            <input
              value={newPassword}
              placeholder="Mật khẩu mới..."
              onInput={(e) => {
                setNewPassword(e.target.value);
              }}
            />
          </div>
          <p>Nhập lại mật khẩu mới</p>
          <div>
            <input
              value={repeatPassword}
              placeholder="Nhập lại mật khẩu mới..."
              onInput={(e) => {
                setRepeatPassword(e.target.value);
              }}
            />
          </div>
        </div>
        <div className={styles.options_container}>
          <p
            className={styles.cancel}
            onClick={() => {
              onCancel();
            }}
          >
            Hủy
          </p>
          <p
            className={styles.accept}
            onClick={() => {
              changedPassword();
            }}
          >
            Xác nhận
          </p>
        </div>
      </div>
    </>
  );
}

export default ChangePassword;

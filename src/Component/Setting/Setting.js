import styles from "./Setting.module.css";
import request from "../../utils/request";
import Modal from "../Modal/Modal";
import ChangePassword from "./ChangePassword";
import TwoStep from "./TwoStep";
import LoginHistories from "./LoginHistories";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faShieldAlt,
  faLock,
  faLeftLong,
  faCircleXmark,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Switch } from "@mui/material";
import { useState, useEffect } from "react";
function Setting({ onhandletab }) {
  const [modal, setModal] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [twoStep, setTwoStep] = useState(false);
  const [loginHistories, setLoginHistories] = useState(false);
  const [setting, setSetting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    info: false,
    message: false,
    search: false,
  });
  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await request.post("user/options");
      setLoading(false);
      if (res.data.options) {
        setOptions(res.data.options);
      }
      if (res.data.isAuth == false) {
        window.location.reload();
      }
    })();
  }, []);
  const update_options = async (data) => {
    setLoading(true);
    const res = await request.post("user/options/update", {
      data: {
        data,
      },
    });
    setLoading(false);
    if (res.data.isAuth == false) {
      window.location.reload();
    }
  };
  const logout = async () => {
    setLoading(true);
    const res = await request.post("user/logout");
    setLoading(false);
    if (res.data.isAuth == false) {
      window.location.reload();
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.setting_container}>
        {modal && (
          <Modal
            type="logout"
            text="Bạn có chắc muốn đăng xuất?"
            onClose={() => {
              setModal(!modal);
            }}
            onChoose={() => {
              logout();
            }}
          />
        )}
        {loading && (
          <div className={styles.loading_container}>
            <p>Đang xử lý...</p>
          </div>
        )}
        <div className={styles.header_container}>
          {setting && <p className={styles.header}>Cài đặt</p>}
          {(changePassword || loginHistories || twoStep) && (
            <div>
              <FontAwesomeIcon
                icon={faLeftLong}
                size="1x"
                className={styles.back}
                onClick={() => {
                  setChangePassword(false);
                  setLoginHistories(false);
                  setTwoStep(false);
                  setSetting(true);
                }}
              />
              {changePassword && (
                <p className={`${styles.header} ${styles.center}`}>
                  Đổi mật khẩu
                </p>
              )}
              {loginHistories && (
                <p className={`${styles.header} ${styles.center}`}>
                  Thiết bị đăng nhập
                </p>
              )}
              {twoStep && (
                <p className={`${styles.header} ${styles.center}`}>
                  Xác minh 2 bước
                </p>
              )}
            </div>
          )}
          <FontAwesomeIcon
            icon={faClose}
            size="1x"
            className={styles.header}
            onClick={() => {
              onhandletab("closeSetting");
            }}
          />
        </div>
        {setting && (
          <div className={styles.main}>
            <div className={styles.privacy}>
              <FontAwesomeIcon
                icon={faShieldAlt}
                size="1x"
                className={styles.shield}
              />
              <h1 style={{ color: "green" }}>Quyền riêng tư</h1>
            </div>

            <h3>Bạn bè</h3>
            <div>
              <p>Người lạ có thể tìm thấy tôi qua thanh tìm kiếm</p>
              <Switch
                checked={options.search}
                onChange={(e) => {
                  setOptions({ ...options, search: e.target.checked });
                  update_options({ ...options, search: e.target.checked });
                }}
              />
            </div>
            <h3>Tin nhắn</h3>
            <div>
              <p>Nhận tin nhắn từ người lạ</p>
              <Switch
                checked={options.message}
                onChange={(e) => {
                  setOptions({ ...options, message: e.target.checked });
                  update_options({ ...options, message: e.target.checked });
                }}
              />
            </div>
            <h3>Thông tin cá nhân</h3>
            <div>
              <p>Hiển thị thông tin cá nhân với người khác</p>
              <Switch
                checked={options.info}
                onChange={(e) => {
                  setOptions({ ...options, info: e.target.checked });
                  update_options({ ...options, info: e.target.checked });
                }}
              />
            </div>
            <div className={styles.security}>
              <FontAwesomeIcon
                icon={faLock}
                size="1x"
                className={styles.lock}
              />
              <h1 style={{ color: "red" }}>Bảo mật</h1>
            </div>
            <div
              className={styles.security_item}
              onClick={() => {
                setChangePassword(false);
                setSetting(false);
                setLoginHistories(false);
                setTwoStep(true);
              }}
            >
              Xác minh 2 bước
              {options.twoStep ? (
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  size="1x"
                  className={styles.shield}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  size="1x"
                  className={styles.lock}
                />
              )}
            </div>
            <div
              className={styles.security_item}
              onClick={() => {
                setChangePassword(true);
                setSetting(false);
                setLoginHistories(false);
                setTwoStep(false);
              }}
            >
              Đổi mật khẩu
            </div>
            <div
              className={styles.security_item}
              onClick={() => {
                setChangePassword(false);
                setSetting(false);
                setLoginHistories(true);
                setTwoStep(false);
              }}
            >
              Thiết bị đăng nhập
            </div>
            <p
              className={`${styles.security_item} ${styles.lougout_btn}`}
              onClick={() => {
                setModal(true);
              }}
            >
              Đăng xuất
            </p>
          </div>
        )}
        {changePassword && (
          <ChangePassword
            onCancel={() => {
              setChangePassword(false);
              setSetting(true);
              setLoginHistories(false);
              setTwoStep(false);
            }}
          />
        )}
        {loginHistories && <LoginHistories />}
        {twoStep && (
          <TwoStep
            options={options}
            onCancel={() => {
              setChangePassword(false);
              setSetting(true);
              setLoginHistories(false);
              setTwoStep(false);
            }}
            onUpdateSuccess={(check) => {
              setOptions({ ...options, twoStep: check });
              setChangePassword(false);
              setSetting(true);
              setLoginHistories(false);
              setTwoStep(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Setting;

import styles from "./Login.module.css";
import request from "../../utils/request";
import Loading from "../Loading/Loading";
import VerifyCode from "./VerifyCode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { deviceDetect } from "react-device-detect";
function LoginForm({ UIhandle, routeHandle, UIMess }) {
  const [userName, setUserName] = useState("teemoly1212@gmail.com");
  const [passWord, setPassWord] = useState("12345");
  const [status, setStatus] = useState("");
  const [messStatus, setMessStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyCode, setVerifyCode] = useState(false);
  const [verifyData, setVerifyData] = useState({});
  const [deviceData, setDeviceData] = useState({});
  useEffect(() => {
    if (UIMess) {
      setMessStatus(UIMess);
    }
  }, []);
  const loginHandle = async () => {
    if (userName && passWord) {
      setLoading(true);
      let device = deviceDetect();
      if (device.isMobile || device.isTablet) {
        device = {
          deviceName: device.model,
          version: device.osVersion,
          ua: device.ua,
          type: device.os,
          osVersion: device.osVersion,
        };
        setDeviceData(device);
      }
      if (device.isBrowser) {
        device = {
          deviceName: device.browserName,
          version: device.browserFullVersion,
          ua: device.userAgent,
          type: device.osName,
          osVersion: device.osVersion,
        };
        setDeviceData(device);
      }
      const res = await request.post("account/login", {
        data: {
          userName: userName,
          passWord: passWord,
          device,
        },
      });
      setLoading(false);
      if (res.data.mess) {
        setStatus(res.data.mess);
        setMessStatus(false);
      }
      if (res.data.verify) {
        setVerifyCode(true);
        setVerifyData(res.data.verify);
      }
      if (res.data.isAuth) {
        window.location.reload();
      }
    } else {
      setStatus("Vui lòng nhập đầy đủ thông tin!");
      setMessStatus(false);
    }
  };

  return (
    <div>
      {verifyCode ? (
        <VerifyCode
          userName={userName}
          device={deviceData}
          data={verifyData}
          onCancel={() => {
            setVerifyCode(false);
          }}
          onReSendCode={loginHandle}
        />
      ) : (
        <>
          {loading && <Loading />}

          <h1>Đăng nhập</h1>
          {status && <h3>{status}</h3>}
          {messStatus && <h3>{messStatus}</h3>}
          <div>
            <div>
              <FontAwesomeIcon icon={faUser} className={styles.center} />
              <input
                value={userName}
                autoFocus
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
                value={passWord}
                onInput={(e) => {
                  setPassWord(e.target.value);
                }}
                type="password"
                placeholder="Mật khẩu"
              />
            </div>
          </div>
          <button onClick={loginHandle}>Đăng nhập</button>
          <p
            onClick={() => {
              UIhandle({}, "forgot");
            }}
          >
            Quên mật khẩu?
          </p>
          <p
            onClick={() => {
              UIhandle({}, "signin");
            }}
          >
            Đăng ký
          </p>
        </>
      )}
    </div>
  );
}

export default LoginForm;

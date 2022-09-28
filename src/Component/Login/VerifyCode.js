import styles from "./Login.module.css";
import request from "../../utils/request";
import Loading from "../Loading/Loading";
import { useState, useEffect, useRef } from "react";
function VerifyCode({ data, userName, device, onCancel, onReSendCode }) {
  const [code, setCode] = useState();
  const [status, setStatus] = useState("");
  const [time, setTime] = useState(true);
  const [sec, setSec] = useState(60);
  const [loading, setLoading] = useState(false);
  const timer = useRef();
  let timing = 0;
  useEffect(() => {
    if (timer.current) {
      timing = setTimeout(() => {
        if (sec < 0) {
          setTime(false);
        }
        timer.current.innerHTML = `${sec}s`;
        setSec(sec - 1);
      }, 1000);
    }
  });
  const login = async () => {
    if (code) {
      setLoading(true);
      const res = await request.post("account/login/secure", {
        data: {
          code,
          userName,
          device,
        },
      });
      setLoading(false);
      //console.log(res);
      if (res.data.isAuth) {
        window.location.reload();
      }
      if (res.data.mess) {
        setStatus(res.data.mess);
      }
    } else {
      setStatus("Vui lòng nhập mã xác nhận!");
    }
  };
  return (
    <>
      {loading && <Loading />}
      <h1>Xác minh 2 bước</h1>
      <p className={styles.verifyHeader}>
        Chúng tôi sẽ gửi mã xác nhận đến địa chỉ Email {data.userName}
      </p>
      <p className={styles.status}>{status}</p>
      <div className={styles.verifyContainer}>
        <input
          autoFocus
          placeholder="Mã xác nhận..."
          onChange={(e) => {
            setCode(e.target.value);
          }}
        />
        {time ? (
          <p className={styles.timer} ref={timer}></p>
        ) : (
          <p
            className={styles.sendCodeBtn}
            onClick={() => {
              setTime(true);
              setSec(60);
              setStatus("");
              onReSendCode();
            }}
          >
            Gửi lại mã
          </p>
        )}
      </div>
      <h3
        className={styles.verifyBtn}
        onClick={() => {
          login();
        }}
      >
        Xác nhận
      </h3>
      <p
        onClick={() => {
          onCancel();
          clearTimeout(timing);
        }}
      >
        Quay lại
      </p>
    </>
  );
}

export default VerifyCode;

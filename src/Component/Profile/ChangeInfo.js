import styles from "./Profile.module.css";
import Avatar from "../Avartar/Avartar";
import request from "../../utils/request";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faCamera } from "@fortawesome/free-solid-svg-icons";
import DateTimePicker from "react-datetime-picker";
import { useState, useEffect, useRef } from "react";
import FormData from "form-data";
function ChangeInfo({ data, handleInfo }) {
  const [updateButton, setUpdateButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");
  const [avatar, setAvatar] = useState(data.image);

  const [isWomen, setIsWomen] = useState(data.gender == "Nam" ? false : true);
  const [phone, setPhone] = useState(data.phone);
  const [name, setName] = useState(data.name);
  const [value, onChange] = useState(
    new Date(data.birthday ? data.birthday : Date.now())
  );
  //console.log(value);
  useEffect(() => {
    const birth = new Date(data.birthday ? data.birthday : Date.now());
    const gender = data.gender == "Nam" ? false : true;
    const fileUrl = "";
    if (
      `${value.getMonth() + 1}/${value.getDate()}/${value.getFullYear()}` !=
        `${birth.getMonth() + 1}/${birth.getDate()}/${birth.getFullYear()}` ||
      name != data.name ||
      phone != data.phone ||
      file != fileUrl ||
      isWomen != gender
    ) {
      setUpdateButton(true);
    } else {
      setUpdateButton(false);
    }
  }, [value, name, phone, file, isWomen]);
  const input = useRef();
  const chooseFile = () => {
    input.current.click();
  };
  const update = async () => {
    if (updateButton) {
      setLoading(true);
      let imageUrl = "";
      if (file) {
        const imageData = new FormData();
        imageData.append("file", file);
        imageData.append("upload_preset", "o11bmvkv");
        imageData.append("cloud_name", "dhhkjmfze");
        await fetch("https://api.cloudinary.com/v1_1/dhhkjmfze/image/upload", {
          method: "post",
          body: imageData,
        })
          .then((res) => res.json())
          .then((res) => {
            //console.log(res);
            imageUrl = res.url;
          });
      }
      const userData = {
        name,
        phone,
        gender: isWomen ? "Nữ" : "Nam",
        birthday: `${
          value.getMonth() + 1
        }/${value.getDate()}/${value.getFullYear()}`,
      };

      const res = await request.post("user/profile/update", {
        data: {
          imageUrl,
          userData,
        },
      });
      //console.log(res);
      if (res.data.isAuth == false) {
        window.location.reload();
      }
      if (res.status) {
        handleInfo();
      }
    }
  };
  return (
    <div className={styles.profile}>
      {loading && (
        <div className={styles.loading_container}>
          <p>Đang xử lý...</p>
        </div>
      )}
      <div>
        <Avatar
          src={avatar}
          margin="20px auto 10px auto"
          width="80px"
          height="80px"
        >
          <FontAwesomeIcon
            title="Chọn ảnh từ thiết bị"
            icon={faCamera}
            className={styles.camera}
            onClick={chooseFile}
          />
          <input
            accept=".jpg, .png"
            type="file"
            ref={input}
            className={styles.camera_input}
            onChange={(e) => {
              setFile(e.target.files[0]);
              setAvatar(URL.createObjectURL(e.target.files[0]));
              //setUpdateButton(true);
            }}
          />
        </Avatar>

        {data.name ? (
          <p className={styles.name}>{data.name}</p>
        ) : (
          <p className={styles.name}>{data.userName}</p>
        )}
        <p className={styles.label_text}>Tên hiển thị</p>
        <div className={styles.name_input_container}>
          <input
            maxLength={52}
            placeholder="Họ tên..."
            value={name}
            className={styles.name_input}
            onInput={(e) => setName(e.target.value)}
          />
        </div>
        <p className={styles.note}>
          Sử dụng tên thật để bạn bè dễ nhận diện hơn
        </p>
        <p className={styles.text_header}>Thông tin cá nhân</p>
        <p className={styles.label_text}>Giới tính</p>
        <div className={styles.gender}>
          <div>
            <input
              className={styles.radio_button}
              type="radio"
              onChange={() => {
                setIsWomen(false);
                //setUpdateButton(true);
              }}
              checked={!isWomen}
            />
            <p>Nam</p>
          </div>
          <div>
            <input
              className={styles.radio_button}
              type="radio"
              onChange={() => {
                setIsWomen(true);
                //setUpdateButton(true);
              }}
              checked={isWomen}
            />
            <p>Nữ</p>
          </div>
        </div>
        <p className={styles.label_text}>Ngày sinh</p>
        <div className={styles.date_time_container}>
          <DateTimePicker
            onChange={onChange}
            value={value}
            className={styles.date_time}
            disableClock={true}
            format="MM/dd/y"
          />
        </div>
        <p className={styles.label_text}>Số điện thoại</p>
        <div className={styles.phone_input_container}>
          <FontAwesomeIcon icon={faGlobe} style={{ margin: "auto 5px" }} />
          <input
            maxLength={10}
            placeholder="Số điện thoại..."
            value={phone}
            className={styles.phone_input}
            onInput={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.button}>
        <p className={styles.cancel_update} onClick={() => handleInfo()}>
          Hủy
        </p>
        <p
          className={
            updateButton ? styles.update_active : styles.update_disable
          }
          onClick={() => {
            update();
          }}
        >
          Cập nhật
        </p>
      </div>
    </div>
  );
}

export default ChangeInfo;

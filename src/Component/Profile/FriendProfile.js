import styles from "./Profile.module.css";
import Avatar from "../Avartar/Avartar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
function FriendProfile({ data, onhandleOptions }) {
  return (
    <div
      className={styles.container}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className={styles.profile_container}>
        <div className={styles.header_container}>
          <p className={styles.header}>Thông tin tài khoản</p>

          <FontAwesomeIcon
            icon={faClose}
            size="1x"
            className={styles.header}
            onClick={(e) => {
              e.stopPropagation();
              onhandleOptions();
            }}
          />
        </div>
        <div className={styles.profile}>
          <div>
            <Avatar
              src={data.image}
              margin="20px auto 10px auto"
              width="80px"
              height="80px"
            />
            {data.name ? (
              <p className={styles.name}>{data.name}</p>
            ) : (
              <p className={styles.name}>{data.userName}</p>
            )}
            <p className={styles.text_header}>Thông tin cá nhân</p>
            <table>
              <tbody>
                <tr>
                  <td className={styles.info_text}>Điện thoại</td>
                  <td className={styles.user_info_text}>
                    {data.phone ? data.phone : "_"}
                  </td>
                </tr>
                <tr>
                  <td className={styles.info_text}>Giới tính</td>
                  <td className={styles.user_info_text}>
                    {data.gender ? data.gender : "_"}
                  </td>
                </tr>
                <tr>
                  <td className={styles.info_text}>Ngày sinh</td>
                  <td className={styles.user_info_text}>
                    {data.birthday ? data.birthday : "_"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FriendProfile;

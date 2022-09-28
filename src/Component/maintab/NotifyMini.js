import styles from "./MainTab.module.css";
import Avatar from "../Avartar/Avartar";
function NotifyMini({ data }) {
  return (
    <div className={styles.notify_container}>
      <h3>Thông báo mới</h3>
      <div>
        <div>
          <Avatar src={data.image} margin="0px 5px 0px 0px" />
        </div>
        {data.type == "add" && (
          <p>
            Bạn nhận được lời mời kết bạn từ <span>{data.userName}</span>
          </p>
        )}
        {data.type == "request" && (
          <p>
            <span>{data.userName}</span> đã chấp đồng ý lời mời kết bạn. Bây giờ
            các bạn là bạn bè
          </p>
        )}
      </div>
    </div>
  );
}

export default NotifyMini;

import styles from "./Avartar.module.css";
function Avartar({ margin, src, onlineDot, width, height, children }) {
  return (
    <div
      className={styles.container}
      style={{ margin: margin, width: width, height: height }}
    >
      {children}
      {onlineDot && <div className={styles.onlineDot}></div>}

      <img
        src={
          src
            ? src
            : "https://res.cloudinary.com/dhhkjmfze/image/upload/v1661132447/user_zldhyu.png"
        }
        alt="anh dai dien"
        onLoad={(e) => {
          URL.revokeObjectURL(e.target.src);
        }}
      />
    </div>
  );
}

export default Avartar;

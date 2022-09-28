import styles from "./ChatContent.module.css";
function ChatContent({ children }) {
  return <div className={styles.container}>{children}</div>;
}

export default ChatContent;

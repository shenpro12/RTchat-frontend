import styles from "./FindHistory.module.css";
import ResultItem from "./ResultItem";
function FindResult({ data, text, message }) {
  //console.log(data);
  return (
    <div className={styles.container}>
      {data.length ? (
        <div>
          <p>Kết quả</p>
        </div>
      ) : (
        <p className={styles.notFoundText}>Không tìm thấy</p>
      )}
      {data.length ? (
        data.map((item) => {
          let mess = {
            contact: [
              { userName: item.userName, _id: item._id, image: item.image },
            ],
            contents: [],
            newMessage: {
              userId: "",
              count: 0,
            },
          };
          message.map((i) => {
            if (i.contact[0]._id == item._id) {
              mess = i;
            }
          });
          return (
            <ResultItem key={item._id} data={item} text={text} message={mess} />
          );
        })
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default FindResult;

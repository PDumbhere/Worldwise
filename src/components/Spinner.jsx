import styles from "./Spinner.module.css";

function Spinner({ spinnerClass = "spinner" }) {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles[spinnerClass]}></div>
    </div>
  );
}

export default Spinner;

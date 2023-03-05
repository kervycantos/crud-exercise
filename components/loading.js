import loadingStyles from "../styles/loading.module.css";

function Loading() {
  return (
    <div className={loadingStyles.center}>
      <div className={loadingStyles.wave}></div>
      <div className={loadingStyles.wave}></div>
      <div className={loadingStyles.wave}></div>
      <div className={loadingStyles.wave}></div>
      <div className={loadingStyles.wave}></div>
      <div className={loadingStyles.wave}></div>
      <div className={loadingStyles.wave}></div>
      <div className={loadingStyles.wave}></div>
      <div className={loadingStyles.wave}></div>
      <div className={loadingStyles.wave}></div>
    </div>
  );
}
export default Loading;

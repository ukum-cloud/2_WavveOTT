import style from "./scss/EmptyList.module.scss";

const EmptyList = ({ title }: { title: string }) => {
  return (
    <div className={style.emptyWrap}>
      <div className={style.emptyIcon}>
        <img src="/images/icons/icon_empty.svg" alt="empty아이콘" />
      </div>
      <div className={style.title}>{title}</div>
    </div>
  );
};

export default EmptyList;

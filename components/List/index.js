import style from "./List.module.scss";

export default function List({ children }) {
  return (
    <section className={style.List}>
      <ul className="p-0">{children}</ul>
    </section>
  );
}

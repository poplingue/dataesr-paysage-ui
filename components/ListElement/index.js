import style from './ListElement.module.scss';

export default function ListElement({ children }) {
    return (
      <li className={style.Element}>
            {children}
        </li>
    );
}

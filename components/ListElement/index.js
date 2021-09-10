import style from './ListElement.module.scss';

export default function ListElement({ children, selectionView }) {
    return (
      <li className={style.Element}>
            {children}
        </li>
    );
}

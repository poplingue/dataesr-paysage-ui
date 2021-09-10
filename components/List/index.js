import style from './List.module.scss';

export default function List({ children, container }) {

    return (
        <section className={style.List}>
            <ul>
                {children}
            </ul>
        </section>
    );
}

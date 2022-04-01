export default function InitPage() {
    const onClickHandler = () => {
        console.log('Appel du script init');
        fetch('/api/init');
    };

    return (
        <div>
            <button onClick={onClickHandler}>
                Importer les données V1 dans mongo V2
            </button>
        </div>
    );
}

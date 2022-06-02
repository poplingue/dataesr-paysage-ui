import { Button, Tag } from '@dataesr/react-dsfr';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppContext } from '../../context/GlobalState';
import ObjectService from '../../services/Object.service';

const WeblinkForm = dynamic(() => import('../Form/weblinksForm'));
const WeblinkAddForm = dynamic(() => import('../Form/weblinksForm/Add.js'));

import styles from './Weblinks.module.scss';

export default function WeblinksComponent({ type, id }) {
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const {
        dispatchPage: dispatch,
        statePage: { weblinks },
    } = useContext(AppContext);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await ObjectService.get({
                    type,
                    id,
                    subObject: 'weblinks',
                });
                setLoading(false);
                console.log(response.data);
                dispatch({
                    type: 'UPDATE_WEBLINKS_OBJECT',
                    payload: response.data,
                });
            } catch (error) {
                console.log(error);
                setError(true);
                setLoading(false);
            }
        };

        getData();
    }, [dispatch, type, id]);

    const renderForm = (weblink) => (
        <WeblinkForm initialData={weblink} type={type} id={id} />
    );

    const renderAddForm = () => <WeblinkAddForm type={type} id={id} />;

    const onClickModifyHandler = (weblink) => {
        dispatch({
            type: 'UPDATE_MODAL_DETAIL',
            payload: {
                content: renderForm(weblink),
                title: "Modification d'un lien Web",
                size: 'lg',
            },
        });
    };

    const onClickAddHandler = () => {
        dispatch({
            type: 'UPDATE_MODAL_DETAIL',
            payload: {
                content: renderAddForm(),
                title: "Ajout d'un lien Web",
                size: 'lg',
            },
        });
    };

    if (isError) return <>Erreur !!!</>;
    if (isLoading) return <>Chargement...</>; //TODO Loader

    if (!weblinks || weblinks.length === 0) {
        return (
            <>
                Cette section est vide, ajoutez le premier lien &nbsp;
                <Button onClick={onClickAddHandler}>Ajouter un lien</Button>
            </>
        );
    }

    return (
        <>
            {weblinks.map((weblink) => (
                <Tag
                    key={uuidv4()}
                    onClick={() => onClickModifyHandler(weblink)}
                    className={styles.tags}
                >
                    {weblink.type}
                </Tag>
            ))}
        </>
    );
}

WeblinksComponent.propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

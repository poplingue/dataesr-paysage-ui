import { Button, Tag } from '@dataesr/react-dsfr';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppContext } from '../../context/GlobalState';
import ObjectService from '../../services/Object.service';

const SocialmediaForm = dynamic(() => import('../Form/socialmediaForm'));
const SocialmediaAddForm = dynamic(() => import('../Form/weblinksForm/Add.js'));

import styles from './Socialmedias.module.scss';

export default function SocialmediasComponent({ type, id }) {
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const {
        dispatchPage: dispatch,
        statePage: { socialmedias },
    } = useContext(AppContext);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await ObjectService.get({
                    type,
                    id,
                    subObject: 'socialmedias',
                });
                setLoading(false);
                console.log(response.data);
                dispatch({
                    type: 'UPDATE_SOCIALMEDIAS_OBJECT',
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

    const renderForm = (socialmedia) => (
        <SocialmediaForm initialData={socialmedia} type={type} id={id} />
    );

    const renderAddForm = () => <SocialmediaAddForm type={type} id={id} />;

    const onClickModifyHandler = (socialmedia) => {
        dispatch({
            type: 'UPDATE_MODAL_DETAIL',
            payload: {
                content: renderForm(socialmedia),
                title: "Modification d'un réseau social",
                size: 'lg',
            },
        });
    };

    const onClickAddHandler = () => {
        dispatch({
            type: 'UPDATE_MODAL_DETAIL',
            payload: {
                content: renderAddForm(),
                title: "Ajout d'un réseau social",
                size: 'lg',
            },
        });
    };

    if (isError) return <>Erreur !!!</>;
    if (isLoading) return <>Chargement...</>; //TODO Loader

    if (!socialmedias || socialmedias.length === 0) {
        return (
            <>
                Cette section est vide, ajoutez le premier lien &nbsp;
                <Button onClick={onClickAddHandler}>Ajouter un lien</Button>
            </>
        );
    }

    return (
        <>
            {socialmedias.map((socialmedia) => (
                <Tag
                    key={uuidv4()}
                    onClick={() => onClickModifyHandler(socialmedia)}
                    className={styles.tags}
                >
                    {socialmedia.type}
                </Tag>
            ))}
        </>
    );
}

SocialmediasComponent.propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

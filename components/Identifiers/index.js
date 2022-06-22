import { Col } from '@dataesr/react-dsfr';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/GlobalState';
import ObjectService from '../../services/Object.service';

const CardInfoIdentifier = dynamic(() => import('../CardInfoIdentifier'));
const IdentifierForm = dynamic(() => import('../Form/identifierForm'));
const ShowMoreList = dynamic(() => import('../ShowMoreList'));

export default function IdenfifiersComponent({ type, id }) {
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const {
        dispatchPage: dispatch,
        statePage: { identifiers },
    } = useContext(AppContext);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await ObjectService.get({
                    type,
                    id,
                    subObject: 'identifiers',
                });
                setLoading(false);

                dispatch({
                    type: 'UPDATE_IDENTIFIERS_OBJECT',
                    payload: response.data, // liste d'identifiers []
                });
            } catch (error) {
                console.log('error_jer', error);
                setError(true);
                setLoading(false);
            }
        };

        getData();
    }, [dispatch, type, id]);

    const renderForm = (identifier) => (
        <IdentifierForm initialData={identifier} type={type} id={id} />
    );

    const onClickModifyHandler = (identifier) => {
        dispatch({
            type: 'UPDATE_MODAL_DETAIL',
            payload: {
                content: renderForm(identifier),
                title: "Modification d'un identifiant",
                size: 'lg',
            },
        });
    };

    if (isError) return <>Erreur !!!</>;
    if (isLoading) return <>Chargement...</>; //TODO Loader
    if (!identifiers) return <>Pas de données</>; // TODO juste bt ADD

    return (
        <ShowMoreList display={identifiers.length}>
            {identifiers.map((identifier, i) => (
                <Col
                    key={identifier.id}
                    n={identifiers.length > 3 ? '4' : '6'}
                    spacing={i === identifiers.length - 1 ? 'pb-8w' : ''}
                >
                    <CardInfoIdentifier
                        onClick={() => onClickModifyHandler(identifier)}
                        supInfo={identifier.type}
                        title={identifier.value}
                    />
                </Col>
            ))}
        </ShowMoreList>
    );
}

IdenfifiersComponent.propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

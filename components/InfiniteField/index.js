import FieldButton from '../FieldButton';
import { Col, Container, Row } from '@dataesr/react-dsfr';
import { useState, useContext, cloneElement, Children, useEffect } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getFormName, getUniqueId } from '../../helpers/utils';
import { useRouter } from 'next/router';

function InfiniteField({ children, title, parentSection }) {
    const { state, dispatch } = useContext(AppContext);
    const [number, setNumber] = useState(null);
    const router = useRouter();
    const deleteField = (index) => {
        if (number > 2) {
            for (let i = 0; i <= number; i = i + 1) {
                if (i > index && i < number) {
                    dispatch({
                        type: 'UPDATE_FORM_FIELD', payload: {
                            formName: getFormName(router.pathname),
                            value: state.forms[getFormName(router.pathname)][getUniqueId(router.pathname, parentSection, title, i)],
                            uid: getUniqueId(router.pathname, parentSection, title, i - 1)
                        }
                    });
                }

                if (i === number) {
                    const payload = {
                        uid: getUniqueId(router.pathname, parentSection, title, i - 1),
                        formName: getFormName(router.pathname),
                    };
                    dispatch({ type: 'DELETE_FORM_FIELD', payload });
                }
            }
        } else {
            const payload = {
                uid: getUniqueId(router.pathname, parentSection, title, index),
                formName: getFormName(router.pathname),
            };
            dispatch({ type: 'DELETE_FORM_FIELD', payload });
        }

        setNumber(number - 1);
    };
    useEffect(() => {
        const initInfinite = Object.entries(state.forms[getFormName(router.pathname)]).filter(([k]) => k.startsWith(getUniqueId(router.pathname, parentSection, title)));
        setNumber(initInfinite.length || 1);
    }, [state.forms, router.pathname, title, parentSection]);
    return (<Col n="12">
            {Array.apply(null, { length: number }).map((v, i) => {
                    const newTitle = `${title}#${i}`;
                    return <Container fluid key={getUniqueId(router.pathname, '', title, i)}>
                        <Row alignItems="middle" gutters>
                            <Col n="8">
                                {Children.toArray(children).map(
                                    (child) => {
                                        return cloneElement(child, {
                                            title,
                                            label: newTitle,
                                            value: state.forms[getFormName(router.pathname)][getUniqueId(router.pathname, parentSection, title, i)],
                                            parentSection: parentSection,
                                            keyNumber: i
                                        });
                                    },
                                )}
                            </Col>
                            {i > 0 && <Col n="4">
                                <FieldButton title={`Remove ${newTitle}`} onClick={() => deleteField(i)}/>
                            </Col>}
                        </Row>
                    </Container>;
                }
            )}
            <Col className="py-10">
                <FieldButton onClick={() => setNumber(number + 1)} title={`Add 1 ${title}`}/>
            </Col>
        </Col>
    );

}

export default InfiniteField;

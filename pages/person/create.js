import { Icon } from '@dataesr/react-dsfr';
import CreatePerson from './create.json';
import Layout from '../../components/Layout';
import styles from '../../styles/Person.module.scss';
import CreateForm from '../../components/CreateForm';
import DBService from '../../services/DBService';
import { useEffect, useCallback, useState, useContext } from 'react';
import { AppContext } from '../../context/GlobalState';

export default function Create() {
    const [fieldIds, setFieldIds] = useState([]);
    const { state, dispatch } = useContext(AppContext);

    const getField = useCallback((field) => {
        const { value, uid, } = field;
        if (fieldIds.indexOf(uid) === -1) {
            setFieldIds((prev) => [...prev, field.uid]);
            dispatch({ type: 'UPDATE_FORM', payload: { value, uid, name: state.objectStoreName, dataAtt: field.uid } });
        }
    }, [fieldIds, dispatch, state.objectStoreName]);

    useEffect(() => {
        dispatch({ type: 'UPDATE_CURRENT_OBJECT_STORE', payload: { objectStoreName: 'person' } });
    }, [dispatch]);

    useEffect(() => {
        const getIndexDBData = async () => {
            if (state.objectStoreName) {
                await DBService.getAll(state.objectStoreName, getField, state.storeObjects.indexOf('person') > -1);
            }
        };
        getIndexDBData();
    }, [getField, state.objectStoreName, state.storeObjects]);

    return (
        <Layout>
            <div className={styles.test}>
                <Icon
                    name="ri-bubble-chart-line"
                    size="1x">
                    <h1>Create 1 Person</h1>
                </Icon>
                <CreateForm jsonForm={CreatePerson[0]}/>
            </div>
        </Layout>
    );
}

import { Icon } from '@dataesr/react-dsfr';
import CreatePerson from './create.json';
import Layout from '../../components/Layout';
import styles from '../../styles/Person.module.scss';
import CreateForm from '../../components/CreateForm';
import DBService from '../../services/DBService';
import { useEffect, useCallback, useState, useMemo } from 'react';
import { containsObject } from '../../helpers/utils';

export default function Create() {
    const [fields, setFields] = useState([]);
    const getField = useCallback((field) => {
        if (!containsObject(field, fields)) {
            setFields((prev) => [...prev, field]);
        }
    }, []);
    useEffect(() => {
        const getIndexDBData = async () => {
            await DBService.getAll('Person', getField);
        };
        getIndexDBData();
    }, [getField]);
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

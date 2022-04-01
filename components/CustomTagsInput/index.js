import { useEffect, useState } from 'react';
import TagsInput from 'react-tagsinput';

import styles from './CustomTagsInput.module.scss';
// https://www.npmjs.com/package/react-tagsinput#styling

export default function CustomTagsInput({ label, name, values }) {
    const [tags, setTags] = useState(values);

    useEffect(() => {
        if (values && values.length > 0) {
            setTags(values);
        }
    }, [values]);

    return (
        <div className={styles['react-tagsinput-tag']}>
            <label>{label}</label>
            <TagsInput
                className={styles['react-tagsinput']}
                name={name}
                value={tags}
                onChange={(tags) => {
                    setTags(tags);
                }}
                inputProps={{ placeholder: 'Ajouter un nom' }}
            />
        </div>
    );
}

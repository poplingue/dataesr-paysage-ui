import { Toggle } from '@dataesr/react-dsfr'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/GlobalState'
import {
    getFieldValue,
    getForm,
    getFormName,
    getUniqueId,
} from '../../helpers/utils'
import DBService from '../../services/DBService'

export default function CustomToggle({ keynumber, parentsection, title }) {
    const {
        stateForm: { forms, storeObjects },
        dispatchForm: dispatch,
    } = useContext(AppContext)
    const [checked, setCheched] = useState('none')
    const [init, setInit] = useState(true)
    const {
        pathname,
        query: { object },
    } = useRouter()
    const formName = getFormName(pathname, object)
    const uniqueId = getUniqueId(formName, parentsection, title, keynumber || 0)
    const toggleValue = getFieldValue(forms, formName, uniqueId)

    useEffect(() => {
        const checkStoreObject = storeObjects.indexOf(formName) > -1
        let defaultValue = 'false'

        if (init && getForm(forms, formName)) {
            if (toggleValue) {
                defaultValue = toggleValue
            }

            const payload = {
                value: defaultValue,
                uid: uniqueId,
                formName,
            }

            dispatch({ type: 'UPDATE_FORM_FIELD', payload })
            setInit(false)

            const updateIndexDB = async () => {
                await DBService.set(
                    {
                        value: defaultValue,
                        uid: uniqueId,
                    },
                    formName
                )
            }

            if (checkStoreObject) {
                updateIndexDB()
            }
        }
    }, [dispatch, formName, forms, init, storeObjects, toggleValue, uniqueId])

    useEffect(() => {
        if (!init) {
            if (toggleValue) {
                setCheched(toggleValue)
            }
        }
    }, [init, toggleValue])

    const onToggleChange = async e => {
        const checkStoreObject = storeObjects.indexOf(formName) > -1
        const payload = {
            value: e.target.checked ? 'true' : 'false',
            uid: uniqueId,
            formName,
        }

        dispatch({ type: 'UPDATE_FORM_FIELD', payload })
        setCheched(!checked)

        if (checkStoreObject) {
            await DBService.set(
                {
                    value: e.target.checked ? 'true' : 'false',
                    uid: uniqueId,
                },
                formName
            )
        }
    }

    return (
        <Toggle
            data-field={uniqueId}
            data-cy={uniqueId}
            onChange={e => onToggleChange(e)}
            checked={checked === 'true'}
            label={title}
        />
    )
}

import { Select } from "@dataesr/react-dsfr";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/GlobalState";
import { getUrl } from "../../helpers/constants";
import {
  getFieldValue,
  getForm,
  getFormName,
  getUniqueId
} from "../../helpers/utils";
import DBService from "../../services/DBService";
import NotifService from "../../services/NotifService";

export default function CustomSelect({
  title,
  staticValues = [],
  keynumber,
  parentsection,
  newValue,
  newValueCheck,
  updateCheck
}) {
  const {
    stateForm: { forms, storeObjects },
    dispatchForm: dispatch
  } = useContext(AppContext);
  const [options, setOptions] = useState([]);
  const [init, setInit] = useState(true);
  const [selectValue, setSelectValue] = useState("");
  const {
    pathname,
    query: { object }
  } = useRouter();
  const formName = getFormName(pathname, object);
  const uid = getUniqueId(formName, parentsection, title, keynumber || 0);

  const onSelectChange = useCallback(async value => {
    // TODO manage select empty?
    const checkStoreObject = storeObjects.indexOf(formName) > -1;
    const payload = {
      value,
      uid,
      formName
    };

    if (value) {
      dispatch({ type: "UPDATE_FORM_FIELD", payload });

      if (checkStoreObject) {
        await DBService.set(
          {
            value,
            uid
          },
          formName
        );
      }
    } else {
      dispatch({ type: "DELETE_FORM_FIELD", payload });
      // TODO Make it async
      await DBService.delete(uid, formName);
      NotifService.info("Select field deleted");
    }

    setSelectValue(value);
  }, [dispatch, formName, storeObjects, uid]);

  useEffect(() => {
    if (newValue && newValueCheck) {
      onSelectChange(newValue);
      updateCheck(false);
    }
  }, [onSelectChange, newValueCheck, newValue, updateCheck]);

  useEffect(() => {
    const fieldValue = getFieldValue(forms, formName, uid);
    const mustBeUpdated = selectValue !== fieldValue;

    if (
      formName &&
      getForm(forms, formName) &&
      (!selectValue || mustBeUpdated)
    ) {
      setSelectValue(fieldValue);
    }
  }, [formName, forms, selectValue, uid]);

  useEffect(() => {
    if (!staticValues.length && !options.length) {
      // case no static values
      fetch(getUrl(title))
        .then(res => res.json())
        .then(() => {
          // fake data
          const obj = ["f", "m", "n"].map(s => {
            return { value: s, label: s };
          });
          setOptions(obj);
        });
    } else if (!options.length) {
      setOptions(
        staticValues.map(value => {
          return { value: value, label: value };
        })
      );
      setOptions(prev => [...prev, { value: "", label: "Select an option" }]);
    }
  }, [options, setOptions, staticValues, title]);

  return (
    <section className="wrapper-select py-10">
      <Select
        data-field={uid}
        data-testid={uid}
        onChange={e => onSelectChange(e.target.value)}
        selected={selectValue}
        label={title}
        options={options}
      />
    </section>
  );
}

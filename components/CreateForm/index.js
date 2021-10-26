import {
  Accordion,
  AccordionItem,
  Col,
  Container,
  Row
} from "@dataesr/react-dsfr";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/GlobalState";
import { getFormName, sectionUniqueId } from "../../helpers/utils";
import DBService from "../../services/DBService";
import NotifService from "../../services/NotifService";
import FieldButton from "../FieldButton";
import InfiniteAccordion from "../InfiniteAccordion";
import Switch from "../Switch";
import styles from "./CreateForm.module.scss";

const CreateForm = ({ jsonForm, color }) => {
  const {
    stateForm: { storeObjects },
    dispatchForm: dispatch
  } = useContext(AppContext);
  const {
    pathname,
    query: { object }
  } = useRouter();
  const formName = getFormName(pathname, object);
  const [accordionsExpanded, setAccordionsExpanded] = useState(true);

  const simulateClick = elem => {
    const evt = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window
    });

    // If cancelled, don't dispatch our event
    const canceled = !elem.dispatchEvent(evt);

    setAccordionsExpanded(!accordionsExpanded);
  };

  const expandCloseAll = () => {
    const open = accordionsExpanded ? "true" : "false";
    const btnAccordions = document.querySelectorAll(
      `.fr-accordion__btn[aria-expanded="${open}"]`
    );

    for (let i = 0; i < btnAccordions.length; i = i + 1) {
      simulateClick(btnAccordions[i]);
    }
  };

  const retrieveField = useCallback(async field => {
    const { value, uid } = field;
    const checkStoreObject = storeObjects.indexOf(formName) > -1;

    dispatch({
      type: "UPDATE_FORM_FIELD",
      payload: { value, uid, formName }
    });

    if (checkStoreObject) {
      await DBService.set(
        {
          value,
          uid
        },
        formName
      );
    }
  }, [dispatch, formName, storeObjects]);

  useEffect(() => {
    const getIndexDBData = async () => {
      // TODO refacto
      if (storeObjects.indexOf(formName) > -1 && formName) {
        const indexDBData = await NotifService.promise(
          DBService.getAllObjects(
            formName,
            storeObjects.indexOf(formName) > -1
          ),
          "Data from IndexDB fetched"
        );
        indexDBData.forEach(elm => {
          retrieveField(elm);
        });
      }
    };

    getIndexDBData();
  }, [retrieveField, storeObjects, formName]);

  return (
    <Row>
      <Col offset="10" n="2" spacing="my-2w">
        <FieldButton
          dataTestid="btn-expand-close"
          title="Réduire / Étendre"
          onClick={expandCloseAll}
        />
      </Col>
      <Col n="12">
        {jsonForm.form.map((section, i) => {
          const { title: sectionTitle, content, infinite } = section;
          const dataSection = sectionUniqueId(sectionTitle, content.length);
          // TODO https://www.chakshunyu.com/blog/how-to-write-readable-react-content-states/?ck_subscriber_id=1366272460

          return infinite ? (
            <InfiniteAccordion
              accordionsExpanded={accordionsExpanded}
              dataAttSection={dataSection}
              title={sectionTitle}
              content={content}
              key={sectionTitle}
            />
          ) : (
            <Accordion
              color={color}
              size="lg"
              keepOpen
              className={styles.Accordion}
              key={dataSection}
              data-section={dataSection}
            >
              <AccordionItem
                initExpand={accordionsExpanded}
                className={styles.Item}
                title={sectionTitle}
              >
                {content.map(field => {
                  const { type, title, infinite, staticValues } = field;

                  return (
                    <div key={title}>
                      <Container fluid>
                        <Row alignItems="middle">
                          <Col>
                            <Switch
                              keynumber={i}
                              section={sectionTitle}
                              type={type}
                              title={title}
                              infinite={infinite}
                              staticValues={staticValues}
                            />
                          </Col>
                        </Row>
                      </Container>
                    </div>
                  );
                })}
              </AccordionItem>
            </Accordion>
          );
        })}
      </Col>
    </Row>
  );
};

export default CreateForm;

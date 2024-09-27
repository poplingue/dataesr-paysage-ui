import {
    Checkbox,
    Col,
    // Icon,
    Row,
    Text,
    TextInput,
} from '@dataesr/react-dsfr';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getApproximativeDate, validDate } from '../../../../helpers/dates';

import styles from './DateMultiFields.module.scss';

export default function DateMultiFields({
    startDate,
    endDate,
    onValueChangeHandler,
}) {
    const [CKStart, setCKStart] = useState(false);
    const [CKEnd, setCKEnd] = useState(false);

    const onChangeHandler = (key, event) => {
        if (validDate(event.target.value)) {
            onValueChangeHandler(key, event.target.value);
        }
    };

    const onCKStartChangeHandler = () => {
        setCKStart(!CKStart);
    };

    const onCKEndChangeHandler = () => {
        setCKEnd(!CKEnd);
    };

    return (
        <Row>
            <Col>
                <Row>
                    <Col>
                        <Row>
                            <Col>
                                <Text>Date de début</Text>
                            </Col>
                            <Col>
                                <Checkbox
                                    label="Approximative"
                                    value={CKStart}
                                    onChange={onCKStartChangeHandler}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <TextInput
                                    className={styles.TextInput}
                                    type="date"
                                    value={startDate}
                                    name={uuidv4()}
                                    onChange={(e) =>
                                        onChangeHandler('startDate', e)
                                    }
                                />
                                {/* <Icon name="ri-more-2-line" size="lg" /> */}
                            </Col>
                        </Row>
                        {CKStart ? (
                            <div>{getApproximativeDate(startDate)}</div>
                        ) : null}
                    </Col>

                    <Col>
                        <Row>
                            <Col>
                                <Text>Date de fin</Text>
                            </Col>
                            <Col>
                                <Checkbox
                                    label="Approximative"
                                    value={CKEnd}
                                    onChange={onCKEndChangeHandler}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <TextInput
                                    className={styles.TextInput}
                                    type="date"
                                    value={endDate}
                                    name={uuidv4()}
                                    onChange={(e) =>
                                        onChangeHandler('endDate', e)
                                    }
                                />
                            </Col>
                        </Row>
                        {CKEnd ? (
                            <div>{getApproximativeDate(endDate)}</div>
                        ) : null}
                    </Col>

                    {/* <Col>
            <TextInput
              label="Date de fin"
              className={styles.TextInput}
              type="date"
              // value={start}
              name={uuidv4()}
              onChange={(e) => onChangeHandler('startDateDD', e)}
            />  
          </Col> */}
                    {/* <Col>
              /
            </Col>
            <Col>
              <TextInput
                value={startMM}
                name={uuidv4()}
                onChange={(e) => onChangeHandler('startDateMM', e)}
              />
            </Col>
            <Col>
              /
            </Col>
            <Col>
              <TextInput
                value={startYYYY}
                name={uuidv4()}
                onChange={(e) => onChangeHandler('startDateYYYY', e)}
              />
            </Col> */}
                </Row>
            </Col>
            {/* <Col>
          <Text>
            Date de fin
          </Text>
          <Row>
            <Col>
              <TextInput
                value="JJ"
                name="endDateJ"
                onChange={(e) => onChangeHandler('endDD', e)}
              />
            </Col>
            <Col>
              /
            </Col>
            <Col>
              <TextInput
                value="MM"
                name="endDateM"
                onChange={(e) => onChangeHandler('endMM', e)}
              />
            </Col>
            <Col>
              /
            </Col>
            <Col>
              <TextInput
                value="AAAA"
                name="endDateA"
                onChange={(e) => onChangeHandler('endYYYY', e)}
              />
            </Col>
          </Row>
        </Col> */}
        </Row>
    );
}

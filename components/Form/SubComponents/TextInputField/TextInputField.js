import { Col, Row, Text, TextInput } from '@dataesr/react-dsfr';

export default function TextInputField({
    label,
    valueLabel,
    value,
    onValueChangeHandler,
}) {
    return (
        <Row>
            <Col>
                <Text size="lead">{label}</Text>
            </Col>
            <Col>
                <TextInput
                    value={value || ''}
                    name="formValue"
                    onChange={(e) => onValueChangeHandler(valueLabel, e)}
                />
            </Col>
        </Row>
    );
}

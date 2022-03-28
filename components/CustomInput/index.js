import PropTypes from 'prop-types';
import grid from '../../helpers/imports';
import { FieldDependency } from '../FieldDependencie';
import InfiniteField from '../InfiniteField';
import Input from './Input';

function CustomInput({
    title,
    value,
    suggest,
    onGroupChange,
    hint,
    infinite,
    section,
    updateValidSection,
    validatorId,
    subObject,
    customOnChange,
    onToggleChange,
}) {
    const { Col, Row, Container } = grid();

    const infiniteField = (
        <InfiniteField
            title={title}
            section={section}
            validatorId={validatorId}
            subObject={subObject}
        >
            <Input
                hint={hint}
                updateValidSection={updateValidSection}
                validatorId={validatorId}
                subObject={subObject}
                label={title}
                onGroupChange={onGroupChange}
                infinite
                suggest={suggest}
            />
        </InfiniteField>
    );

    const classicalField = (
        <Col>
            <Input
                customOnChange={customOnChange}
                hint={hint}
                suggest={suggest}
                onGroupChange={onGroupChange}
                value={value}
                updateValidSection={updateValidSection}
                validatorId={validatorId}
                label={title}
                index={0}
                subObject={subObject}
            />
        </Col>
    );

    const customInput = {
        true: () => infiniteField,
        false: () => classicalField,
    };

    return (
        <FieldDependency subObject={subObject} validatorId={validatorId}>
            <Container fluid>
                <section className="wrapper-input">
                    <Row alignItems="bottom" gutters>
                        {customInput[infinite]()}
                    </Row>
                </section>
            </Container>
        </FieldDependency>
    );
}

CustomInput.defaultProps = {
    infinite: false,
    value: '',
    hint: '',
    section: '',
};

CustomInput.propTypes = {
    title: PropTypes.string.isRequired,
    hint: PropTypes.string,
    value: PropTypes.string,
    infinite: PropTypes.bool,
    section: PropTypes.string,
    updateValidSection: PropTypes.func.isRequired,
    validatorId: PropTypes.string.isRequired,
    subObject: PropTypes.string.isRequired,
};

export default CustomInput;

import PropTypes from 'prop-types';
import grid from '../../helpers/imports';
import { FieldDependency } from '../FieldDependencie';
import InfiniteField from '../InfiniteField';
import Input from './Input';

function CustomInput({
    title,
    value,
    onGroupChange,
    infinite,
    section,
    updateValidSection,
    validatorId,
    subObject,
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
                updateValidSection={updateValidSection}
                validatorId={validatorId}
                subObject={subObject}
                label={title}
                onGroupChange={onGroupChange}
                infinite
            />
        </InfiniteField>
    );

    const classicalField = (
        <Col spacing="py-1w">
            <Input
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
};

CustomInput.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.string,
    infinite: PropTypes.bool,
    section: PropTypes.string.isRequired,
    updateValidSection: PropTypes.func.isRequired,
    validatorId: PropTypes.string.isRequired,
    subObject: PropTypes.string.isRequired,
};

export default CustomInput;

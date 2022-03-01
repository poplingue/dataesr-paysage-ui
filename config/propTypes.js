// TODO add isRequired to all
import PropTypes from 'prop-types';

export const StructurePageSkeletonPropType = PropTypes.shape({
    presentation: PropTypes.func.isRequired,
    governance: PropTypes.func.isRequired,
    keyNumbers: PropTypes.func,
    hr: PropTypes.func,
    budget: PropTypes.func,
    analyse: PropTypes.func,
    followUp: PropTypes.func,
    news: PropTypes.func,
    estate: PropTypes.func,
    students: PropTypes.func,
    thema: PropTypes.func,
    project: PropTypes.func,
});

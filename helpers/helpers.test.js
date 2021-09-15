import { getTitle } from './constants';
import { getUniqueId } from './utils';

describe('Helpers utils functions', () => {
    it('should render uniqueId string', () => {
        const x = getUniqueId('/person/create', 'Section', 'Name', 2);
        expect(x).toEqual('person/create@section/name#2');
    });

    it('should render uniqueId string without key', () => {
        const x = getUniqueId('/person/create', 'Section', 'Name');
        expect(x).toEqual('person/create@section/name');
    });

    it('should render uniqueId string without name', () => {
        const x = getUniqueId('/person/create', 'Section');
        expect(x).toEqual('person/create@section');
    });

    it('should render right Title', () => {
        const x = getTitle('university');
        expect(x).toEqual('Universités');
    });
});

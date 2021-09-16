import { getTitle } from './constants';
import { getUniqueId } from './utils';

describe('Helpers utils functions', () => {
    it('should render uniqueId string', () => {
        const x = getUniqueId('/create/person', 'Section', 'Name', 2);
        expect(x).toEqual('create/person@section/name#2');
    });

    it('should render uniqueId string without key', () => {
        const x = getUniqueId('/create/person', 'Section', 'Name');
        expect(x).toEqual('create/person@section/name');
    });

    it('should render uniqueId string without name', () => {
        const x = getUniqueId('/create/person', 'Section');
        expect(x).toEqual('create/person@section');
    });

    it('should render right Title', () => {
        const x = getTitle('university');
        expect(x).toEqual('Universités');
    });
});

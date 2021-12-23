import { getTitle } from './constants';
import { getUniqueId } from './utils';

describe('Helpers utils functions', () => {
    it('should render uniqueId string', () => {
        const x = getUniqueId('update/person', 'Section', 'Name', 2);
        expect(x).toEqual('update/person@section/name#2');
    });

    it('should render uniqueId string without key', () => {
        const x = getUniqueId('update/person', 'Section', 'Name');
        expect(x).toEqual('update/person@section/name');
    });

    it('should render uniqueId string without name', () => {
        const x = getUniqueId('update/person', 'Section');
        expect(x).toEqual('update/person@section');
    });

    it('should render right Title', () => {
        const x = getTitle(5);
        expect(x).toEqual('Universités');
    });
});

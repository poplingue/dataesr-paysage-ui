import { getUniqueId } from './utils';

describe('Helpers utils functions', () => {
    it('should render uniqueId string', () => {
        const x = getUniqueId('contrib/person', 'Section', 'name', 2);
        expect(x).toEqual('contrib/person@Section_name#2');
    });

    it('should render uniqueId string without key', () => {
        const x = getUniqueId('contrib/person', 'Section', 'name');
        expect(x).toEqual('contrib/person@Section_name');
    });

    it('should render uniqueId string without name', () => {
        const x = getUniqueId('contrib/person', 'Section');
        expect(x).toEqual('contrib/person@Section');
    });
});

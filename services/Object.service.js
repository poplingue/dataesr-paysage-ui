import { genericErrorMsg } from '../helpers/internalMessages';

export const objectService = {
    newId: async (message) => {
        const newObject = JSON.parse(message);

        if (newObject.status < 400 && newObject.status >= 200) {
            return newObject.data.object.id;
        } else {
            throw genericErrorMsg;
        }
    },
};

export default objectService;

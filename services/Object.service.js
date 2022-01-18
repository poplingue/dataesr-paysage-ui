import { genericErrorMsg } from '../helpers/internalMessages';

export const objectService = {
    newId: async (r) => {
        const message = JSON.parse(r);

        if (message.status < 400 && message.status >= 200) {
            return message.data.id;
        } else {
            throw genericErrorMsg;
        }
    },
};

export default objectService;

import toast from 'react-hot-toast';

const bgError = 'rgba(247, 191, 195, 0.6)';
const bgValid = 'rgba(197, 230, 216, 0.6)';
const bgNeutral = 'rgba(202, 202, 251, 0.6)';
const iconError = '🔴';
const iconValid = '🟢';
const iconNeutral = '🔵';

const NotifService = {
    async promise(promise, message) {
        return toast.promise(
            promise,
            {
                loading: 'Loading...',
                success: message,
                error: (err) => `Error: ${err.toString()}`,
            },
            {
                success: {
                    duration: 4000,
                    icon: '☀️',
                    style: {
                        fontSize: 14,
                        background: bgValid,
                    },
                },
                loading: {
                    style: {
                        fontSize: 14,
                        background: 'rgba(213, 219, 239, 0.6)',
                    },
                },
                error: {
                    icon: iconError,
                    duration: 5000,
                    style: {
                        fontSize: 14,
                        background: bgError,
                    },
                },
                icon: '👾',
                duration: 5000,
                position: 'bottom-right',
                ariaProps: {
                    role: 'status',
                    'aria-live': message,
                },
            }
        );
    },

    info(message, type = 'valid', duration = 4000) {
        let stringMessage = message;

        const typeObject = {
            error: { background: bgError, icon: iconError },
            valid: { background: bgValid, icon: iconValid },
            neutral: { background: bgNeutral, icon: iconNeutral },
        };

        if (!typeof message === 'string' || !message instanceof String) {
            stringMessage = JSON.stringify(message);
        }

        toast(stringMessage, {
            id: 'toast-info',
            position: 'top-right',
            icon: typeObject[type].icon,
            className: `cy-notif-${type}`,
            duration,
            style: {
                fontSize: 14,
                background: typeObject[type].background,
            },
        });
    },

    techInfo(message, type = 'neutral', duration = 4000) {
        let stringMessage = message;

        if (!typeof message === 'string' || !message instanceof String) {
            stringMessage = JSON.stringify(message);
        }

        const typeObject = {
            error: { background: bgError, icon: iconError },
            valid: { background: bgValid, icon: iconValid },
            neutral: { background: bgNeutral, icon: iconNeutral },
        };

        toast(message, {
            position: 'bottom-right',
            className: `cy-notif-${type}`,
            icon: typeObject[type].icon,
            duration,
            style: {
                fontSize: 14,
                background: typeObject[type].background,
            },
        });
    },
};

export default NotifService;

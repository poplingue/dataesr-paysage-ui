import toast from 'react-hot-toast';

const NotifService = {
    async promise(promise, message) {
        return toast.promise(promise, {
            loading: 'Loading...',
            success: message,
            error: (err) => `Error: ${err.toString()}`,
        }, {
            success: {
                duration: 4000,
                icon: '☀️',
                style: {
                    fontSize: 14,
                    background: 'rgba(197, 230, 216, 0.6)',
                },
            },
            loading: {
                style: {
                    fontSize: 14,
                    background: 'rgba(213, 219, 239, 0.6)',
                },
            },
            error: {
                icon: '🔴',
                duration: 5000,
                style: {
                    fontSize: 14,
                    background: 'rgba(247, 191, 195, 0.6)',
                },
            },
            icon: '👾',
            duration: 5000,
            position: 'bottom-right',
            ariaProps: {
                role: 'status',
                'aria-live': message,
            },
        });
    },
    info(message) {
        return toast(message, {
            position: 'top-right',
            icon: '👾',
            duration: 3000,
            style: {
                fontSize: 14,
                background: 'rgba(198, 255, 237, 0.6)',
            }, });
    }
};

export default NotifService;

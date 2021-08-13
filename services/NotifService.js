import toast from 'react-hot-toast';

const NotifService = {
    async fetching(promise, message) {
        return toast.promise(promise, {
            loading: 'Loading...',
            success: message,
            error: (err) => `Error: ${err.toString()}`,
        }, {
            success: {
                duration: 8000,
                icon: '☀️',
                style: {
                    background: 'rgba(197, 230, 216, 0.6)',
                },
            },
            loading: {
                style: {
                    background: 'rgba(213, 219, 239, 0.6)',
                },
            },
            error: {
                icon: '🔴',
                duration: 100000,
                style: {
                    background: 'rgba(247, 191, 195, 0.6)',
                },
            },
            icon: '👾',
            duration: 5000,
            position: 'top-right',
            ariaProps: {
                role: 'status',
                'aria-live': message,
            },
        });
    }
};

export default NotifService;

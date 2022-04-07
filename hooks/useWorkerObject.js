import { useEffect, useRef, useState } from 'react';

const useWorkerObject = () => {
    const workerRef = useRef();
    const [objectData, setObjectData] = useState(null);

    useEffect(() => {
        workerRef.current = new Worker('/service-worker.js', {
            name: 'Get_object',
            type: 'module',
        });
    }, []);

    const fetchObject = (type, id) => {
        workerRef.current.postMessage({
            object: type,
            id,
        });
    };

    useEffect(() => {
        workerRef.current.onmessage = async ({ data }) => {
            if (data && JSON.parse(data).data) {
                if (!objectData) {
                    setObjectData(JSON.parse(data).data);
                }
            }
        };
    }, [objectData]);

    return { fetchObject, objectData, workerRef };
};

export default useWorkerObject;

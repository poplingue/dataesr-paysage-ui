import { useRouter } from 'next/router';

export default function PersonNews() {
    const {
        query: { id },
    } = useRouter();

    return <div>PersonNews {id}</div>;
}

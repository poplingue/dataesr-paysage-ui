import { useRouter } from 'next/router';

function UpdatePageWithParams() {
    const router = useRouter();
    console.log(router.query);

    return (
        <ul>
            {router.query.params.map((param) => (
                <li key={param}>{param}</li>
            ))}
        </ul>
    );
}

export default UpdatePageWithParams;

import { useRouter } from 'next/router';
import Identifiers from '../../Identifiers';

export default function IdentifiersWrapper({}) {
    const {
        query: { id, type },
    } = useRouter();

    return <Identifiers id={id} type={type} />;
}

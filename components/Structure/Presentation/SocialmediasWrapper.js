import { useRouter } from 'next/router';
import Socialmedias from '../../Socialmedias';

export default function SocialmediasWrapper({}) {
    const {
        query: { id, type },
    } = useRouter();

    return <Socialmedias id={id} type={type} />;
}

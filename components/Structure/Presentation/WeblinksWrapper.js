import { useRouter } from 'next/router';
import Weblinks from '../../Weblinks';

export default function WeblinksWrapper({}) {
    const {
        query: { id, type },
    } = useRouter();

    return <Weblinks id={id} type={type} />;
}

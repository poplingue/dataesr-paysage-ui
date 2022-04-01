import axios from 'axios';
import {
    deleteCollections,
    getAllIds,
    getStructureV1,
    initStructureV2,
    // initCategoryV2,
} from './functions';

// if (id === '7Y9B0') { // Université du mont Kenya
// if (id === '8k883') { // Université Sorbonne Nouvelle - Paris 3
// if (id === 'AzRIk' || id === '8k883') {
// pap5O = Institut Métallurgique et Minier ==> inactif
// AzRIk = CUST - Centre universitaire des sciences et techniques ==> Inactif
// if (index < 1000) { // 1000 premiers

// MQep9 => université économique d'Athènes => denomination en langue etrangere
// WadM1 => Y school => avec brandName
// XDl91 => U antilles guyane => code UAI avec endDate car le successeur a garder le meme code
// eHi5c => Plusieurs adresses

async function signIn(account, password) {
    const response = await axios.post(
        'https://api.paysage.staging.dataesr.ovh/auth/signin',
        { account, password }
    );

    return response.data;
}

async function InitHandler(req, res) {
    // const signInAccount = 'jeremy.peglion@gmail.com';
    // const signInPassword = 'cerise03!';

    const signInAccount = 'jeremy.peglion@enseignementsup.gouv.fr';
    const signInPassword = 'init2022!';

    try {
        // sign in
        const { refreshToken } = await signIn(signInAccount, signInPassword);
        // Suppression des collections Mongo
        await deleteCollections();

        // Parcours de tous les ids pour récupérer chaque structure
        const objIdsTypes = await getAllIds();

        // const categoryIds = objIdsTypes.filter((item) => item.type === 'Categorie').map((item) => item.id);
        // categoryIds.forEach((id, index) => {
        //   setTimeout(async () => {
        //     // Récupération de la structure V1
        //     const structureV1 = await getStructureV1(id);

        //     // Ajout d'une nouvelle categiorie dans paysage V2
        //     await initCategoryV2(structureV1, refreshToken);
        //   }, index * 1000);
        // });

        const structureIds = objIdsTypes
            .filter((item) => item.type === 'Structure')
            .map((item) => item.id);
        structureIds.forEach((id, index) => {
            setTimeout(async () => {
                // Récupération de la structure V1
                const structureV1 = await getStructureV1(id);

                // Ajout d'une nouvelle structure dans paysage V2
                await initStructureV2(structureV1, refreshToken);
            }, index * 1000);
        });
    } catch (error) {
        console.log(error);
    }
}

InitHandler();

/* eslint-disable no-console */
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { MongoClient } from 'mongodb';
import Matchers from './matchers';

const client = new MongoClient(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
console.log(`=> Try to connect to mongo... ${process.env.MONGO_URI}`);

client.connect().catch((e) => {
    console.log('error', e);
    process.kill(process.pid, 'SIGTERM');
});

const db = client.db(process.env.MONGO_DBNAME);

async function getAllIds(type) {
    // => Récupération de l'objet globalpaysage V1
    console.log("Récupération de l'objet global ...");

    // // Récupération via fichier json
    // const allObjects = await axios.get('https://paysage.mesri.fr/json/Objets.json');

    const filePath = path.join(process.cwd(), 'data', 'Objets.json');
    // const filePath = path.join(process.cwd(), 'data', 'data.json');
    // const filePath = path.join(process.cwd(), 'data', 'categories.json');
    const allObjects = await fs.readFile(filePath);

    // Filtre sur les structures et les categories
    return (
        Object.values(JSON.parse(allObjects))
            // .filter((obj) => (obj?.attribute_5 === 'Structure' || obj?.attribute_5 === 'Categorie'))
            .filter((obj) => obj?.attribute_5 === 'Structure')
            .map((obj) => {
                return {
                    id: obj.token,
                    type: obj.attribute_5,
                };
            })
    );
}

async function getStructureV1(id) {
    const url = `https://paysage.mesri.fr/json/Objets/${id}.json`;
    console.log('Récupération de la structure =>', url);
    const structure = await axios.get(url).catch(() => {
        console.log('=> !!!!! Erreur avec la structure ', id);
    });

    // Création d'un json en local
    await fs.appendFile(
        `data/objects/${id}.json`,
        JSON.stringify(structure.data)
    );

    return structure.data;
}

async function readStructureV1(id) {
    console.log('readStructureV1()', id);
    const filePath = path.join(process.cwd(), 'data/objects', `${id}.json`);
    const obj = await fs.readFile(filePath);

    return JSON.parse(obj);
}

async function deleteCollections() {
    await db.collection('_catalog').deleteMany({});
    await db.collection('structures').deleteMany({});
    await db.collection('categories').deleteMany({});

    console.log('Mongo => _catalogue, structures, categories deleted');
}

async function getNewAccessToken(currentRefreshToken) {
    const url = `${process.env.API_AUTH_URL}/auth/refresh-access-token`;
    const body = { refreshToken: currentRefreshToken };
    const response = await axios.post(url, body);

    return response.data.accessToken;
}

async function createStructureWithId(accessToken, structureId) {
    console.log('createStructureWithId(', structureId, ')');
    const url = `${process.env.API_URL}/structures/${structureId}`;
    const headers = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };

    try {
        const response = await axios.put(url, {}, headers);
    } catch (error) {
        console.log('error - createStructureWithId', error);
    }
}

async function createStructureWithIdNew(accessToken, structureId, usualName) {
    console.log('createStructureWithIdNew(', structureId, ')');
    const url = `${process.env.API_URL}/structures/${structureId}`;
    const headers = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };

    try {
        const response = await axios.put(url, { usualName }, headers);
    } catch (error) {
        console.log('error - createStructureWithIdNew =>', error);
    }
}

async function createCategoryWithId(accessToken, categoryId, body) {
    console.log('createCategoryWithId()');
    const url = `${process.env.API_URL}/categories/${categoryId}`;
    const headers = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    };

    try {
        const response = await axios.put(url, body, headers);
    } catch (error) {
        console.log('error', error.response.data);
        const obj = {
            url,
            body,
            error: error.response.data,
        };
        console.log(obj);
        // await fs.writeFileSync('data/error_createCategoryWithId.json', JSON.stringify(obj));
        await fs.appendFile(
            'data/error_createCategoryWithId.json',
            `${JSON.stringify(obj)}\n`
        );
    }
}

async function addElement(accessToken, route, structureId, data) {
    const url = `${process.env.API_URL}/${route}/${structureId}\n`;
    const headers = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };

    try {
        await axios.patch(url, data, headers);
    } catch (error) {
        console.log('addElement', route, structureId, data);
        console.log(error);
        await fs.appendFile('data/error_addElement.json', url);
    }
}

async function addSubElement(
    accessToken,
    route,
    structureId,
    elementName,
    data
) {
    const url = `${process.env.API_URL}/${route}/${structureId}/${elementName}\n`;
    const headers = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };

    try {
        await axios.post(url, data, headers);
    } catch (error) {
        console.warn('addSubElement', route, structureId, elementName, data);
        await fs.appendFile('data/error_addSubElement.json', url);
    }
}

async function initStructureV2(structureV1, currentRefreshToken) {
    // Récupération du nouvel accessToken pour ne pas risquer l'expiration
    const accessToken = await getNewAccessToken(currentRefreshToken);

    await createStructureWithIdNew(
        accessToken,
        structureV1.id,
        structureV1.Variables.Libelle
    );

    // Création de la structure
    // await createStructureWithId(accessToken, structureV1.id);

    // Ajout infos de base
    if (structureV1.Variables && structureV1.EtatCivil) {
        const baseInfo = Matchers.getBaseInfo(
            structureV1.Variables,
            structureV1.EtatCivil
        );
        addElement(accessToken, 'structures', structureV1.id, baseInfo);
    }

    // Ajout NAMES
    if (structureV1.Denominations) {
        const names = Matchers.getNaming(structureV1.Denominations);
        names.forEach((name) => {
            addSubElement(
                accessToken,
                'structures',
                structureV1.id,
                'names',
                name
            );
        });
    }
    // Ajout IDENTIFIERS

    if (structureV1.Identifiant) {
        const ids = Matchers.getIds(structureV1.Identifiant);
        ids.forEach((id) => {
            addSubElement(
                accessToken,
                'structures',
                structureV1.id,
                'identifiers',
                id
            );
        });
    }

    // Ajout LOCALISATIONS
    if (structureV1.Localisation) {
        const localisations = Matchers.getLocalisations(
            structureV1.Localisation
        );
        localisations.forEach((localisation) => {
            addSubElement(
                accessToken,
                'structures',
                structureV1.id,
                'localisations',
                localisation
            );
        });
    }

    // Ajout des réseaux sociaux
    if (structureV1.Internet && structureV1.Internet.ComptesSociaux) {
        const socials = Matchers.getSocials(
            structureV1.Internet.ComptesSociaux
        );
        socials.forEach((social) => {
            addSubElement(
                accessToken,
                'structures',
                structureV1.id,
                'socialmedias',
                social
            );
        });
    }

    // Ajout des liens web
    if (structureV1.Internet && structureV1.Internet.SitesExternes) {
        const weblinks = Matchers.getWeblinks(
            structureV1.Internet.SitesExternes
        );
        weblinks.forEach((weblink) => {
            addSubElement(
                accessToken,
                'structures',
                structureV1.id,
                'weblinks',
                weblink
            );
        });
    }
}

async function initCategoryV2(structureV1, currentRefreshToken) {
    // Récupération du nouvel accessToken pour ne pas risquer l'expiration
    const accessToken = await getNewAccessToken(currentRefreshToken);

    const body = Matchers.getCategory(structureV1);

    // Création de la catégorie
    await createCategoryWithId(accessToken, structureV1.id, body);

    // Ajout IDENTIFIERS
    if (structureV1.Identifiant) {
        const ids = Matchers.getIds(structureV1.Identifiant);
        ids.forEach((id) => {
            addSubElement(
                accessToken,
                'categories',
                structureV1.id,
                'identifiers',
                id
            );
        });
    }
}

export {
    getAllIds,
    getStructureV1,
    readStructureV1,
    initStructureV2,
    initCategoryV2,
    deleteCollections,
};

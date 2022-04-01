export function getDate(date, option = 'N') {
    let aDate = new Date();

    if (typeof date !== 'undefined') {
        aDate = new Date(date);
    } else {
        return null;
    }

    const y = aDate.getFullYear();
    const m = aDate.getMonth() + 1;
    const d = aDate.getDate();

    if (option === 'Y') {
        // Si Y, alors date approximative
        if (m === 1) {
            return `${y}`;
        } else {
            return `${y}-${m < 10 ? '0' + m : m}`;
        }
    }

    return `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;
}

function addKeyIfExist(obj, fieldName, fieldValue) {
    if (fieldValue) {
        Object.assign(obj, { [fieldName]: fieldValue });
    }
}

function transformPhoneNumber(phoneNumber) {
    if (!phoneNumber) return null;

    if (phoneNumber.length === 10 && phoneNumber[0] === '0') {
        return '+33' + phoneNumber.slice(1);
    }

    return null;
}

function getStatus(statusV1) {
    switch (statusV1) {
        case 'Inactif':
            return 'inactive';
            break;
        case 'Actif':
            return 'active';
            break;
        default:
            return null;
            break;
    }
}

const Matchers = {
    getBaseInfo(variables, etatCivil) {
        const baseInfo = { creationReason: 'test' };
        addKeyIfExist(baseInfo, 'structureStatus', getStatus(variables.Etat));
        addKeyIfExist(
            baseInfo,
            'creationDate',
            getDate(etatCivil['392782X88X1324'], etatCivil['392782X88X1356'])
        );
        addKeyIfExist(
            baseInfo,
            'closureDate',
            getDate(etatCivil['392782X88X1325'], etatCivil['392782X88X1357'])
        );
        addKeyIfExist(baseInfo, 'creationReason', etatCivil['TypeOrigine']);

        return baseInfo;
    },

    getNaming(denominations) {
        const names = [];
        denominations.forEach((denomination) => {
            const name = {};
            addKeyIfExist(name, 'officialName', denomination['494486X85X1265']);
            addKeyIfExist(name, 'usualName', denomination['494486X85X1261']);
            addKeyIfExist(name, 'shortName', denomination['494486X85X1263']);
            addKeyIfExist(name, 'brandName', denomination['494486X85X1266']);
            addKeyIfExist(name, 'nameEn', denomination['494486X85X1267']);
            addKeyIfExist(name, 'acronymFr', denomination['494486X85X1264']);
            addKeyIfExist(name, 'acronymLocal', denomination['494486X85X2681']); // TODO Add to modele
            addKeyIfExist(name, 'acronymEn', denomination['494486X85X1268']);
            addKeyIfExist(name, 'otherName', denomination['494486X85X1270']);
            addKeyIfExist(
                name,
                'startDate',
                getDate(
                    denomination['494486X85X1328'],
                    denomination['494486X85X1358']
                )
            );
            addKeyIfExist(
                name,
                'endDate',
                getDate(
                    denomination['494486X85X1329'],
                    denomination['494486X85X1359']
                )
            );
            addKeyIfExist(name, 'comment', denomination['494486X85X1257']);
            addKeyIfExist(name, 'article', denomination.article);
            names.push(name);
        });

        return names;
    },

    getIds(ids) {
        return Object.keys(ids).map((ident) => ({
            value: ids[ident][0].Id,
            type: ident,
            active: ids[ident][0].etat === 'A',
        }));
    },

    getLocalisations(localisationsV1) {
        const localisations = [];
        localisationsV1.forEach((localisationV1) => {
            const localisation = {};
            addKeyIfExist(
                localisation,
                'distributionStatement',
                localisationV1['353588X52X595MD']
            );
            addKeyIfExist(
                localisation,
                'country',
                localisationV1['353588X52X595PAYS']
            );
            addKeyIfExist(
                localisation,
                'cityId',
                localisationV1['353588X52X644']
            );
            addKeyIfExist(
                localisation,
                'address',
                localisationV1['353588X52X595ADD']
            );
            addKeyIfExist(
                localisation,
                'postOfficeBoxNumber',
                localisationV1['353588X52X595BP']
            );
            addKeyIfExist(
                localisation,
                'postalCode',
                localisationV1['353588X52X595CP']
            );
            addKeyIfExist(
                localisation,
                'locality',
                localisationV1['353588X52X595LOC']
            ); // ex La Défense
            addKeyIfExist(
                localisation,
                'place',
                localisationV1['353588X52X595LD']
            ); // ex Lieu-dit
            addKeyIfExist(
                localisation,
                'startDate',
                getDate(
                    localisationV1['353588X52X1373'],
                    localisationV1['353588X52X1375']
                )
            );
            addKeyIfExist(
                localisation,
                'endDate',
                getDate(
                    localisationV1['353588X52X1374'],
                    localisationV1['353588X52X1376']
                )
            );
            addKeyIfExist(
                localisation,
                'telephone',
                transformPhoneNumber(localisationV1.Telephone)
            );

            if (
                localisationV1['353588X52X593'] &&
                localisationV1['353588X52X593'].split(',').length === 2
            ) {
                const gps = {
                    lat: parseFloat(
                        localisationV1['353588X52X593'].split(',')[1]
                    ),
                    lng: parseFloat(
                        localisationV1['353588X52X593'].split(',')[0]
                    ),
                };
                addKeyIfExist(localisation, 'coordinates', gps);
            }

            localisations.push(localisation);
        });

        return localisations;
    },

    getLegalPersonalities() {
        return [];
    },

    getCategory(categorieV1) {
        const category = {};
        addKeyIfExist(
            category,
            'usualNameFr',
            categorieV1.Denominations[0]['978384X101X2123']
        );
        addKeyIfExist(
            category,
            'shortNameFr',
            categorieV1.Denominations[0]['978384X101X2124']
        );
        addKeyIfExist(
            category,
            'acronymFr',
            categorieV1.Denominations[0]['978384X101X2187']
        );
        addKeyIfExist(
            category,
            'pluralNameFr',
            categorieV1.Denominations[0]['978384X101X2134']
        );
        addKeyIfExist(
            category,
            'descriptionFr',
            categorieV1.Denominations[0]['978384X101X2141']
        );

        addKeyIfExist(
            category,
            'usualNameEn',
            categorieV1.Denominations[0]['978384X101X2144']
        );
        addKeyIfExist(
            category,
            'shortNameEn',
            categorieV1.Denominations[0]['978384X101X2145']
        );
        addKeyIfExist(
            category,
            'descriptionEn',
            categorieV1.Denominations[0]['978384X101X2146']
        );

        if (
            categorieV1.Denominations[0]['978384X101X2126'] ||
            categorieV1.Denominations[0]['978384X101X2147']
        ) {
            category.otherNamesFr = [];
        }

        if (categorieV1.Denominations[0]['978384X101X2126']) {
            category.otherNamesFr =
                categorieV1.Denominations[0]['978384X101X2126'].split(';');
        }

        if (categorieV1.Denominations[0]['978384X101X2147']) {
            category.otherNamesFr = category.otherNamesFr.concat(
                categorieV1.Denominations[0]['978384X101X2147'].split(';')
            );
        }

        //   "otherNamesEn": ["string"], => n'existe pas en V1
        return category;
        // {

        //   "officialDocumentId": ["string"], // TODO => array
        //   "linkedIds": ["string"], // TODO + date + document + infos
        //   "socialMedia"
        //   "weblinks"
        //   "identifiers"

        //   "femNameFr": "string", // A supp
        //   "longNameFr": "string", // ? pas d'interet pour Yann
        //   ]
        // }
    },

    // TODO : reparler des liaisons/fonctions avec Yann
    // TODO : legalCategory = pk sortir l'objet et ne pas utiliser category

    getWebsitePages(variables) {
        if (!variables) return {};

        return {
            id: 1, // TODO
            organisationPageUrl: variables.SitePrincipal,
            createdBy: 'init',
            createdAt: getDate(),
        };
    },

    getSocialMedia(socials) {
        if (!socials) return [];
        const socialMediaList = [];

        if (socials?.Wikipedia) {
            Object.keys(socials.Wikipedia).forEach((langKey) => {
                socialMediaList.push({
                    id: 'Wikipedia',
                    type: socials.Wikipedia[langKey].Langue,
                    lang: langKey,
                    account: socials.Wikipedia[langKey].wikipedia,
                    createdBy: 'init',
                    createdAt: getDate(),
                });
            });
        }

        if (socials?.SitesExternes?.Hal) {
            socialMediaList.push({
                id: 'Hal',
                type: 'Hal',
                account: socials.SitesExternes.Hal,
                createdBy: 'init',
                createdAt: getDate(),
            });
        }

        if (socials?.SitesExternes?.ServicePublic) {
            socialMediaList.push({
                id: 'ServicePublic',
                type: 'ServicePublic',
                account: socials.SitesExternes.ServicePublic,
                createdBy: 'init',
                createdAt: getDate(),
            });
        }

        const addSocial = (s) => {
            if (socials?.ComptesSociaux?.Twitter) {
                socialMediaList.push({
                    id: s,
                    type: s,
                    account: socials.ComptesSociaux[s],
                    createdBy: 'init',
                    createdAt: getDate(),
                });
            }
        };

        const socialsList = [
            'Twitter',
            'Facebook',
            'Linkedin',
            'franceculture',
        ];
        socialsList.forEach((s) => {
            addSocial(s);
        });

        return socialMediaList;
    },
};

export default Matchers;

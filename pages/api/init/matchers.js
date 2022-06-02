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

function getTypeIdWithCase(identType) {
    switch (identType.toLowerCase()) {
        case 'wikidata':
            return 'Wikidata';
        case 'wiki':
            return 'Wikidata';
        case 'identifiant bnf':
            return 'Identifiant BnF';
        case 'bnf':
            return 'Identifiant BnF';
        case 'idref':
            return 'idRef';
        case 'orcid id':
            return 'ORCID Id';
        case 'idhal':
            return 'idHal';
        case 'numéro national de thèse':
            return 'Numéro national de Thèse';
        case 'univ - droit jurist id':
            return 'Univ - droit jurist ID';
        case 'web of science researcher id':
            return 'Web of Science Researcher ID';
        case 'uai':
            return 'UAI';
        case 'siret':
            return 'Siret';
        case 'grid':
            return 'GRID';
        case 'dataesr':
            return 'dataESR';
        case 'datae':
            return 'dataESR';
        case 'orgref':
            return 'orgref';
        case 'orgre':
            return 'orgref';
        case 'isni':
            return 'isni';
        case 'fundr':
            return 'fundref';
        case 'fundref':
            return 'fundref';
        case 'opencorporates id':
            return 'OpenCorporates ID';
        case 'pic(participant identification code)':
            return 'PIC (Participant Identification Code)';
        case 'pic':
            return 'PIC (Participant Identification Code)';
        case 'référence projet pia(anr)':
            return 'Référence projet PIA (ANR)';
        case 'pia':
            return 'Référence projet PIA (ANR)';
        case `identifiant cti de l'école`:
            return `Identifiant CTI de l'école`;
        case 'cti':
            return `Identifiant CTI de l'école`;
        case 'ror':
            return 'ROR';
        case 'rna':
            return 'RNA';
        case 'id unité cnrs':
            return 'Id unité CNRS';
        case 'cnrs':
            return 'Id unité CNRS';
        case 'rcr':
            return 'RCR';
        case 'isil':
            return 'ISIL';
        case `numéro d'ed`:
            return `Numéro d'ED`;
        case 'ed':
            return `Numéro d'ED`;
        case 'ga oad':
            return 'GA OAD';
        case 'code insee   ':
            return 'Code Insee';
        case 'rnsr':
            return 'RNSR';
        case 'oad':
            return 'OAD';
        case 'alid':
            return 'ALId';
        case 'etid':
            return 'EtId';
        case 'eter':
            return 'ETER';
        case 'wos':
            return 'WOS';
        case 'oc':
            return 'OC';

        default:
            return identType;
    }
}

const Matchers = {
    getBaseInfo(variables, etatCivil) {
        const baseInfo = { creationReason: 'paysage V1' };
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
        const listIds = [];
        Object.keys(ids)
            .filter(
                (ident) =>
                    ident.toLowerCase() !== 'tva' &&
                    ident.toLowerCase() !== 'siren' &&
                    ident.toLowerCase() !== 'paysage'
            )
            .forEach((idType) => {
                ids[idType].forEach((obj) => {
                    listIds.push({
                        value: obj.Id.toString(),
                        type: getTypeIdWithCase(idType),
                        active: obj.etat === 'A',
                    });
                });
            });

        return listIds;
    },

    getSocials(comptesSociaux) {
        const socials = [];
        if (comptesSociaux['444175X90X1493'])
            socials.push({
                type: 'Twitter',
                account: comptesSociaux['444175X90X1493'],
            });
        if (comptesSociaux['444175X90X1502'])
            socials.push({
                type: 'Facebook',
                account: comptesSociaux['444175X90X1502'],
            });
        if (comptesSociaux['444175X90X1503'])
            socials.push({
                type: 'Youtube',
                account: comptesSociaux['444175X90X1503'],
            });
        if (comptesSociaux['444175X90X1494'])
            socials.push({
                type: 'Instagram',
                account: comptesSociaux['444175X90X1494'],
            });
        if (comptesSociaux['444175X90X1497'])
            socials.push({
                type: 'Linkedin',
                account: comptesSociaux['444175X90X1497'],
            });
        if (comptesSociaux['444175X90X1504'])
            socials.push({
                type: 'Dailymotion',
                account: comptesSociaux['444175X90X1504'],
            });
        if (comptesSociaux['444175X90X1520'])
            socials.push({
                type: 'vimeo',
                account: comptesSociaux['444175X90X1520'],
            });
        if (comptesSociaux['444175X90X1689'])
            socials.push({
                type: 'github',
                account: comptesSociaux['444175X90X1689'],
            });
        if (comptesSociaux['444175X90X1514'])
            socials.push({
                type: 'pinterest',
                account: comptesSociaux['444175X90X1514'],
            });
        if (comptesSociaux['444175X90X1513'])
            socials.push({
                type: 'flickr',
                account: comptesSociaux['444175X90X1513'],
            });
        if (comptesSociaux['444175X90X1519'])
            socials.push({
                type: 'tumblr',
                account: comptesSociaux['444175X90X1519'],
            });
        if (comptesSociaux['444175X90X1516'])
            socials.push({
                type: 'franceculture',
                account: comptesSociaux['444175X90X1516'],
            });
        if (comptesSociaux['444175X90X1517'])
            socials.push({
                type: 'scribd',
                account: comptesSociaux['444175X90X1517'],
            });
        if (comptesSociaux['444175X90X1518'])
            socials.push({
                type: 'scoopit',
                account: comptesSociaux['444175X90X1518'],
            });

        return socials;
    },

    getWeblinks(liensExternes) {
        const weblinks = [];

        if (liensExternes['655574X95X1704'])
            weblinks.push({
                type: 'Hal',
                url: liensExternes['655574X95X1704'],
            });
        if (liensExternes['655574X95X1739'])
            weblinks.push({
                type: 'mooc',
                url: liensExternes['655574X95X1739'],
            });
        if (liensExternes['655574X95X1743'])
            weblinks.push({
                type: 'scanR',
                url: liensExternes['655574X95X1743'],
            });
        if (liensExternes['655574X95X1732'])
            weblinks.push({
                type: 'POpenData',
                url: liensExternes['655574X95X1732'],
            });
        if (liensExternes['655574X95X1737'])
            weblinks.push({
                type: 'DataGouvFr',
                url: liensExternes['655574X95X1737'],
            });
        if (liensExternes['655574X95X1799'])
            weblinks.push({
                type: 'EducPros',
                url: liensExternes['655574X95X1799'],
            });
        if (liensExternes['655574X95X1821'])
            weblinks.push({
                type: 'ServicePublic',
                url: liensExternes['655574X95X1821'],
            });
        if (liensExternes['655574X95X1820'])
            weblinks.push({
                type: 'CanalU',
                url: liensExternes['655574X95X1820'],
            });
        if (liensExternes['655574X95X2442'])
            weblinks.push({
                type: 'TheConversation',
                url: liensExternes['655574X95X2442'],
            });
        if (liensExternes['655574X95X2441'])
            weblinks.push({
                type: 'Onisep',
                url: liensExternes['655574X95X2441'],
            });
        if (liensExternes['655574X95X2495'])
            weblinks.push({
                type: 'EdCF',
                url: liensExternes['655574X95X2495'],
            });
        if (liensExternes['655574X95X2494'])
            weblinks.push({
                type: 'jorfsearch',
                url: liensExternes['655574X95X2494'],
            });
        if (liensExternes['655574X95X2496'])
            weblinks.push({
                type: 'TalentCNRS',
                url: liensExternes['655574X95X2496'],
            });
        if (liensExternes['655574X95X2497'])
            weblinks.push({
                type: 'IUF',
                url: liensExternes['655574X95X2497'],
            });
        if (liensExternes['655574X95X2701'])
            weblinks.push({
                type: 'OE1',
                url: liensExternes['655574X95X2701'],
            });
        if (liensExternes['655574X95X2702'])
            weblinks.push({
                type: 'OE2',
                url: liensExternes['655574X95X2702'],
            });
        if (liensExternes['655574X95X2707'])
            weblinks.push({
                type: 'OE3',
                url: liensExternes['655574X95X2707'],
            });
        if (liensExternes['655574X95X2756'])
            weblinks.push({
                type: 'hceres',
                url: liensExternes['655574X95X2756'],
            });

        return weblinks;
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
                        localisationV1['353588X52X593'].split(',')[0]
                    ),
                    lng: parseFloat(
                        localisationV1['353588X52X593'].split(',')[1]
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

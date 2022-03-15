// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
const baseUrl = Cypress.env('baseUrl');

Cypress.Commands.add('newStructure', () => {
    cy.get('[data-cy="contrib/structure"]').click();

    cy.intercept('POST', '/api/structure/**').as('post');

    cy.wait('@post').then((interception) => {
        if (interception.response.body.subObjects[0].id) {
            cy.setCookie('nameId', interception.response.body.subObjects[0].id);
            cy.setCookie(
                'identifierId',
                interception.response.body.subObjects[2].id
            );
            cy.setCookie(
                'localisationId',
                interception.response.body.subObjects[1].id
            );
        }
    });

    cy.sectionsNoSticky(2000);
});

Cypress.Commands.add('sectionsNoSticky', (timeToWait = 1500) => {
    cy.wait(timeToWait);

    cy.document().then((document) => {
        const accordions = document.querySelectorAll('.fr-accordion');

        Array.from(accordions).map((node) => {
            node.children[0].style.position = 'relative';

            return node;
        });
    });
});

Cypress.Commands.add('signIn', () => {
    const password = Cypress.env('PASSWORD');
    const account = Cypress.env('ACCOUNT');

    cy.request({
        method: 'POST',
        url: `${baseUrl}/api/auth/sign-in`,
        failOnStatusCode: false,
        headers: { 'Content-Type': 'application/json' },
        body: {
            password: password,
            account: account,
        },
    }).then((response) => {
        if (Object.keys(response.body).length) {
            cy.setCookie('tokens', JSON.stringify(response.body));
        }
    });
});

Cypress.Commands.add('signOut', () => {
    cy.clearCookie('tokens');
});

Cypress.Commands.add('signup', () => {
    const baseUrl = Cypress.env('baseUrl');
    cy.intercept('POST', '/api/auth/signup').as('signup');

    cy.visit(`${baseUrl}/account/signup`);

    const firstName = `Mollie`;
    const lastName = `Dickinson`;
    const email = `mollie-inactive.dickinson@email.com`;
    const username = `mollie-inactive`;

    cy.get('[name="firstName"]').type(firstName);
    cy.get('[name="lastName"]').type(lastName);
    cy.get('[name="email"]').type(email);
    cy.get('[name="password"]').type('Polk000!');
    cy.get('[name="confirm_password"]').type('Polk000!');
    cy.get('[name="username"]').type(username);

    cy.get('form').submit();

    cy.wait('@signup');
});

Cypress.Commands.add('deleteIndexDB', () => {
    return new Cypress.Promise(async (resolve) => {
        window.indexedDB.deleteDatabase('SERVICE_FORMS');
        resolve();
    });
});

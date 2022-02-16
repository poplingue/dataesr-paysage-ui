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

Cypress.Commands.add('newStructure', () => {
    cy.get('[data-cy="update/structure"]').click();

    cy.intercept('PATCH', '/api/structure/**').as('patch');

    cy.wait(3000);

    cy.sectionsNoSticky();
});

Cypress.Commands.add('sectionsNoSticky', () => {
    cy.document().then((document) => {
        const accordions = document.querySelectorAll('.fr-accordion');

        Array.from(accordions).map((node) => {
            node.children[0].style.position = 'relative';

            return node;
        });
    });
});

Cypress.Commands.add('signIn', () => {
    const baseUrl = Cypress.env('baseUrl');
    cy.intercept('POST', '/api/auth/sign-in').as('sign-in');

    cy.visit(`${baseUrl}/account/sign-in`);
    cy.get('[name="account"]').type('martha@mailinator.com');
    cy.get('[name="password"]').type('Polk000!');

    cy.get('form').submit();

    cy.wait('@sign-in');
});

Cypress.Commands.add('signOut', () => {
    cy.get('.fr-header__tools-links').find('.ds-fr--flex.fr-link').click();
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

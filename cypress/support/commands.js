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
Cypress.Commands.add('signIn', () => {
    const baseUrl = Cypress.env('baseUrl');
    cy.intercept('POST', '/api/auth/sign-in').as('auth');

    cy.visit(`${baseUrl}/account/sign-in`);
    cy.get('[name="account"]').type('martha@mailinator.com');
    cy.get('[name="password"]').type('Polk000!', { force: true });

    cy.get('form').submit();
    cy.wait('@auth');
});

Cypress.Commands.add('signOut', () => {
    cy.scrollTo(0, 0);
    cy.get('.fr-header__tools-links')
        .find('.ds-fr--flex.fr-link')
        .click({ force: true });
});

Cypress.Commands.add('signup', () => {
    const baseUrl = Cypress.env('baseUrl');
    cy.intercept('POST', '/api/auth/signup').as('auth');

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

    cy.wait('@post');
});

Cypress.Commands.add('deleteIndexDB', () => {
    return new Cypress.Promise(async (resolve) => {
        window.indexedDB.deleteDatabase('SERVICE_FORMS');
        resolve();
    });
});

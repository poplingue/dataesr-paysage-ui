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
    cy.visit(`${baseUrl}/account/sign-in`);
    cy.get('[name="account"]').type('martha@mailinator.com');
    cy.get('[name="password"]').type('Polk000!');

    cy.get('form').submit();

    cy.wait(2000);
});

Cypress.Commands.add('signOut', () => {
    const baseUrl = Cypress.env('baseUrl');
    cy.visit(`${baseUrl}`);
    cy.get('[data-cy="sign-out"]').click();

    cy.wait(2000);
});

Cypress.Commands.add('signup', () => {
    const baseUrl = Cypress.env('baseUrl');

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
});

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Cypress.on("window:before:load", win => {
//     win.indexedDB.deleteDatabase("SERVICE_FORMS");
// });

Cypress.Commands.add('deleteIndexDB', (win) => {
    return new Cypress.Promise(async (resolve) => {
        window.indexedDB.deleteDatabase('SERVICE_FORMS');
        resolve();
    });
});

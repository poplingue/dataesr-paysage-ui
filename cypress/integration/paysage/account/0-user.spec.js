const baseUrl = Cypress.env('baseUrl');

context('Account manager', () => {
    it('should signup a Mollie user', () => {
        cy.visit(`${baseUrl}/account/signup`);

        const d = new Date();
        const firstName = `Mollie${d.getTime()}`;
        const lastName = `Dickinson${d.getTime()}`;
        const email = `mollie.dickinson-${d.getTime()}@email.com`;
        const username = `mollie-${d.getTime()}`;

        cy.get('[name="firstName"]').type(firstName, { force: true });
        cy.get('[name="lastName"]').type(lastName);
        cy.get('[name="email"]').type(email);
        cy.get('[name="password"]').type('Polk000!');
        cy.get('[name="confirm_password"]').type('Polk000!');
        cy.get('[name="username"]').type(username);

        cy.get('form').submit();

        cy.wait(1000);
        cy.get('.cy-notif-valid').should('exist');
        cy.clearCookies();
    });
});

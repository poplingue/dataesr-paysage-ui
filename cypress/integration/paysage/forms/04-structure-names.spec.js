const baseUrl = Cypress.env('baseUrl');

context('Structure new form', () => {
    before(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/update`);
        cy.newStructure();
    });

    it('should save new Structure officialName data', () => {
        cy.getCookie('nameId').then((cookie) => {
            const id = cookie.value;

            cy.intercept('PATCH', '/api/structure/**').as('patch');

            cy.get('[data-testid="officialName"]')
                .find('input')
                .type('Offiffi');

            cy.get(`[data-testid="Noms#${id}-save-button"]`).click();
            cy.wait('@patch');

            cy.reload();

            cy.get('[data-testid="officialName"]')
                .find('input')
                .should('have.value', 'Offiffi');
        });
    });
});

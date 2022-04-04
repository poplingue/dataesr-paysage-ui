const baseUrl = Cypress.env('baseUrl');

context('Structure new form save officialName', () => {
    before(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/contrib`);
        cy.newStructure();
    });

    it('should save new Structure officialName data', () => {
        cy.getCookie('nameId').then((cookie) => {
            const id = cookie.value;

            cy.sectionsNoSticky();

            cy.intercept('PATCH', '/api/structure/**').as('patch');
            cy.intercept('GET', '/api/structure/**/names').as('get');

            cy.get('[data-testid="officialName"]')
                .find('input')
                .type('Offiffi');

            cy.get('[data-testid="usualName"]').find('input').type('usualName');

            cy.get(`[data-testid="names#${id}-save-button"]`).click();
            cy.wait('@patch');

            cy.reload();

            cy.wait('@get');

            cy.get('[data-testid="officialName"]')
                .find('input')
                .should('have.value', 'Offiffi');
        });
    });
});

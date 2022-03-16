const baseUrl = Cypress.env('baseUrl');

context('Structure identifiers', () => {
    beforeEach(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/contrib`);
        cy.newStructure();
    });

    it('identifier should be inactive by default', () => {
        cy.getCookie('identifierId').then((cookie) => {
            const id = cookie.value;

            cy.get(`[data-field="contrib/structure@identifiers#${id}_active"]`)
                .find('[data-cy="false"] input')
                .should('be.checked');
        });
    });

    it('identifier should change to active', () => {
        cy.getCookie('identifierId').then((cookie) => {
            const id = cookie.value;
            cy.intercept('PATCH', '/api/structure/**').as('patch');

            cy.get(`[data-field="contrib/structure@identifiers#${id}_type"]`)
                .find('input')
                .type('type');

            cy.get('[data-testid="value"]').find('input').type('value');

            cy.get('[data-cy="true"]').find('input').check({ force: true });

            cy.get(`[data-testid="identifiers#${id}-save-button"]`).click();

            cy.wait('@patch');

            cy.get(`[data-field="contrib/structure@identifiers#${id}_active"]`)
                .find('[data-cy="true"] input')
                .should('be.checked');
        });
    });
});

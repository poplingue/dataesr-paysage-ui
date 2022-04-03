const baseUrl = Cypress.env('baseUrl');

context('Structure new form toggle year', () => {
    beforeEach(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/contrib`);
        cy.newStructure();
    });

    it('should toggle input type text to select', () => {
        cy.getCookie('nameId').then((cookie) => {
            const id = cookie.value;

            cy.sectionsNoSticky();

            cy.get(
                `[data-cy="toggle-contrib/structure@names#${id}_endDateYear"]`
            ).click();

            cy.get(
                `[data-cy="toggle-contrib/structure@names#${id}_endDateYear"]`
            ).should('not.have.class', 'fr-btn--secondary');
            cy.get(`[data-field="contrib/structure@names#${id}_endDateYear"]`)
                .find('select')
                .should('not.exist');
        });
    });

    it('should keep year selected on toggle click', () => {
        cy.getCookie('nameId').then((cookie) => {
            const id = cookie.value;

            cy.get(`[data-field="contrib/structure@names#${id}_endDateYear"]`)
                .find('select')
                .select('2000');
            cy.get(
                `[data-cy="toggle-contrib/structure@names#${id}_endDateYear"]`
            ).click();

            cy.get(`[data-field="contrib/structure@names#${id}_endDateYear"]`)
                .find('input')
                .should('have.value', '2000');
        });
    });
});

const baseUrl = Cypress.env('baseUrl');

context('Structure new form', () => {
    beforeEach(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/update`);
        cy.newStructure();
    });

    it('should save new Structure full date data', () => {
        cy.getCookie('nameId').then((cookie) => {
            const id = cookie.value;

            cy.intercept('PATCH', '/api/structure/**').as('patch');

            cy.get(`[data-field="update/structure@names#${id}_startDateDay"]`)
                .find('select')
                .select('04');
            cy.get(`[data-field="update/structure@names#${id}_startDateMonth"]`)
                .find('select')
                .select('08');
            cy.get(`[data-field="update/structure@names#${id}_startDateYear"]`)
                .find('select')
                .select('2000');

            cy.get(`[data-testid="Noms#${id}-save-button"]`).click();
            cy.wait('@patch');

            cy.reload();
            cy.sectionsNoSticky();

            cy.get(`[data-field="update/structure@names#${id}_startDateDay"]`)
                .find('select')
                .should('have.value', '04');
            cy.get(`[data-field="update/structure@names#${id}_startDateMonth"]`)
                .find('select')
                .should('have.value', '08');
            cy.get(`[data-field="update/structure@names#${id}_startDateYear"]`)
                .find('select')
                .should('have.value', '2000');
        });
    });

    it('should save new Structure automatic first January data', () => {
        cy.getCookie('nameId').then((cookie) => {
            cy.intercept('PATCH', '/api/structure/**').as('patch');

            const id = cookie.value;
            const now = new Date();
            const currentYear = now.getFullYear().toString();

            cy.get('[data-testId="firstJanuary-startdate"]').click();

            cy.get(`[data-testid="Noms#${id}-save-button"]`).click();

            cy.wait('@patch');

            cy.reload();

            cy.get(`[data-field="update/structure@names#${id}_startDateDay"]`)
                .find('select')
                .should('have.value', '01');
            cy.get(`[data-field="update/structure@names#${id}_startDateMonth"]`)
                .find('select')
                .should('have.value', '01');
            cy.get(`[data-field="update/structure@names#${id}_startDateYear"]`)
                .find('select')
                .should('have.value', currentYear);
        });
    });

    it('should save new Structure partial date data', () => {
        cy.getCookie('nameId').then((cookie) => {
            const id = cookie.value;

            cy.intercept('PATCH', '/api/structure/**').as('patch');

            cy.get(`[data-field="update/structure@names#${id}_startDateMonth"]`)
                .find('select')
                .select('05');
            cy.get(`[data-field="update/structure@names#${id}_startDateYear"]`)
                .find('select')
                .select('2013');

            cy.get(`[data-testid="Noms#${id}-save-button"]`).click();
            cy.wait('@patch');

            cy.reload();

            cy.get(`[data-field="update/structure@names#${id}_startDateDay"]`)
                .find('select')
                .should('have.value', null);
            cy.get(`[data-field="update/structure@names#${id}_startDateMonth"]`)
                .find('select')
                .should('have.value', '05');
            cy.get(`[data-field="update/structure@names#${id}_startDateYear"]`)
                .find('select')
                .should('have.value', '2013');
        });
    });
});

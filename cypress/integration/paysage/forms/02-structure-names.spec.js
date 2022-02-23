const baseUrl = Cypress.env('baseUrl');

context('Structure new form', () => {
    beforeEach(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/update`);
        cy.newStructure();
    });

    it('should save Article Select field', () => {
        cy.getCookie('nameId').then((cookie) => {
            cy.intercept('PATCH', '/api/structure/**').as('patch');

            const id = cookie.value;

            cy.get(`[data-field="update/structure@names#${id}_article"]`)
                .find('select')
                .select('aux');

            cy.get(`[data-testid="Noms#${id}-save-button"]`).click();

            cy.wait('@patch');
            cy.reload();

            cy.get(`[data-field="update/structure@names#${id}_article"]`)
                .find('select')
                .should('have.value', 'aux');
        });
    });

    it('should delete Othername field', () => {
        cy.getCookie('nameId').then((cookie) => {
            cy.intercept('PATCH', '/api/structure/**').as('patch');

            const id = cookie.value;

            cy.get(`[data-field="update/structure@names#${id}_otherNames#0"]`)
                .find('input')
                .type('OtherName#0');

            cy.get('[data-testid="btn-add"]').click();

            cy.get(`[data-field="update/structure@names#${id}_otherNames#1"]`)
                .find('input')
                .type('OtherName#1');

            cy.get(`[data-testid="Noms#${id}-save-button"]`).click();

            cy.intercept('PATCH', '/api/structure/**').as('path');

            cy.get('[data-testid="btn-delete-autrenom#1"]').click();

            cy.wait('@path');

            cy.get(
                `[data-field="update/structure@names#${id}_otherNames#1"]`
            ).should('not.exist');
        });
    });

    it('should save empty ShortName field', () => {
        cy.getCookie('nameId').then((cookie) => {
            cy.intercept('PATCH', '/api/structure/**').as('patch');

            const id = cookie.value;

            cy.get(`[data-field="update/structure@names#${id}_shortName"]`)
                .find('input')
                .type('ShortName');

            cy.intercept('PATCH', '/api/structure/**').as('ShortName');

            cy.get(`[data-testid="Noms#${id}-save-button"]`).click();

            cy.wait('@ShortName');

            cy.reload();
            cy.sectionsNoSticky();

            cy.get(`[data-field="update/structure@names#${id}_shortName"]`)
                .find('input')
                .type('toutouyoutou')
                .clear();

            cy.intercept('PATCH', '/api/structure/**').as('NoShortName');

            cy.get(`[data-testid="Noms#${id}-save-button"]`).click();

            cy.wait('@NoShortName');

            cy.reload();

            cy.get(`[data-field="update/structure@names#${id}_shortName"]`)
                .find('input')
                .should('have.value', '');
        });
    });
});

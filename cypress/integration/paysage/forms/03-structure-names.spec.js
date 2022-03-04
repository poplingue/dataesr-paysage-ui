import { cleanString } from '../../../../helpers/utils';

const baseUrl = Cypress.env('baseUrl');

context('Structure new form', () => {
    beforeEach(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/update`);
        cy.newStructure();
    });

    it('should add Name section', () => {
        cy.get('[data-testid="btn-add-names"]').click();

        cy.intercept('POST', '/api/structure/**').as('post');

        cy.wait('@post').then((interception) => {
            cy.get(
                `[data-field="update/structure@names#${interception.response.body.id}_officialName"]`
            )
                .find('input')
                .should('be.visible');
        });
    });

    it('should save in new section', () => {
        cy.getCookie('nameId').then((cookie) => {
            const id = cookie.value;

            cy.intercept('PATCH', '/api/structure/**').as('patch');

            cy.get(`[data-field="update/structure@names#${id}_officialName"]`)
                .find('input')
                .type('Officiel1');

            cy.get(`[data-testid="names#${id}-save-button"]`).click();

            cy.wait('@patch');

            cy.intercept('POST', '/api/structure/**').as('post');

            cy.get('[data-testid="btn-add-names"]').click();

            cy.wait('@post').then((interception) => {
                cy.sectionsNoSticky();

                const id2 = interception.response.body.id;

                cy.intercept('PATCH', '/api/structure/**').as('patch');

                cy.get(
                    `[data-field="update/structure@names#${id2}_officialName"]`
                )
                    .find('input')
                    .type('Officiel2');

                cy.get(`[data-testid="names#${id2}-save-button"]`).click();

                cy.wait('@patch');

                cy.reload();
                cy.sectionsNoSticky();

                cy.get(
                    `[data-field="update/structure@names#${id2}_officialName"]`
                )
                    .find('input')
                    .should('have.value', 'Officiel2');
            });
        });
    });

    it('should delete new section', () => {
        cy.intercept('DELETE', '/api/structure/**').as('delete');
        cy.intercept('PATCH', '/api/structure/**').as('patch');

        cy.getCookie('nameId').then((cookie) => {
            const id = cookie.value;

            cy.get(`[data-field="update/structure@names#${id}_brandName"]`)
                .find('input')
                .type('Brand1');

            cy.get(`[data-testid="names#${id}-save-button"]`).click();
            cy.wait('@patch');

            cy.intercept('POST', '/api/structure/**').as('post');

            cy.get('[data-testid="btn-add-names"]').click();

            cy.wait('@post').then((interception) => {
                cy.sectionsNoSticky();

                const id2 = interception.response.body.id;

                cy.intercept('DELETE', '/api/structure/**').as('delete');

                cy.get(`[data-field="update/structure@names#${id2}_brandName"]`)
                    .find('input')
                    .type('Brand2');

                cy.get(
                    `[data-testid="btn-delete-noms${cleanString(id2)}"]`
                ).click();

                cy.wait('@delete');

                cy.get(
                    `[data-field="update/structure@names#${id2}_officialName"]`
                ).should('not.exist');
            });
        });
    });
});

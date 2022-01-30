const baseUrl = Cypress.env('baseUrl');

context('Person form page', () => {
    beforeEach(() => {
        cy.deleteIndexDB();
        cy.visit(`${baseUrl}/demo/person`);
    });

    it('should delete one of multiple infinite input field', () => {
        cy.get('[data-field="demo/person@denomination_otherName#0"]')
            .find('input')
            .type("Il n'y a de divinité");
        cy.get('[data-testid="btn-add"]').click();
        cy.get('[data-field="demo/person@denomination_otherName#1"]')
            .find('input')
            .type("qu'Allah");
        cy.get('[data-testid="btn-add"]').click();
        cy.get('[data-field="demo/person@denomination_otherName#2"]')
            .find('input')
            .type('et Mahomet est');
        cy.get('[data-testid="btn-add"]').click();
        cy.get('[data-field="demo/person@denomination_otherName#3"]')
            .find('input')
            .type('son messager');

        cy.get('[data-testid="btn-delete-autredenomination#1"]').click();

        cy.get('[data-field="demo/person@denomination_otherName#0"]')
            .find('input')
            .should('have.value', "Il n'y a de divinité");
        cy.get('[data-field="demo/person@denomination_otherName#1"]')
            .find('input')
            .should('have.value', 'et Mahomet est');
        cy.get('[data-field="demo/person@denomination_otherName#2"]')
            .find('input')
            .should('have.value', 'son messager');
    });

    it('should open all sections', () => {
        cy.get('[data-cy="toolbox-header"]').find('.ri-tools-fill ').click();
        cy.get('[data-testid="btn-expand-close"]').click();
        cy.get('[data-testid="btn-expand-close"]').click();
        cy.get('[data-testid="wikidata"]').should('be.visible');
        cy.get('[data-testid="demo/person@denomination_gender#0"]').should(
            'be.visible'
        );
    });

    it('should close all sections', () => {
        cy.get('[data-cy="toolbox-header"]').find('.ri-tools-fill ').click();
        cy.get('[data-testid="btn-expand-close"]').click();
        cy.get('[data-testid="wikidata"]').should('not.be.visible');
        cy.get('[data-testid="demo/person@denomination_gender#0"]').should(
            'not.be.visible'
        );
    });

    it('should display error input', () => {
        cy.get('[data-testid="lastName"] input').type('A');
        cy.get('[data-testid="lastName"]')
            .find('.fr-error-text')
            .should('be.visible');
    });

    it('should display valid input', () => {
        cy.get('[data-testid="lastName"] input').type('Abcd');
        cy.get('[data-testid="lastName"]')
            .find('.fr-input')
            .should('have.class', 'fr-input--valid');
    });

    it('should display optional hint', () => {
        cy.get('[data-testid="otherName"] .fr-hint-text').should('be.visible');
    });
});

const baseUrl = Cypress.env('baseUrl');

context('Person form page', () => {
    beforeEach(() => {
        cy.deleteIndexDB();
        cy.visit(`${baseUrl}/demo/person`);
    });

    it('should render idRef input field', () => {
        cy.get('[data-testid="IdRef"]')
            .find('input')
            .type('12345')
            .should('have.value', '12345');
    });

    it('should add an infinite input field Autre dénomination', () => {
        cy.get('[data-testid="Autre dénomination"]')
            .find('input')
            .type('Maggie Smith');
        cy.get('[data-testid="btn-add"]').click();

        cy.get(
            '[data-field="demo/person@denomination/autredenomination#1"]'
        ).should('exist');
        cy.get('[data-testid="btn-delete-autredenomination#1"]').should(
            'exist'
        );
    });

    it('should delete infinite input field', () => {
        cy.get('[data-testid="Autre dénomination"]')
            .find('input')
            .type('Maggie Smith');
        cy.get('[data-testid="btn-add"]').click();

        cy.get('[data-testid="btn-delete-autredenomination#1"]').click();
        cy.get(
            '[data-field="demo/person@denomination/autredenomination#1"]'
        ).should('not.exist');
        cy.get('[data-testid="btn-delete-autredenomination#1"]').should(
            'not.exist'
        );
    });

    it('should create multiple infinite input field', () => {
        cy.get('[data-field="demo/person@denomination/autredenomination#0"]')
            .find('input')
            .type("Il n'y a de divinité");
        cy.get('[data-testid="btn-add"]').click();
        cy.scrollTo(0, 300);
        cy.get('[data-field="demo/person@denomination/autredenomination#1"]')
            .find('input')
            .type("qu'Allah");
        cy.get('[data-testid="btn-add"]').click();
        cy.scrollTo(0, 300);
        cy.get('[data-field="demo/person@denomination/autredenomination#2"]')
            .find('input')
            .type('et Mahomet est');
        cy.get('[data-testid="btn-add"]').click();
        cy.scrollTo(0, 300);
        cy.get('[data-field="demo/person@denomination/autredenomination#3"]')
            .find('input')
            .type('son messager');

        cy.get('[data-field="demo/person@denomination/autredenomination#0"]')
            .find('input')
            .should('have.value', "Il n'y a de divinité");
        cy.get('[data-field="demo/person@denomination/autredenomination#1"]')
            .find('input')
            .should('have.value', "qu'Allah");
        cy.get('[data-field="demo/person@denomination/autredenomination#2"]')
            .find('input')
            .should('have.value', 'et Mahomet est');
        cy.get('[data-field="demo/person@denomination/autredenomination#3"]')
            .find('input')
            .should('have.value', 'son messager');
    });

    it('should delete one of multiple infinite input field', () => {
        cy.get('[data-field="demo/person@denomination/autredenomination#0"]')
            .find('input')
            .type("Il n'y a de divinité");
        cy.get('[data-testid="btn-add"]').click();
        cy.get('[data-field="demo/person@denomination/autredenomination#1"]')
            .find('input')
            .type("qu'Allah");
        cy.get('[data-testid="btn-add"]').click();
        cy.get('[data-field="demo/person@denomination/autredenomination#2"]')
            .find('input')
            .type('et Mahomet est');
        cy.get('[data-testid="btn-add"]').click();
        cy.get('[data-field="demo/person@denomination/autredenomination#3"]')
            .find('input')
            .type('son messager');

        cy.get('[data-testid="btn-delete-autredenomination#1"]').click();

        cy.get('[data-field="demo/person@denomination/autredenomination#0"]')
            .find('input')
            .should('have.value', "Il n'y a de divinité");
        cy.get('[data-field="demo/person@denomination/autredenomination#1"]')
            .find('input')
            .should('have.value', 'et Mahomet est');
        cy.get('[data-field="demo/person@denomination/autredenomination#2"]')
            .find('input')
            .should('have.value', 'son messager');
    });

    it('should open all sections', () => {
        cy.get('[data-cy="toolbox-header"]').find('.ri-tools-fill ').click();
        cy.get('[data-testid="btn-expand-close"]').click();
        cy.get('[data-testid="btn-expand-close"]').click();
        cy.get('[data-testid="Wikidata"]').should('be.visible');
        cy.get('[data-testid="demo/person@denomination/genre#0"]').should(
            'be.visible'
        );
    });

    it('should close all sections', () => {
        cy.get('[data-cy="toolbox-header"]').find('.ri-tools-fill ').click();
        cy.get('[data-testid="btn-expand-close"]').click();
        cy.get('[data-testid="Wikidata"]').should('not.be.visible');
        cy.get('[data-testid="demo/person@denomination/genre#0"]').should(
            'not.be.visible'
        );
    });

    it('should display error input', () => {
        cy.get('[data-testid="Nom"] input').type('A');
        cy.get('[data-testid="Nom"]')
            .find('.fr-error-text')
            .should('be.visible');
    });

    it('should display valid input', () => {
        cy.get('[data-testid="Nom"] input').type('Abcd');
        cy.get('[data-testid="Nom"]')
            .find('.fr-input')
            .should('have.class', 'fr-input--valid');
    });

    it('should display optional hint', () => {
        cy.get('[data-testid="Autre dénomination"] .fr-hint-text').should(
            'be.visible'
        );
    });

    it('should check', () => {
        cy.get('[data-cy="notsatisfied"] label').click();
        cy.get('[data-cy="notsatisfied"]').find('input').should('be.checked');
    });

    it('should uncheck on Label click', () => {
        cy.get('[data-cy="satisfied"] label').click();
        cy.get('[data-cy="satisfied"] label').click();
        cy.get('[data-cy="satisfied"] input').should('not.be.checked');
    });
});

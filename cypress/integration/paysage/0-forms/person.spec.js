context('Person form page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/person/create');
    });

    it('should display current page BreadCrumbs', () => {
        cy.get('[data-cy="current-page"]').find('a').should('have.text', 'Ajouter une personne');
    });

    it('should render idRef input field', () => {
        cy.clearIndexDB();

        cy.get('[data-testid="IdRef"]').find('input').type('12345').should('have.value', '12345');
    });

    it('should add an infinite input field Autre dénomination', () => {
        cy.clearIndexDB();

        cy.get('[data-testid="Autre dénomination"]').find('input').type('Maggie Smith');
        cy.get('[data-testid="btn-add"]').click();

        cy.get('[data-field="person/create@denomination/autre-denomination#1"]').should('exist');
        cy.get('[data-testid="btn-delete-autre-denomination#1"]').should('exist');

    });

    it('should delete infinite input field', () => {
        cy.clearIndexDB();

        cy.get('[data-testid="Autre dénomination"]').find('input').type('Maggie Smith');
        cy.get('[data-testid="btn-add"]').click();

        cy.get('[data-testid="btn-delete-autre-denomination#1"]').click();
        cy.get('[data-field="person/create@denomination/autre-denomination#1"]').should('not.exist');
        cy.get('[data-testid="btn-delete-autre-denomination#1"]').should('not.exist');
    });

    it('should create multiple infinite input field', () => {
        cy.get('[data-field="person/create@denomination/autre-denomination#0"]').find('input').type('Il n\'y a de divinité');
        cy.get('[data-testid="btn-add"]').click();
        cy.get('[data-field="person/create@denomination/autre-denomination#1"]').find('input').type('qu\'Allah');
        cy.get('[data-testid="btn-add"]').click();
        cy.get('[data-field="person/create@denomination/autre-denomination#2"]').find('input').type('et Mahomet est');
        cy.get('[data-testid="btn-add"]').click();
        cy.get('[data-field="person/create@denomination/autre-denomination#3"]').find('input').type('son messager');

        cy.get('[data-field="person/create@denomination/autre-denomination#0"]').find('input').should('have.value', 'Il n\'y a de divinité');
        cy.get('[data-field="person/create@denomination/autre-denomination#1"]').find('input').should('have.value', 'qu\'Allah');
        cy.get('[data-field="person/create@denomination/autre-denomination#2"]').find('input').should('have.value', 'et Mahomet est');
        cy.get('[data-field="person/create@denomination/autre-denomination#3"]').find('input').should('have.value', 'son messager');
    });

    it('should delete one of multiple infinite input field', () => {
        cy.clearIndexDB();
        cy.get('[data-field="person/create@denomination/autre-denomination#0"]').find('input').type('Il n\'y a de divinité');
        cy.get('[data-testid="btn-add"]').click();
        cy.get('[data-field="person/create@denomination/autre-denomination#1"]').find('input').type('qu\'Allah');
        cy.get('[data-testid="btn-add"]').click();
        cy.get('[data-field="person/create@denomination/autre-denomination#2"]').find('input').type('et Mahomet est');
        cy.get('[data-testid="btn-add"]').click();
        cy.get('[data-field="person/create@denomination/autre-denomination#3"]').find('input').type('son messager');

        cy.get('[data-testid="btn-delete-autre-denomination#1"]').click();

        cy.get('[data-field="person/create@denomination/autre-denomination#0"]').find('input').should('have.value', 'Il n\'y a de divinité');
        cy.get('[data-field="person/create@denomination/autre-denomination#1"]').find('input').should('have.value', 'et Mahomet est');
        cy.get('[data-field="person/create@denomination/autre-denomination#2"]').find('input').should('have.value', 'son messager');
    })
});

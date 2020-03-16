// https://docs.cypress.io/api/introduction/api.html

describe('My First Test', () => {
    it('Visits the app root url', () => {
        cy.visit('/');
        cy.contains('button', 'Aceptar');
        cy.contains('button', 'Volver a Empezar');
        cy.get('.correct-score').should('contain', 'Aciertos: 0');
        cy.get('.wrong-score').should('contain', 'Fallos: 0');
    });
});

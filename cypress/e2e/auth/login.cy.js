/// <reference types="cypress" />

describe('<Login />', () => {
    it('<Login /> - Verificar pantalla de inicio', () => {
        cy.visit("/")

        cy.get('[alt="delayed image"]')
        .should('be.visible')
        .and(($img) => {
          // "naturalWidth" and "naturalHeight" are set when the image loads
          expect($img[0].naturalWidth).to.be.greaterThan(0)
        })
        
        //Probar texto
        cy.get("[data-cy=title-login]")
            .invoke("text")
            .should("equal", "Ingresa tu cuenta")
    });

    it('<Login /> - Verificar el formulario', () => {

    });

});
import "cypress-localstorage-commands";

const headerTest = (ventana) => {
  cy.get("header").then((element) => {
    cy.wrap(element).matchImageSnapshot("header" + ventana);
  });
};

describe("Test SICA con screenshots", () => {
  it("Ingreso a la aplicacion", () => {
    cy.visit("/");
    cy.wait(1000)
    cy.get(".profile__form").then((element) => {
      cy.wrap(element).matchImageSnapshot("login");
    });
    cy.get("#root").then((element) => {
      cy.wrap(element)
      .invoke('css', 'height', "720").matchImageSnapshot("screenshotLogin");
    });
    cy.get(".Login-selectEmpty-3").click();
    cy.contains("Codensa").click();
    cy.get("input").each((element, i) => {
      if (i > 0) {
        cy.get(`#${element[0].id}`).type("daniel1");
      }
    });
    cy.contains("Login").click();
  });

  it("Test a sideBar de la aplicacion", () => {

    cy.get(".MuiDrawer-paperAnchorDockedLeft-272").then((element) => {
      cy.contains("Casos").click();
      cy.wrap(element).matchImageSnapshot("screenshotSideBar");
    });
  });



  it("Test pagina principal", () => {
    headerTest("Actividades");
    cy.get(".MuiCard-root-412").then((element) => {
      cy.get("strong").should((strong) => {
        expect(strong).to.have.length(5);
        expect(strong.eq(0)).to.contain("Codensa" || "Comsistelco");
        expect(strong.eq(1)).to.contain("Concepto:");
        expect(strong.eq(2)).to.contain("Id del lote:");
        expect(strong.eq(3)).to.contain("Observación");
        expect(strong.eq(4)).to.contain("Archivo");
      });
    });

    cy.get("#root").then((element) => {
      cy.wrap(element).invoke('css', 'height', "720").matchImageSnapshot("screenshotActividades");
    });

    cy.get(".AppContent-tablePagination-148").then((element) => {
      cy.wrap(element).matchImageSnapshot("ComponenteDePaginacion");
    });
    cy.get(".AppContent-fab-144").then((element) => {
      cy.wrap(element).matchImageSnapshot("botonAgregar");
    });
  });

  it("Test ventana Resumen", () => {
    cy.contains("Resumen").click();
    cy.wait(1000)
    cy.get("#root").then((element) => {
      cy.wrap(element).invoke('css', 'height', "720").matchImageSnapshot("screenshotSummarySelect");
    });
    cy.get("#summarySelect").then((element) => {
      cy.wrap(element).matchImageSnapshot("summarySelect");
    });
    headerTest("SeleccionarResumen");
    cy.get("#date-2").type("2021-10-14");
    cy.contains("Aceptar").click();
    cy.wait(1000);
    headerTest("Resumen");

    cy.get("th").should((headers) => {
      expect(headers).to.have.length(2);
      expect(headers.eq(0)).to.contain("Estado");
      expect(headers.eq(1)).to.contain("Cantidad");
    });
    cy.get("a").should((a) => {
      const summaryTableContent = [
        "ASIGNACIÓN INCORRECTA",
        "CARGADA EPICA",
        "PARA ASIGNACIÓN LOCAL ANALISIS",
        "REMITIDO PARA CARGUE",
        "REMITIDO PARA CARGUE ODT",
        "PARA COBRO",
        "PENDIENTE ANÁLISI",
        "PENDIENTE MOVIMIENTO",
        "GESTIONADO CODENSA",
        "DESASIGNADO CODENSA",
        "DEVUELTO CODENSA",
        "Total",
      ];

      expect(a).to.have.length(12);
      summaryTableContent.forEach((element, i) => {
        expect(a.eq(i)).to.contain(element);
      });
    });
    cy.get("#root").then((element) => {
      cy.wrap(element).invoke('css', 'height', "720").matchImageSnapshot("screenshotSummaryTable");
    });
  });

  it("Test ventana casos", () => {
    cy.contains("Ver casos").click();
    cy.get("#root").then((element) => {
      cy.wrap(element).invoke('css', 'height', "720").matchImageSnapshot("screenshotCasosSelect");
    });
    cy.get("#caseSelect").then((element) => {
      cy.wrap(element).matchImageSnapshot("caseSelect");
    });
    headerTest("SeleccionarCasos");
    cy.get("#date-2").type("2021-10-14");
    cy.contains("Aceptar").click();
    cy.wait(1000);
    headerTest("Casos");
    cy.get("button[aria-label='Edit']").then((element) => {
      cy.wrap(element).matchImageSnapshot("editIcon");
    });
    cy.get(".summary-button").then((element) => {
      cy.wrap(element).matchImageSnapshot("summaryButton");
    });
    cy.get("th").should((headers) => {
      const headersCasos = [
        "Ordenado",
        "Estado",
        "Cambios De Estado",
        "Motivo",
        "Fecha Analisis",
        "Fecha De Cargue",
        "Nro Cuenta",
        "Fecha De Operacion En Terreno",
        "Asignacion Analisis",
        "Des Resultado",
        "Clasificacion Final",
        "Obs Insp",
        "Observacion Analisis",
        "Expediente",
        "Destino",
        "Cobro",
        "Tipo De Cobro",
        "Id Lote",
      ];

      expect(headers).to.have.length(18);

      headersCasos.forEach((element, i) => {
        expect(headers.eq(i)).to.contain(element);
      });
    });

    cy.get("#root").then((element) => {
      cy.wrap(element).invoke('css', 'height', "720").matchImageSnapshot("screenshotCasosTable");
    });

    cy.get("td").contains("1");
    cy.contains("2021/9/21").click();
    cy.get("#root").then((element) => {
      cy.wrap(element).invoke('css', 'height', "720").matchImageSnapshot("modalDetails");
    });
      cy.get(".arrow").click();
  });

  it("Test ventana lotes", () => {
    cy.contains("Lotes").click({ force: true });
    headerTest("Lotes");
    cy.get("th").should((headers) => {
      const headersLotes = ["_id", "Fecha Subido", "Casos", "URL Archivo"];

      expect(headers).to.have.length(4);

      headersLotes.forEach((element, i) => {
        expect(headers.eq(i)).to.contain(element);
      });
    });
  });

  it("Test ventana consolidado", () => {
    cy.contains("Consolidado").click();
    cy.get(".container-paper-padre").then((element) => {
      cy.wrap(element).matchImageSnapshot("consolidadoSelect");
    });

    cy.get("#select-mesSelect").click();
    cy.contains("Octubre").click()
    cy.get("#select-añoSelect").click();
    cy.contains("2020").click();
    cy.contains("Aceptar").click();

    headerTest("Consolidado");

    cy.get("th").should((headers) => {
      const headersLotes = [
        "Fecha de asignación",
        "Observación",
        "Casos asignados",
        "Casos cerrados",
        "% gestionado al 3 día",
        "% gestionado al 5 día",
        "Casos fuera",
        "Archivo",
        "Consolidado",
      ];

      expect(headers).to.have.length(9);

      headersLotes.forEach((element, i) => {
        expect(headers.eq(i)).to.contain(element);
      });
    });
  });
});

afterEach(() => {
  cy.saveLocalStorage();
});

beforeEach(() => {
  cy.viewport(3000, 720)
  cy.restoreLocalStorage();
});

import { ArgumentTypes } from '../../types';
import { internalFetch } from '../common';

//cleans test data for a resource
export const cleanTestData = (
  resource: string,
  options?: ArgumentTypes<typeof cy.request>[0]
) => {
  //fetches with customized options
  return internalFetch(`e2e-data/${resource}/clean`, {
    timeout: 60000,
    ...options,
  });
};

//generates basic test data for the indicated resource 
export const generateTestData = (resource: string) => {
  return internalFetch(`e2e-data/${resource}/generate`, { timeout: 60000 });
};

export const generateStandardTestData = (resource: string) => {
  return internalFetch(`e2e-data/${resource}/generate-standard`, {
    timeout: 60000,
    //Tipado Cypress.Chainable - promesa encadenable de Cypress
  }) as Cypress.Chainable<Cypress.Response<TestDataStandardResponse>>;
};

//Definición de tipo de datos que devuelve generateStandardTestData
//describe qué información incluye: projects, users, organizations. 
export type TestDataStandardResponse = {
  projects: { name: string; id: number }[];
  users: { username: string; name: string; id: number }[];
  organizations: { id: number; name: string; slug: string }[];
  invitations: { code: string; projectId: number; organizationId: number }[];
};

// devuelve un objeto que agrupa los tres métodos anteriores 
// check the data in '../../common/apiCalls/testData/testData';
// example in the Testsuite: projectTasks
// after defined, use it in the testsuite as x.clean, x.generateStandard, 

//generate() - genera datos básicos (mínimos o vacíos. no muy útil para los tests)
//generateStandard() - genera un conjunto más completo de datos simulados 
//clean() - borra datos relacionados con el recurso. 
export const generateTestDataObject = (resource: string) => ({
  generate: () => generateTestData(resource),
  generateStandard: () => generateStandardTestData(resource),
  clean: (options?: ArgumentTypes<typeof cy.request>[0]) =>
    cleanTestData(resource, options),
});

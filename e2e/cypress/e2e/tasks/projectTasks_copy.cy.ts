import { login } from '../../common/apiCalls/common';
import { tasks } from '../../common/apiCalls/testData/testData';
import { waitForGlobalLoading } from '../../common/loading';
import { assertMessage, dismissMenu } from '../../common/shared';
import {
  checkTaskPreview,
  getTaskPreview,
  visitTasks,
} from '../../common/tasks';

describe('project tasks', () => {
  //ensures a clear state before starting the tests 
  beforeEach(() => {
    //cleans the backend
    //export const tasks = generateTestDataObject('task');
    tasks.clean({ failOnStatusCode: false });
    tasks
      .generateStandard()  //generates standard DB
      //generateStandard() is defined in the project here cypress/common/apiCalls/testData/testData
      .then(console.log)  //ver los datos que devuelve: usuarios, proyectos, IDS, nombres
      .then((r) => r.body) 
      .then(({ users, projects }) => {
        login(users[0].username); //once the Data is generated, take the 1st User & log in
        const testProject = projects.find(
          ({ name }) => name === 'Project with tasks'
        );
        visitTasks(testProject.id); //go to the Project Task view
      });
    waitForGlobalLoading();
  });

  it('shows project tasks correctly', () => {
    cy.gcy('task-item').should('have.length', 2);
    cy.gcy('task-item').contains('Translate task').should('be.visible');
    cy.gcy('task-item').contains('Review task').should('be.visible');

    cy.gcy('task-item')
      .contains('Translate task')
      .closestDcy('task-item')
      .findDcy('task-item-detail')
      .click();

    cy.gcy('task-detail-keys').contains(2).should('be.visible');
    cy.gcy('task-detail-words').contains(4).should('be.visible');
    cy.gcy('task-detail-characters').contains(26).should('be.visible');


   cy.gcy('task-detail-author').should('be.visible');

   cy.gcy('task-detail').find('button').contains('Cancel task').click();
   cy.get("[aria-describedby='alert-dialog-description']").find('button').contains('Confirm').click();

   cy.gcy('task-detail-close').click();
  });

  


  function getTaskByNumber(number: number) {
    return cy
      .gcy('task-number')
      .contains('#' + number)
      .should('be.visible')
      .closestDcy('task-item');
  }
});

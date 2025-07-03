import {
  createTestProject,
  deleteProject,
  enableNamespaces,
  login,
} from '../../common/apiCalls/common';
import { HOST } from '../../common/constants';


describe('Projects Basics', () => {
  let projectId: number;
  beforeEach(() => {
    login().then(() =>
      createTestProject().then((r) => {
        projectId = r.body.id;
      })
    );
  });

  afterEach(() => {
    deleteProject(projectId);
  });

  it('updates project settings', () => {
    cy.visit(`${HOST}/projects/${projectId}/manage/edit`);
    cy.gcy('project-settings-name').find('input').clear().type('New name');

    cy.gcy('project-settings-description')
      .find('textarea')
      .first()
      .type('Test description');

    cy.gcy('default-namespace-select').should('not.exist');
    cy.gcy('project-settings-use-namespaces-checkbox').click();
    cy.gcy('default-namespace-select').should('be.visible');

  });

});

import { expect } from 'chai';
import { step } from 'mocha-steps';
import Renderer from '../../../../client/testHelpers/Renderer';
import Routes from '../../../../client/app/Routes';

describe('Diary UI works', () => {
  const renderer = new Renderer({});
  let app;
  let content;

  step('Diary page renders on mount', () => {
    app = renderer.mount(Routes);
    renderer.history.push('/diary');
    content = app.find('#content');
    expect(content).to.not.be.empty;
  });
});

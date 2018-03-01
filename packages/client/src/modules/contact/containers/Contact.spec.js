import { expect } from 'chai';
import { step } from 'mocha-steps';
import Renderer from '../../../../src/testHelpers/Renderer';
import Routes from '../../../../src/app/Routes';

describe('Contact UI works', () => {
  const renderer = new Renderer({});
  let app;
  let content;

  step('Contact page renders on mount', () => {
    app = renderer.mount(Routes);
    renderer.history.push('/contact');
    content = app.find('#content');
    expect(content).to.not.be.empty;
  });
});

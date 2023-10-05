import React from 'react';
import {JSDOM} from 'jsdom';
import {createRoot} from 'react-dom/client';
import {act} from 'react-dom/test-utils';

const mockDOM = () => {
  // We could use jest-jsdom --->
  //  /* @jest-environment jsdom \n @jest-environment-options {"runScripts": "dangerously", "resources": "usable"} */
  // However, with explicit JSDOM usage we can even insert a `debugger` statement in the real script to analyze problems
  // such as the one with the missing URL.createObjectURL() function.
  const dom = new JSDOM('<!DOCTYPE html><html lang="en"><body /></html>', {
    resources: 'usable',
    runScripts: 'dangerously'
  });
  global.window = dom.window;
  global.document = dom.window.document;
  global.window.URL.createObjectURL = jest.fn(() => 'the-url');
  const $root = document.createElement('div');
  $root.innerHTML = '<div id="root"></div>';
  global.document.body.append($root);
  return $root;
};

describe('gatsby-ssr integration test suite', () => {
  let gatsbySsr;
  let headComponents;
  let setHeadComponents;
  let postBodyComponents;
  let setPostBodyComponents;
  let $root;
  let render;
  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    $root = mockDOM();
    gatsbySsr = require('../gatsby-ssr');
    headComponents = [];
    postBodyComponents = [];
    setHeadComponents = components => headComponents.push(...components);
    setPostBodyComponents = components => postBodyComponents.push(...components);
    render = async options => {
      gatsbySsr.onRenderBody({setHeadComponents, setPostBodyComponents}, options);
      return act(() => {
        const root = createRoot($root);
        root.render(<>
          <div key='head' id='head'>{headComponents}</div>
          <div key='body' id='body'>{postBodyComponents}</div>
        </>);
      });
    };
  });
  afterEach(() => {
    $root.remove();
  });
  describe('Production', () => {
    let getEnv;
    beforeEach(() => {
      getEnv = () => 'production';
    });
    describe('without src', () => {
      beforeEach(async () => {
        await render({dataWebsiteId: 'THE-ID', getEnv});
      });
      test('should not add head components', () => {
        expect(window.document.getElementById('head').innerHTML).toBe('');
      });
      test('should not add body components', () => {
        expect(window.document.getElementById('body').innerHTML).toBe('');
      });
    });
    describe('without dataWebsiteId', () => {
      beforeEach(async () => {
        await render({src: 'https://analytics.example.com/script.js', getEnv});
      });
      test('should not add head components', () => {
        expect(window.document.getElementById('head').innerHTML).toBe('');
      });
      test('should not add body components', () => {
        expect(window.document.getElementById('body').innerHTML).toBe('');
      });
    });
    describe('with dataWebsiteId and src', () => {
      beforeEach(async () => {
        await render({src: 'https://analytics.example.com/script.js', dataWebsiteId: 'THE-ID', getEnv});
      });
      test('should add async script', () => {
        expect(window.document.querySelector('#body script[src]').getAttribute('async'))
          .toBe('');
      });
      test('should add deferred script', () => {
        expect(window.document.querySelector('#body script[src]').getAttribute('defer'))
          .toBe('');
      });
      test('should add src', () => {
        expect(window.document.querySelector('#body script[src]').getAttribute('src'))
          .toBe('https://analytics.example.com/script.js');
      });
      test('should add data-website-id', () => {
        expect(window.document.querySelector('#body script[src]').getAttribute('data-website-id'))
          .toBe('THE-ID');
      });
    });
    describe('with optional arguments', () => {
      beforeEach(async () => {
        await render({
          src: 'https://analytics.example.com/script.js',
          dataWebsiteId: 'THE-ID',
          dataHostUrl: 'https://stats.example.com',
          dataDomains: 'https://www.example.com,https://www2.example.com',
          getEnv});
      });
      test('should add data-host-url', () => {
        expect(window.document.querySelector('#body script[src]').getAttribute('data-host-url'))
          .toBe('https://stats.example.com');
      });
      test('should add data-domains', () => {
        expect(window.document.querySelector('#body script[src]').getAttribute('data-domains'))
          .toBe('https://www.example.com,https://www2.example.com');
      });
    });
  });
});

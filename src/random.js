import MD5 from 'crypto-js/md5';
import { lipsum } from './lipsum.js';

const shuffle = (list) => {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = list[i];
    list[i] = list[j];
    list[j] = temp;
  }
  return list;
};

const randomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max + 1);
  return Math.floor(Math.random() * (max - min) + min);
};

const randomString = (length) => {
  const characters ='abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const semiRandomScope = (name) => {
  return ['legacy'].includes(name.toLowerCase())
    ? 'deprecated'
    : ['testgroup', 'mytestproject', 'my learning group', 'gitlab instance', 'application operations'].includes(name.toLowerCase())
      ? 'excluded'
      : 'deferred';
};

export const randomApp = (app) => {
  const scope = (!!app.scope)
    ? app.scope
    : semiRandomScope(app.name);
  const nightly = ((!!app.score) && ('nightly' in app.score))
    ? app.score.nightly
    : (scope === 'deferred')
      ? randomInt(0, 1)
      : 0;
  const sonarqube = (('score' in app) && ('sonarqube' in app.score))
    ? app.score.sonarqube
    : (!!nightly) ? randomInt(0, 1) : 0;
  return {
    ...app,
    category: ['api', 'web', 'ios', 'android'][randomInt(0, 3)],
    description: lipsum[randomInt(0, (lipsum.length - 1))].toLowerCase(),
    languages: shuffle(['c#', 'java', 'javascript']).slice(randomInt(0, 2)),
    repositories: [`https://gitlab.omantel.om/${(!!app.group) ? app.group.toLowerCase() : 'omantel'}/${app.name.toLowerCase().replaceAll('/', '_').replaceAll(' ', '_')}`],
    environments: ['dev', 'uat', 'prod'],
    contributors: [...Array(randomInt(3, 9)).keys()].map((i) => (MD5(randomString(randomInt(6, 9))).toString().slice(0, 8))),
    score: {
      unified: 1,
      nightly,
      sonarqube,
      ...(!!sonarqube) && {
        vulnerabilities: randomInt(0, 9),
        coverage: randomInt(10, 99),
        issues: randomInt(0, 50),
        duplications: randomInt(0, 9)
      }
    },
    scope,
  };
};

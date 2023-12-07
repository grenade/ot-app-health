import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';

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



function randomString(length) {
  const characters ='abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const scoreMap = {
  unified: ['danger', 'success'],
  nightly: ['danger', 'success'],
  sonarqube: ['danger', 'success'],
  vulnerabilities: [...Array(10).keys()].map((i) => (
    (i < 1)
      ? 'success'
      : (i < 3)
        ? 'info'
        : (i < 7)
          ? 'warning'
          : 'danger'
  )),
  coverage: [...Array(100).keys()].map((i) => (
    (i < 30)
      ? 'danger'
      : (i < 60)
        ? 'warning'
        : 'success'
  )),
  issues: [...Array(100).keys()].map((i) => (
    (i < 3)
      ? 'success'
      : (i < 20)
        ? 'info'
        : (i < 40)
          ? 'warning'
          : 'danger'
  )),
  duplications: [...Array(10).keys()].map((i) => (
    (i < 3)
      ? 'info'
      : (i < 7)
        ? 'warning'
        : 'danger'
  )),
};

const lipsum = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  'Fusce tempus erat sed lacus hendrerit vestibulum',
  'Mauris vitae orci ac ex sodales condimentum ut eget tortor',
  'In eleifend risus nec cursus varius',
  'Quisque id pharetra nibh, sed dictum augue',
  'Nunc quis sodales risus',
  'Donec interdum, enim sed fringilla scelerisque, arcu felis venenatis mauris, ac volutpat ante erat sit amet est',
  'Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus',
  'Cras eget faucibus mi',
  'Nam vehicula felis nec bibendum volutpat',
  'Phasellus congue, felis nec ullamcorper cursus, ante arcu molestie metus, vel dignissim enim lacus non risus',
  'Nulla eu massa nec odio mollis semper',
  'Vivamus tincidunt vulputate orci, egestas sodales nunc aliquam egestas',
  'Cras sit amet augue et dolor mattis tincidunt',
  'Etiam fringilla finibus odio non gravida',
  'Mauris sodales nibh leo, quis ullamcorper nunc gravida varius',
  'Nam sed dui neque',
  'Nunc urna ipsum, bibendum in tortor a, tincidunt malesuada ipsum',
  'Praesent sed ex ac nisi vehicula pellentesque',
  'Pellentesque euismod et lorem ac ultricies',
  'Pellentesque consectetur velit quis erat maximus egestas',
  'In elementum facilisis nibh, vitae posuere justo sodales condimentum',
  'Nunc quis volutpat mi, aliquet hendrerit dolor',
  'Curabitur suscipit rhoncus metus vel aliquam',
  'Nam purus purus, tristique vitae ultricies eleifend, euismod et metus',
  'Cras dignissim tortor a sem lacinia vulputate',
  'Integer quis dui nec justo maximus venenatis vel sit amet lorem',
  'Integer luctus augue congue lorem semper, quis accumsan neque porttitor',
  'Duis dapibus in metus ut egestas',
  'Nam accumsan ex eget felis fermentum vehicula',
  'Nunc sed iaculis lorem',
  'Sed augue leo, efficitur vitae sapien sed, rutrum pellentesque ex',
  'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas',
  'Sed congue mi justo, ut semper dui porttitor eget',
  'Quisque et nibh leo',
  'Quisque et nisi a turpis placerat sagittis id quis eros',
  'Suspendisse fermentum, diam sit amet bibendum cursus, justo ipsum euismod arcu, et lobortis risus libero a nulla',
  'Aenean dictum metus elit, sed ultrices tortor blandit tristique',
  'Phasellus in blandit erat',
  'Sed mollis urna erat, vitae tempus urna sodales eu',
  'Donec quis laoreet ante',
  'Nam neque nunc, volutpat commodo tellus a, volutpat molestie neque',
  'Ut venenatis nisl non libero porttitor, nec pellentesque felis dictum',
  'Sed a consectetur neque',
  'Donec mattis aliquet ante, vel fermentum mauris aliquet eu',
  'Nulla venenatis est nec ligula viverra vestibulum',
  'Duis mollis urna a venenatis posuere',
  'Aliquam in euismod lorem',
  'Morbi viverra, velit eget malesuada sodales, lectus libero accumsan purus, non eleifend nunc neque nec ante',
  'Etiam non ultricies risus, vel pulvinar leo',
  'Sed eu leo sed enim lacinia porttitor',
  'Suspendisse id tortor leo',
  'Fusce sed vestibulum risus',
  'Sed eu volutpat ante',
  'Quisque imperdiet in justo in tempor',
  'Praesent quis tortor a felis maximus auctor at id dui',
  'Vestibulum fermentum laoreet dolor, vel accumsan tellus cursus sed',
  'Aenean sed luctus justo, a semper turpis',
  'Etiam vel eros sit amet lorem efficitur maximus vel a ex',
  'Nullam fringilla diam ex',
  'Morbi neque nulla, varius a scelerisque in, fermentum volutpat risus'
];

const ApplicationList = () => {
  const [applications, setApplications] = useState(undefined);
  useEffect(() => {
    fetch(`/apps.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setApplications(data.map((a) => {
          const nightly = randomInt(0, 1);
          const sonarqube = (!!nightly) ? randomInt(0, 1) : 0;
          return {
            ...a,
            category: ['api', 'web', 'ios', 'android'][randomInt(0, 3)],
            description: lipsum[randomInt(0, (lipsum.length - 1))].toLowerCase(),
            languages: shuffle(['c#', 'java', 'javascript']).slice(randomInt(0, 2)),
            repositories: [`https://gitlab.omantel.om/${(!!a.group) ? a.group.toLowerCase() : 'omantel'}/${a.name.toLowerCase().replaceAll('/', '_').replaceAll(' ', '_')}`],
            environments: ['dev', 'uat', 'prod'],
            contributors: [...Array(randomInt(3, 9)).keys()].map((i) => (randomString(randomInt(6, 9)))),
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
          };
        }).map((a) => ({
          ...a,
          maturity: (
            (a.score.unified * 0.25)
            + (a.score.nightly * 0.25)
            + (a.score.sonarqube * 0.25)
            + (
                (!!a.score.sonarqube)
                  ? (
                      ((100 / (a.score.vulnerabilities + 1)) / 100 * 0.25)
                      + ((100 / (a.score.issues + 1)) / 100 * 0.25)
                      + ((100 / (a.score.duplications + 1)) / 100 * 0.25)
                      + (a.score.coverage / 100 * 0.25)
                    )
                  : 0
              ) * 0.25
          ),
        })).sort((a, b) => (
          (a.maturity > b.maturity)
            ? 1
            : (a.maturity < b.maturity)
              ? -1
              : 0
        )).reverse());
        console.log(data);
      })
      .catch((error) => console.log(error));
  }, []);
  return (
    <div>
      <h1>ci/cd application maturity matrix</h1>
      {
        (!!applications)
          ? (
              <Accordion defaultActiveKey={0}>
                {
                  applications.map((application, aI) => (
                    <Accordion.Item key={aI} eventKey={aI}>
                      <Accordion.Header>
                        <Col>
                          <Badge style={{ marginRight: '0.4em' }}>
                            {(application.maturity * 100).toFixed(1)} %
                          </Badge>
                          &nbsp;
                          {
                            (!!application.group && application.group !== application.name)
                              ? (
                                  <span style={{marginRight: '0.2em'}}>
                                    {application.group.toLowerCase()} /
                                  </span>
                                )
                              : null
                          }
                          {application.name.toLowerCase()}
                        </Col>
                        <Col xs={8}>
                          <Stack direction="horizontal" gap={2} style={{ width: '100%', display: 'block' }} className="justify-content-end">
                            {
                              Object.keys(application.score).map((key) => (
                                <Badge key={key} bg={scoreMap[key][application.score[key]]} style={{ marginRight: '0.4em' }}>
                                  {key}: {
                                    (['unified', 'nightly', 'sonarqube'].includes(key))
                                      ? (
                                          (!!application.score[key]) ? '✔': '✘')
                                      : (
                                          <span>{application.score[key]}{(key === 'coverage' ? '%' : null)}</span>
                                        )
                                  }
                                </Badge>
                              ))
                            }
                          </Stack>
                        </Col>
                      </Accordion.Header>
                      <Accordion.Body>
                        {
                          Object.keys(application).filter((key) => !['group', 'name', 'score'].includes(key)).map((key) => (
                            <span key={key}>
                              {key}: {
                                (Array.isArray(application[key]) && !!application[key].length)
                                  ? (
                                      <ul>
                                        {
                                          application[key].map((item, i) => (
                                            <li key={i}>
                                              {item}
                                            </li>
                                          ))
                                        }
                                      </ul>
                                    )
                                  : (
                                      <span>
                                        {
                                          (key === 'maturity')
                                            ? (application[key].toFixed(3))
                                            : application[key]
                                        }
                                        <br />
                                      </span>
                                    )
                              }
                            </span>
                          ))
                        }
                      </Accordion.Body>
                    </Accordion.Item>
                  ))
                }
              </Accordion>
            )
          : null
      }
    </div>
  );
}

export default ApplicationList;
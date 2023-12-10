import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { randomApp } from './random.js';
import { scoreMap, scoreApp } from './score.js';

const sortApps = (a, b) => (
  (a.maturity > b.maturity)
    ? 1
    : (a.maturity < b.maturity)
      ? -1
      : 0
);

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
    .then((data) => setApplications(data.map(randomApp).map(scoreApp).sort(sortApps).reverse()))
    .catch(console.error);
  }, []);
  return (
    <div>
      <h1>ci/cd application maturity matrix</h1>
      {
        (!!applications)
          ? (
              <Tabs defaultActiveKey="scheduled" className="mb-3">
                {
                  //[...new Set(applications.map((a) => a.scope))].map((scope, sI) => (
                  ['scheduled', 'deferred', 'excluded', 'deprecated'].map((scope, sI) => (
                    <Tab key={sI} eventKey={scope} title={scope}>
                      <Accordion>
                        {
                          applications.filter((a) => a.scope === scope).map((application, aI) => (
                            <Accordion.Item key={aI} eventKey={aI}>
                              <Accordion.Header>
                                <Col xs={1}>
                                  {(aI + 1)}
                                </Col>
                                <Col xs={1}>
                                  <Badge style={{ marginRight: '0.4em' }}>
                                    {(application.maturity * 100).toFixed(1)} %
                                  </Badge>
                                </Col>
                                <Col>
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
                                <Col xs={7}>
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
                    </Tab>
                  ))
                }
              </Tabs>
            )
          : null
      }
    </div>
  );
}

export default ApplicationList;

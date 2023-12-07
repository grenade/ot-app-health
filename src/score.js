export const scoreMap = {
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

export const scoreApp = (app) => ({
  // calculate overall maturity score based on all other scores
  ...app,
  maturity: (
    (app.score.unified * 0.25) // 0.25 for being in gitlab
    + (app.score.nightly * 0.25) // 0.25 for having a nightly build
    + (app.score.sonarqube * 0.25) // 0.25 for having sonarqube scores
    + (
        (!!app.score.sonarqube)
          ? (
              ((100 / (app.score.vulnerabilities + 1)) / 100 * 0.25)
              + ((100 / (app.score.issues + 1)) / 100 * 0.25)
              + ((100 / (app.score.duplications + 1)) / 100 * 0.25)
              + (app.score.coverage / 100 * 0.25)
            )
          : 0
      ) * 0.25
  ),
});

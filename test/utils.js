import fs from 'fs';
import N3 from 'n3';
import { QueryEngine } from '@comunica/query-sparql';

const loadRDF = filePath => new Promise((onDone, onError) => {
  const store = new N3.Store();
  const parser = new N3.Parser();
  const rdfStream = fs.createReadStream(filePath, { encoding: 'utf8' });
  parser.parse(rdfStream, (error, quad) => {
    if (error) {
      console.log(error);
    }
    if (quad) {
      store.addQuad(quad);
    } else {
      onDone(store);
    }
  });
});

const executeSPARQLTest = async (testSuite, testPath) => {
  const store = await loadRDF(`${testPath}/after.ttl`);
  const query = fs.readFileSync(`${testSuite}/test.sparql`, { encoding: 'utf8' });
  const myEngine = new QueryEngine();
  return myEngine.queryBoolean(query, { sources: [store] });
};

const executeReportTest = async (testSuite, testPath) => {
  const reportSuite = JSON.parse(fs.readFileSync(`${testSuite}/report.json`, { encoding: 'utf8' }));
  const reportPath = JSON.parse(fs.readFileSync(`${testPath}/report.json`, { encoding: 'utf8' }));
  expect(reportSuite.added).toBe(reportPath.added);
  expect(reportSuite.removed).toBe(reportPath.removed);
  expect(reportSuite.updated).toBe(reportPath.updated);
  expect(reportSuite.addedURIs.length).toBe(reportPath.addedURIs.length);
  expect(reportSuite.removedURIs.length).toBe(reportPath.removedURIs.length);
  expect(reportSuite.updatedURIs.length).toBe(reportPath.updatedURIs.length);
  expect(reportSuite.addedURIs).toEqual(expect.arrayContaining(reportPath.addedURIs));
  expect(reportSuite.removedURIs).toEqual(expect.arrayContaining(reportPath.removedURIs));
  expect(reportSuite.updatedURIs).toEqual(expect.arrayContaining(reportPath.updatedURIs));
};

export const runTests = async (testSuite, testPath) => {
  describe('Running testsuite', () => {
    const tests = fs.readdirSync(testSuite);
    for (let t of tests) {
      test(t, async () => {
        expect(await executeSPARQLTest(`${testSuite}/${t}`, `${testPath}/${t}`)).toBeTruthy();
        executeReportTest(`${testSuite}/${t}`, `${testPath}/${t}`);
      });
    }
  });
};

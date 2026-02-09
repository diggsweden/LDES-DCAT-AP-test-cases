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

  // Get all entity types from both reports
  const entityTypes = new Set([...Object.keys(reportSuite), ...Object.keys(reportPath)]);
  const defaults = { added: 0, removed: 0, updated: 0, unchanged: 0, addedURIs: [], removedURIs: [], updatedURIs: [] };

  for (const entityType of entityTypes) {
    const suiteCounts = reportSuite[entityType] || { ...defaults };
    const pathCounts = reportPath[entityType] || { ...defaults };

    expect(suiteCounts.added).toBe(pathCounts.added);
    expect(suiteCounts.removed).toBe(pathCounts.removed);
    expect(suiteCounts.updated).toBe(pathCounts.updated);
    expect(suiteCounts.addedURIs.length).toBe(pathCounts.addedURIs.length);
    expect(suiteCounts.removedURIs.length).toBe(pathCounts.removedURIs.length);
    expect(suiteCounts.updatedURIs.length).toBe(pathCounts.updatedURIs.length);
    expect(suiteCounts.addedURIs).toEqual(expect.arrayContaining(pathCounts.addedURIs));
    expect(suiteCounts.removedURIs).toEqual(expect.arrayContaining(pathCounts.removedURIs));
    expect(suiteCounts.updatedURIs).toEqual(expect.arrayContaining(pathCounts.updatedURIs));
  }
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

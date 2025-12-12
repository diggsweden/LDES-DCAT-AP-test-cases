# Test cases for harvesting DCAT-AP via LDES

The tests in the testsuite are located in subfolders `test1`-`test27` in the `testsuite` folder.
Each folder contains:

* `before.ttl` - how the RDF should look before applying LDES
* `after.ttl` - how the RDF should look after applying LDES
* `report.json` - a report of what happens when applying LDES
* `feed.trig` - the LDES feed to apply
* `test.sparql` - the SPARQL ASK query that will be used to check the significant changes in `after.ttl`

## What the tests do

A self-check can be executed by running `npm run test`, it checks that `after.ttl` is correct by running the `test.sparql` query.

Note it is the responsibility of this testsuite to verify different LDES DCAT-AP implementations, not implement it itself. Hence, each implementation should implement a testing procedure for every test:

1. pre-populate a graph from `before.ttl`
2. run the LDES DCAT-AP feed in `feed.trig`
3. record the resulting graph in `custom/testX/after.ttl`
4. record the report in `custom/testX/report.json`

After this is done, run `npm run testCustom` to verify that the implementation works according to the tests. The verification does the following:

1. checks that the `after.ttl` is correct by running the SPARQL ASK query.
2. checks that the `report.json` is correct by comparing it to the expected values for each test in the testsuite.

## The tests (work in progress)

1. Adding a catalog
2. Updating metadata for a catalog
3. Adding a dataset to an existing catalog
4. Updating a dataset
5. Removing a dataset
6. Adding a distribution
7. Updating a distribution
8. Removing a distribution
9. Adding a data service
10. Adding a data service with a connection to an existing dataset
11. Adding a data service connected to a not yet existing dataset
12. Updating a data service
13. Updating a data service to connect it to a not yet existing dataset
14. Removing a data service
15. Removing a dataset to which a data service is connected
16. Adding a distribution with a connection to an existing data service
17. Adding a distribution with a connection to a not yet existing data service
18. Updating a distribution to connect it to an existing data service
19. Updating a distribution to connect it to a not yet existing data service
20. Adding a contact point
21. Updating a contact point
22. Removing a contact point
23. Adding an agent
24. Updating an agent
25. Removing an agent
26. Accepting non-dcat specific metadata, e.g. stuff from GeoDCAT
27. Updates that are at the exact same time

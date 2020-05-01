import ClusterCounter from "./ClusterCounter";

test("verify that cluster counter works", () => {
  let points = createSimulatedPoints();
  let clusterCounter = new ClusterCounter(points, "cell_ontology_class");
  let clusterCounts = clusterCounter.getClusterCounts();

  //  Expected:  Map(2) { 'C1' => 2, 'C2' => 1 }
  expect(clusterCounts.get("C1")).toBe(2);
  expect(clusterCounts.get("C2")).toBe(1);

  let clusterCountRanked = clusterCounter.getClusterCountsRanked();
  expect(clusterCountRanked[0].numCells).toBe(2);
  expect(clusterCountRanked[0].clusterName).toBe("C1");
  expect(clusterCountRanked[1].numCells).toBe(1);
  expect(clusterCountRanked[1].clusterName).toBe("C2");
});

/**
 * Simulated Points Data
 */
function createSimulatedPoints(): object {
  let point1 = {
    cell_ontology_class: "C1",
    clusters_leiden: "L1",
  };
  let point2 = {
    cell_ontology_class: "C1",
    clusters_leiden: "L1",
  };
  let point3 = {
    cell_ontology_class: "C2",
    clusters_leiden: "L1",
  };
  let points = {
    1: point1,
    2: point2,
    3: point3,
  };
  return points;
}

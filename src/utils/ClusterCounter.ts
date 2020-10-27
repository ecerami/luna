import ClusterCount from "./ClusterCount";
import { LunaData } from "./LunaData";

/**
 * Counts Number of Cells/Points in each cluster.
 */
class ClusterCounter {
  private clusterCounts = new Map<string, number>();
  private clusterCountsRanked = new Array<ClusterCount>();
  private totalNumPoints = 0;

  /**
   * Constructor.
   */
  constructor(points: Array<LunaData>, targetClusterName: string) {
    this.countClusters(points, targetClusterName);
    this.rankClusters();
  }

  /**
   * Counts number of cells/points in each cluster.
   */
  private countClusters(points: Array<LunaData>, targetClusterName: string) {
    for (let key in points) {
      this.totalNumPoints += 1;
      let point = points[key];
      for (let clusterKey in point.clusters) {
        let currentCluster = point.clusters[clusterKey];
        if (currentCluster.name === targetClusterName) {
          let currentCount = this.clusterCounts.get(currentCluster.value);
          if (currentCount) {
            this.clusterCounts.set(currentCluster.value, currentCount + 1);
          } else {
            this.clusterCounts.set(currentCluster.value, 1);
          }
        }
      }
    }
  }

  /**
   * Ranks the clusters by count.
   */
  private rankClusters() {
    this.clusterCounts.forEach((count: number, key: string) => {
      if (count) {
        let clusterCount = new ClusterCount(
          key,
          count,
          count / this.totalNumPoints
        );
        this.clusterCountsRanked.push(clusterCount);
      }
    });
    this.clusterCountsRanked.sort((n1, n2) => {
      if (n1.numCells > n2.numCells) {
        return -1;
      } else if (n1.numCells < n2.numCells) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  public getClusterCounts() {
    return this.clusterCounts;
  }

  public getClusterCountsRanked() {
    return this.clusterCountsRanked;
  }
}

export default ClusterCounter;

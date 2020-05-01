import ClusterCount from "./ClusterCount";

interface Points {
  [key: string]: any;
}

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
  constructor(points: Points, targetCluster: string) {
    this.countClusters(points, targetCluster);
    this.rankClusters();
  }

  /**
   * Counts number of cells/points in each cluster.
   */
  private countClusters(points: Points, targetCluster: string) {
    for (let key in points) {
      let currentCluster = points[key][targetCluster];
      if (currentCluster !== undefined) {
        this.totalNumPoints += 1;
        let currentCount = this.clusterCounts.get(currentCluster);
        if (currentCount !== undefined) {
          this.clusterCounts.set(currentCluster, currentCount + 1);
        } else {
          this.clusterCounts.set(currentCluster, 1);
        }
      }
    }
  }

  /**
   * Ranks the clusters by count.
   */
  private rankClusters() {
    this.clusterCounts.forEach((count: number, key: string) => {
      if (count !== undefined) {
        let clusterCount = new ClusterCount(
          key,
          count,
          count / this.totalNumPoints
        );
        this.clusterCountsRanked.push(clusterCount);
      }
    });
    this.clusterCountsRanked.sort((n1,n2) => {
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

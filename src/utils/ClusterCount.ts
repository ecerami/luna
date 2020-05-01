/**
 * Encapsulates number of cells/points in each cluster category.
 */
class ClusterCount {
    clusterName: string;
    numCells: number;
    percentage: number;
  
    constructor(clusterName: string, numCells: number, percentage: number) {
      this.clusterName = clusterName;
      this.numCells = numCells;
      this.percentage = percentage;
    }
  }

  export default ClusterCount;
// TODO:  CLEAN THIS ALL UP
export interface LunaData {
    position?: number[];
    index_id: number;
    clusters: Cluster[];
}

export interface Cluster {
    name:  string;
    value: string;
}

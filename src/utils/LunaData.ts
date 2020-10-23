// TODO:  CLEAN THIS ALL UP
export interface LunaData {
    position?: number[];
    index_id: number;
    screenCoord?: number[];
    clusters: Cluster[];
    genes:    Gene[];
}

export interface Cluster {
    name:  string;
    value: string;
}

export interface Gene {
    gene:  string;
    value: string;
}
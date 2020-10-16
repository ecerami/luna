export interface LunaData {
    position?: number[];
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
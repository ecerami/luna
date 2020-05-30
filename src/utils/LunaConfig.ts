export interface LunaConfig {
    h5ad:         string;
    label:        string;
    description:  string;
    vignettes:    Vignette[];
    center_x:     number;
    center_y:     number;
    default_zoom: number;
    gene_stats:   GeneStat[];
}

export interface GeneStat {
    gene:           string;
    max_expression: number;
}

export interface Vignette {
    key:              string;
    label:            string;
    description:      string;
    color_map:        string;
    color_by:         string;
    color_key:        string;
    cluster_keys:     string[];
    center_x:         number;
    center_y:         number;
    zoom:             number;
    clusters:         Cluster[];
    three_d?:         boolean;
    hex_bin_size?:    number;
    pitch?:           number;
    elevation_scale?: number;
}

export interface Cluster {
    cluster_name: string;
    cluster_list: ClusterList[];
}

export interface ClusterList {
    cluster_value: string;
    min:           number;
    q1:            number;
    median:        number;
    q3:            number;
    max:           number;
}
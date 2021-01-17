export interface Coordinate {
  position: number[];
  indexId: number;
}

export interface Annotation {
  slug: string;
  label: string;
}

export interface Bucket {
  slug: string;
  name: string;
  description: string;
  url: string;
}

export interface Vignette {
  slug: string;
  label: string;
  description: string;
  gene?: string;
  colorBy?: string;
  active?: Array<string>;
  hexBinRadius?: number;
  elevationBy?: string;
  elevationScale?: number;
}

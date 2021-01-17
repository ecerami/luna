/**
 * Encapsualates Bucket and Vignette State.
 */

import { Bucket } from "../utils/LunaData";
import { Vignette } from "../utils/LunaData";

class BucketState {
  bucketList = new Array<Bucket>();
  vignetteMap = new Map<string, Array<Vignette>>();

  addBucket(bucket: Bucket): void {
    this.bucketList.push(bucket);
  }

  setVignetteList(bucketSlug: string, vignetteList: Array<Vignette>): void {
    this.vignetteMap.set(bucketSlug, vignetteList);
  }
}

export default BucketState;

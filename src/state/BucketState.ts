import { Bucket } from "../utils/LunaData";
import { Vignette } from "../utils/LunaData";

/**
 * Encapsualates Bucket and Vignette State.
 */
class BucketState {
  bucketList = new Array<Bucket>();
  vignetteMap = new Map<string, Map<string, Vignette>>();

  /**
   * Adds a new bucket to state.
   * @param bucket Bucket.
   */
  addBucket(bucket: Bucket): void {
    this.bucketList.push(bucket);
  }

  /**
   * Sets a new Vignette.
   * @param bucketSlug Bucket Slug.
   * @param vignetteSlug Vigette Slug.
   * @param vignette Vignette Object.
   */
  setVignette(
    bucketSlug: string,
    vignetteSlug: string,
    vignette: Vignette
  ): void {
    let vignettes = this.vignetteMap.get(bucketSlug);
    if (vignettes === undefined) {
      vignettes = new Map<string, Vignette>();
      this.vignetteMap.set(bucketSlug, vignettes);
    }
    console.log("Adding:  " + vignetteSlug);
    vignettes.set(vignetteSlug, vignette);
  }
}

export default BucketState;

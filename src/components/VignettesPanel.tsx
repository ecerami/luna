import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { observable } from "mobx";
import { observer } from "mobx-react";
import LunaState from "../state/LunaState";
import { Bucket } from "../utils/LunaData";
import { Vignette } from "../utils/LunaData";
import BucketState from "../state/BucketState";

@observer
class VignettesPanel extends React.Component<{}, {}> {
  @observable vignettesLoaded = false;
  bucketState: BucketState = new BucketState();

  /**
   * Gets the Initial Luna Data via Web API.
   */
  componentDidMount(): void {
    axios({
      method: "get",
      url: LunaState.BASE_SERVER_URL + "/buckets",
    })
      .then((res) => this.initBuckets(res.data))
      .catch(() => alert("Failed to load Data Buckets."));
  }

  /**
   * Inits the Data Buckets.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initBuckets(json: any): void {
    for (const item of json) {
      const bucket: Bucket = {
        slug: item["slug"],
        name: item["name"],
        description: item["description"],
        url: item["url"],
      };
      this.bucketState.addBucket(bucket);
      axios({
        method: "get",
        url: LunaState.BASE_SERVER_URL + "/vignettes/" + bucket.slug,
      })
        .then((res) => this.initVignetteList(bucket.slug, res.data))
        .catch(() =>
          alert("Failed to load vignettes for: " + bucket.slug + ".")
        );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initVignetteList(bucketSlug: string, json: any): void {
    const vignetteList = Array<Vignette>();
    for (const item of json["vignettes"]) {
      const vignette: Vignette = {
        slug: item["slug"],
        label: item["label"],
        description: item["description"],
      };
      vignetteList.push(vignette);
    }
    this.bucketState.setVignetteList(bucketSlug, vignetteList);
    this.vignettesLoaded = true;
  }

  render(): JSX.Element {
    if (this.vignettesLoaded) {
      const bucketList = this.getBucketList();
      return <div className="content">{bucketList}</div>;
    } else {
      return (
        <div>
          <br />
          <img alt="loading" src="/img/loading.gif" />
        </div>
      );
    }
  }

  getBucketList(): JSX.Element[] {
    const items: Array<JSX.Element> = [];
    for (const bucket of this.bucketState.bucketList) {
      const key1 = bucket.slug;
      const key2 = bucket.slug + "_description";
      const key3 = bucket.slug + "_vignette_list";
      items.push(<h3 key={key1}>{bucket.name}</h3>);
      items.push(<p key={key2}>{bucket.description}</p>);
      const vignetteList = this.getVignetteList(bucket.slug);
      if (vignetteList.length > 0) {
        items.push(<ul key={key3}>{vignetteList}</ul>);
      }
    }
    return items;
  }

  getVignetteList(bucketSlug: string): JSX.Element[] {
    const items: Array<JSX.Element> = [];
    const vignetteList = this.bucketState.vignetteMap.get(bucketSlug);
    if (vignetteList !== undefined) {
      for (const vignette of vignetteList) {
        const url = "/luna/" + bucketSlug + "/vignette/" + vignette.slug;
        items.push(
          <li key={url}>
            <Link to={url}>{vignette.label}</Link>
          </li>
        );
      }
    }
    return items;
  }
}

export default VignettesPanel;

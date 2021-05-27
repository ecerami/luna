import React from "react";

import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import LunaState from "../state/LunaState";
import { Vignette } from "../utils/LunaData";

@observer
class VignettesPanel extends React.Component<{}, {}> {
  lunaState: LunaState = LunaState.getInstance();

  render(): JSX.Element {
    if (this.lunaState.vignettesLoaded) {
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
    for (const bucket of this.lunaState.bucketState.bucketList) {
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
    const vignetteMap = this.lunaState.bucketState.vignetteMap.get(bucketSlug);
    if (vignetteMap !== undefined) {
      vignetteMap.forEach((vignette: Vignette) => {
        const url = "/luna/" + bucketSlug + "/vignette/" + vignette.slug;
        items.push(
          <li key={url}>
            <Link to={url}>{vignette.label}</Link>
          </li>
        );
      });      
    }
    return items;
  }
}

export default VignettesPanel;

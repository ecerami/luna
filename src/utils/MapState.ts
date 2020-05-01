/**
 * Encapsualates Map State.
 */
import { observable } from "mobx";
class MapState {
    static HEX_BIN_RADIUS_DEFAULT = 7000;
    static ELEVATION_SCALE_DEFAULT = 100;

    @observable hexBinRadius = MapState.HEX_BIN_RADIUS_DEFAULT;
    @observable elevationScale = MapState.ELEVATION_SCALE_DEFAULT;
    @observable checked3D = false;
}

export default MapState;
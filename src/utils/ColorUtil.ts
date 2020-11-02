/**
 * Misc. Color Utility Functions
 */
class ColorUtil {

  /**
   * Converts Hex Color to RGB Color.
   * @param hex Hex Color.
   */
  public static hexToRgb(hex: string) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		if (result !== null) {
			return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), 255];
		} else {
			return [0, 0, 0, 255];
		}
	}
}

export default ColorUtil;

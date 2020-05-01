class StringUtils {
  static MAX_LENGTH = 25;

  /**
   * Truncate or Pad HTML String;
   */
  public static truncateOrPadString(str: string) {
    if (str === "nan") {
      str = "not specified";
    }
    let nameLen = str.length;
    if (nameLen > StringUtils.MAX_LENGTH) {
      str = str.substr(0, StringUtils.MAX_LENGTH - 3) + "...";
    } else {
      for (let i = 0; i < StringUtils.MAX_LENGTH - nameLen; i++) {
        str += "&nbsp;";
      }
    }
    return str;
  }
}

export default StringUtils;

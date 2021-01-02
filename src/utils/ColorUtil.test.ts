import ColorUtil from "./ColorUtil";

test("text conversion of hex to RGB", () => {
  let rgbList = ColorUtil.hexToRgb("a6cee3");
  expect(rgbList[0]).toBe(166);
  expect(rgbList[1]).toBe(206);
  expect(rgbList[2]).toBe(227);
  expect(rgbList[3]).toBe(255);
});

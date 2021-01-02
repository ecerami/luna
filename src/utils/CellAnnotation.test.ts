import CellAnnotation from "./CellAnnotation";

test("verify state changes for cell annotation", () => {
  let orderedValueList: Array<string> = ["a", "a", "b", "a", "d", "c", "c"];
  let uniqueCategoryList: Array<string> = ["a", "b", "c", "d"];

  let annotation = new CellAnnotation(
    "tissue",
    orderedValueList,
    uniqueCategoryList,
    4
  );

  //  Verify five categories (4+default)
  expect(annotation.getUniqueCategoryList().length).toBe(5);

  //  Verify that default is active
  expect(annotation.isCategoryActive(CellAnnotation.OTHER_DEFAULT_KEY)).toBe(
    true
  );
  expect(annotation.getNumActiveCategories()).toBe(1);

  //  Verify that I can only set three categories to active
  expect(annotation.setCategoryActive("a", true)).toBe(true);
  expect(annotation.getNumActiveCategories()).toBe(2);
  expect(annotation.isCategoryActive("a")).toBe(true);
  expect(annotation.isCategoryActive("b")).toBe(false);
  expect(annotation.setCategoryActive("b", true)).toBe(true);
  expect(annotation.getNumActiveCategories()).toBe(3);
  expect(annotation.setCategoryActive("c", true)).toBe(true);
  expect(annotation.getNumActiveCategories()).toBe(4);
  expect(annotation.setCategoryActive("d", true)).toBe(false);
  expect(annotation.getNumActiveCategories()).toBe(4);

  //  Now try to inactivate c, and activate d
  expect(annotation.setCategoryActive("c", false)).toBe(true);
  expect(annotation.getNumActiveCategories()).toBe(3);
  expect(annotation.setCategoryActive("d", true)).toBe(true);
  expect(annotation.getNumActiveCategories()).toBe(4);

  // Now try with categories that don't exist
  expect(annotation.setCategoryActive("z", true)).toBe(false);
  expect(annotation.getNumActiveCategories()).toBe(4);
});

test("verify active color changes", () => {
  let orderedValueList: Array<string> = ["a", "a", "b", "a", "d", "c", "c"];
  let uniqueCategoryList: Array<string> = ["a", "b", "c", "d"];

  let annotation = new CellAnnotation(
    "tissue",
    orderedValueList,
    uniqueCategoryList,
    3
  );

  // Check at beginning, we should only have one (default) color.
  let colorList = annotation.getActiveColorListHex();
  expect(colorList.length).toBe(1);
  expect(colorList[0]).toBe(CellAnnotation.OTHER_DEFAULT_COLOR);

  // Now activate a, and verify that we have two colors.
  annotation.setCategoryActive("a", true);
  let colorHexList = annotation.getActiveColorListHex();
  expect(colorHexList.length).toBe(2);
  expect(colorHexList[0]).toBe("#a6cee3");
  expect(colorHexList[1]).toBe(CellAnnotation.OTHER_DEFAULT_COLOR);

  // Verify RGB Colors also work
  let colorRGBList = annotation.getActiveColorListRGB();
  expect(colorRGBList.length).toBe(2);
  expect(colorRGBList[0][0]).toBe(166);
  expect(colorRGBList[0][1]).toBe(206);
  expect(colorRGBList[0][2]).toBe(227);
  expect(colorRGBList[0][3]).toBe(255);
});

test("verify active colors", () => {
  let orderedValueList: Array<string> = ["a", "a", "b", "a", "d", "c", "c"];
  let uniqueCategoryList: Array<string> = ["a", "b", "c", "d"];

  let annotation = new CellAnnotation(
    "tissue",
    orderedValueList,
    uniqueCategoryList,
    3
  );

  // Check at beginning, we should only have one (default) color.
  let defaultColorIndex = annotation.getCategoryIndexColor(
    CellAnnotation.OTHER_DEFAULT_KEY
  );
  expect(defaultColorIndex).toBe(0);

  // Now activate b, and verify that we have two colors.
  annotation.setCategoryActive("b", true);
  let bColorIndex = annotation.getCategoryIndexColor("b");
  expect(bColorIndex).toBe(0);
  defaultColorIndex = annotation.getCategoryIndexColor(
    CellAnnotation.OTHER_DEFAULT_KEY
  );
  expect(defaultColorIndex).toBe(1);

  // Now activate a, and verify that we have three colors.
  annotation.setCategoryActive("a", true);
  let aColorIndex = annotation.getCategoryIndexColor("a");
  expect(aColorIndex).toBe(0);
  bColorIndex = annotation.getCategoryIndexColor("b");
  expect(bColorIndex).toBe(1);
  defaultColorIndex = annotation.getCategoryIndexColor(
    CellAnnotation.OTHER_DEFAULT_KEY
  );
  expect(defaultColorIndex).toBe(2);
});

test("verify color schemes", () => {
  let orderedValueList: Array<string> = ["a", "a", "b", "a", "d", "c", "c"];
  let uniqueCategoryList: Array<string> = ["a", "b", "c", "d"];

  let annotation = new CellAnnotation(
    "tissue",
    orderedValueList,
    uniqueCategoryList,
    3
  );
  let colorSchemeList = annotation.getValidColorSchemes();
  expect(colorSchemeList.length).toBe(3);
  expect(colorSchemeList[0]).toBe("Paired");
  expect(() => annotation.setCurrentColorScheme("Accents")).toThrow(
    "Invalid color scheme:  Accents"
  );

  annotation.setCategoryActive("a", true);
  annotation.setCategoryActive("b", true);
  let colorList = annotation.getActiveColorListHex();
  expect(colorList[0]).toBe("#a6cee3");
  expect(colorList[2]).toBe("#bbbbbb");
  annotation.setCurrentColorScheme("Set1");
  colorList = annotation.getActiveColorListHex();
  expect(colorList[0]).toBe("#e41a1c");
  expect(colorList[2]).toBe("#bbbbbb");
});

test("verify color voting", () => {
  let orderedValueList: Array<string> = ["a", "a", "b", "a", "d", "c", "c"];
  let uniqueCategoryList: Array<string> = ["a", "b", "c", "d"];
  let cellIdList1: Array<number> = [0, 1, 3, 4];
  let cellIdList2: Array<number> = [2, 5, 6];
  let cellIdList3: Array<number> = [0, 1, 5, 6];
  let annotation = new CellAnnotation(
    "tissue",
    orderedValueList,
    uniqueCategoryList,
    3
  );
  let mostFrequentCategory = annotation.getMostFrequentCategory(cellIdList1);
  expect(mostFrequentCategory).toBe("a");
  mostFrequentCategory = annotation.getMostFrequentCategory(cellIdList2);
  expect(mostFrequentCategory).toBe("c");
  mostFrequentCategory = annotation.getMostFrequentCategory(cellIdList3);
  expect(mostFrequentCategory).toBe("a");

  let colorIndex = annotation.getColorIndex(cellIdList1);
  expect(colorIndex).toBe(0);
  annotation.setCategoryActive("a", true);
  colorIndex = annotation.getColorIndex(cellIdList1);
  expect(colorIndex).toBe(0);
  colorIndex = annotation.getColorIndex(cellIdList2);
  expect(colorIndex).toBe(1);
});

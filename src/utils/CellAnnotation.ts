import ColorUtil from "./ColorUtil";
import { observable } from "mobx";
import colorbrewer from "colorbrewer";

/**
 * Encapsulates Cell Annotations.
 *
 * Each individual cell can be annotated with 0 or more annotations.  For
 * example, cell X is derived from a lung tissue, or cell X is derived
 * from a male subject, etc.
 */
class CellAnnotation {
  public static readonly DEFAULT_MAX_ACTIVE_CATEGORIES = 8;
  public static readonly OTHER_DEFAULT_COLOR = "#bbbbbb";
  public static readonly OTHER_DEFAULT_KEY = "Other / Default";
  private slug: string;
  private label: string;
  private orderedValueList: Array<string>;
  private uniqueCategoryList: Array<string>;
  private uniqueCategorySet: Set<string>;
  private activeColorListHex: Array<string>;
  private activeColorListRGB: Array<Array<number>>;
  private maxActiveCategories = CellAnnotation.DEFAULT_MAX_ACTIVE_CATEGORIES;
  @observable private categoryToColorIndexMap: Map<string, number>;
  @observable private categoryActiveSet: Set<string>;

  /**
   * Constructor.
   * @param slug annotation slug, e.g. "sub_tissue".
   * @param label annotation label, e.g. "Sub Tissue".
   * @param orderedValueList Ordered List of Values.
   * @param uniqueValuesList Unique List of Categories.
   */
  constructor(
    slug: string,
    label: string,
    orderedValueList: Array<string>,
    uniqueCategoryList: Array<string>,
    maxActiveCategories: number
  ) {
    this.slug = slug;
    this.label = label;
    this.orderedValueList = orderedValueList;
    this.uniqueCategoryList = uniqueCategoryList;
    this.categoryActiveSet = new Set<string>();

    //  Always add the default / other category
    this.uniqueCategorySet = new Set<string>();
    this.uniqueCategoryList.push(CellAnnotation.OTHER_DEFAULT_KEY);

    for (const category of this.uniqueCategoryList) {
      this.uniqueCategorySet.add(category);
    }

    this.activeColorListHex = [];
    this.activeColorListRGB = [];
    this.categoryToColorIndexMap = new Map();
    this.maxActiveCategories = maxActiveCategories;

    //  Activate the default category
    this.setCategoryActive(CellAnnotation.OTHER_DEFAULT_KEY, true);
    this.updateActiveColorList();
  }

  /**
   * Gets the Annotation Label.
   */
  public getLabel(): string {
    return this.label;
  }

  /**
   * Sets the specified category as active/inactive.
   * Active categories are displayed or highlighted within the UI.
   * Boolean return value indicates success/failure.
   * @param category Category Name.
   * @param activeState Active State.
   */
  public setCategoryActive(category: string, activeState: boolean): boolean {
    let success = false;
    if (this.uniqueCategorySet.has(category)) {
      if (
        activeState &&
        this.categoryActiveSet.size < this.maxActiveCategories
      ) {
        this.categoryActiveSet.add(category);
        success = true;
      } else if (activeState === false) {
        if (this.categoryActiveSet.has(category)) {
          this.categoryActiveSet.delete(category);
          success = true;
        }
      }
    }
    if (success) {
      this.updateActiveColorList();
    }
    return success;
  }

  /**
   * Gets active/inactive state for the specified category.
   * @param category Category Name.
   */
  public isCategoryActive(category: string): boolean {
    if (this.categoryActiveSet.has(category)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Gets Number of Active Categories.
   */
  public getNumActiveCategories(): number {
    return this.categoryActiveSet.size;
  }

  /**
   * Gets the Unique Category List.
   */
  public getUniqueCategoryList(): Array<string> {
    return this.uniqueCategoryList;
  }

  /**
   * Gets the Active Color List in Hex Format.
   */
  public getActiveColorListHex(): Array<string> {
    return this.activeColorListHex;
  }

  /**
   * Gets the Active Color List in RGB Format.
   */
  public getActiveColorListRGB(): Array<Array<number>> {
    return this.activeColorListRGB;
  }

  /**
   * Gets the Index Color Associated with the Target Category.
   */
  public getCategoryIndexColor(category: string): number | undefined {
    return this.categoryToColorIndexMap.get(category);
  }

  /**
   * Gets color index, based on majority vote.
   */
  public getColorIndex(cellIdList: Array<number>): number | undefined {
    const winningCategory = this.getMostFrequentCategory(cellIdList);
    if (winningCategory && this.isCategoryActive(winningCategory)) {
      return this.categoryToColorIndexMap.get(winningCategory);
    } else {
      return this.activeColorListHex.length - 1;
    }
  }

  /**
   * Gets Most Frequent Category in the Cell ID List.
   * @param cellIdList Cell ID List.
   */
  public getMostFrequentCategory(
    cellIdList: Array<number>
  ): string | undefined {
    const voteMap: Map<string, number> = new Map<string, number>();
    for (let i = 0; i < cellIdList.length; i++) {
      const cellIndexId: number = cellIdList[i];
      const currentCategory = this.orderedValueList[cellIndexId];
      if (voteMap.has(currentCategory)) {
        const currentNumVotes = voteMap.get(currentCategory);
        if (currentNumVotes !== undefined) {
          voteMap.set(currentCategory, currentNumVotes + 1);
        }
      } else {
        voteMap.set(currentCategory, 1);
      }
    }
    return this.getWinningCategory(voteMap);
  }

  /**
   * Gets the Winning Category.
   * @param voteMap VoteMap.
   */
  private getWinningCategory(voteMap: Map<string, number>): string | undefined {
    let winningCategory = undefined;
    let maxVotes = 0;
    voteMap.forEach((value: number, key: string) => {
      if (value > maxVotes) {
        maxVotes = value;
        winningCategory = key;
      }
    });
    return winningCategory;
  }

  /**
   * Updates the Active Color List, based on Active Categories.
   */
  private updateActiveColorList(): void {
    this.activeColorListHex = colorbrewer.Paired[9];
    this.activeColorListHex = this.activeColorListHex.slice(
      0,
      this.categoryActiveSet.size - 1
    );

    // Add the default/other color
    this.activeColorListHex.push(CellAnnotation.OTHER_DEFAULT_COLOR);

    // Update the corresponding RGB Array
    this.activeColorListRGB = [];
    for (const colorHex of this.activeColorListHex) {
      this.activeColorListRGB.push(ColorUtil.hexToRgb(colorHex));
    }

    //  Update the color lookup maps
    this.updateColorLookUpMaps();
  }

  /**
   * Update the Color Index Look Up Map.
   */
  private updateColorLookUpMaps(): void {
    let colorIndex = 0;
    for (const category of this.uniqueCategoryList) {
      if (this.isCategoryActive(category)) {
        this.categoryToColorIndexMap.set(category, colorIndex++);
      }
    }
  }
}

export default CellAnnotation;

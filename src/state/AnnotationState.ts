/**
 * Encapsulates Annotation State.
 */
import { observable } from "mobx";
import axios from "axios";
import Luna from "../Luna";
import CellAnnotation from "../utils/CellAnnotation";

class AnnotationState {
	// List of all cell annotation keys.
	@observable annotationKeyList: Array<string> = new Array<string>();

	// The currently selected annotation key
	@observable selectedAnnotationKey?: string = undefined;

	// Show/Hide the dialog picker
	@observable showAnnotationDialogPicker = false;

	// Map of all cell annotations.
	@observable cellAnnotationMap = new Map<String, CellAnnotation>();

	/**
	 * Load Data for the Specified Annotation.
	 * @param annotationKey Annotation Key.
	 */
	loadAnnotationData(annotationKey: string) {
		let geneURL = Luna.BASE_URL + "/clusters/" + annotationKey + ".json";
		axios({
			method: "get",
			url: geneURL,
		})
			.then((res) => this.initAnnotationData(annotationKey, res.data))
			.catch((error) => console.log(error));
	}

	/**
	 * Init Data for the Specified Annotation.
	 * @param annotationKey Annotation Key.
	 * @param json JSON Content.
	 */
	initAnnotationData(annotationKey: string, json: any) {
		let cellAnnotation = new CellAnnotation(
			annotationKey,
			json["ordered_values"],
			json["unique_sorted"],
			CellAnnotation.DEFAULT_MAX_ACTIVE_CATEGORIES
		);
		this.cellAnnotationMap.set(annotationKey, cellAnnotation);
		this.showAnnotationDialogPicker = true;
	}
}

export default AnnotationState;

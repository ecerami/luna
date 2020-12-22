/**
 * Encapsulates Annotation State.
 */
import { observable } from "mobx";
import axios from "axios";
import Luna from "../Luna";
import CellAnnotation from "../utils/CellAnnotation";
import { Annotation } from "../utils/LunaData";

class AnnotationState {
	// List of all cell annotations
	@observable annotationList: Array<Annotation> = new Array<Annotation>();

	// The currently selected annotation ID
	@observable selectedAnnotationId?: number = undefined;

	// Show/Hide the dialog picker
	@observable showAnnotationDialogPicker = false;

	// Map of all cell annotations.
	@observable cellAnnotationMap = new Map<number, CellAnnotation>();

	/**
	 * Load Data for the Specified Annotation.
	 * @param annotationKey Annotation Key.
	 */
	loadAnnotationData(annotationId: number) {
		let geneURL = Luna.BASE_SERVER_URL + "/annotation/" + annotationId;
		axios({
			method: "get",
			url: geneURL,
		})
			.then((res) => this.initAnnotationData(annotationId, res.data))
			.catch((error) => console.log(error));
	}

	/**
	 * Init Data for the Specified Annotation.
	 * @param annotationKey Annotation Key.
	 * @param json JSON Content.
	 */
	initAnnotationData(annotationId: number, json: any) {
		let cellAnnotation = new CellAnnotation(
			json["label"],
			json["values_ordered"],
			json["values_distinct"],
			CellAnnotation.DEFAULT_MAX_ACTIVE_CATEGORIES
		);
		this.cellAnnotationMap.set(annotationId, cellAnnotation);
		this.showAnnotationDialogPicker = true;
	}
}

export default AnnotationState;

/**
 * Encapsulates Annotation State.
 */
import { observable } from "mobx";
import axios from "axios";
import CellAnnotation from "../utils/CellAnnotation";
import { Annotation } from "../utils/LunaData";
import LunaState from "./LunaState";

class AnnotationState {
	// List of all cell annotations
	@observable annotationList: Array<Annotation> = new Array<Annotation>();

	// The currently selected annotation slug
	@observable selectedAnnotationSlug?: string = undefined;

	// Show/Hide the dialog picker
	@observable showAnnotationDialogPicker = false;

	// Map of all cell annotations.
	@observable cellAnnotationMap = new Map<string, CellAnnotation>();

	/**
	 * Load Data for the Specified Annotation.
	 * @param annotationKey Annotation Slug.
	 */
	loadAnnotationData(bucketSlug: string, annotationSlug: string) {
		let geneURL = LunaState.BASE_SERVER_URL + "/annotation/" 
			+ bucketSlug + "/" + annotationSlug;
		axios({
			method: "get",
			url: geneURL,
		})
			.then((res) => this.initAnnotationData(annotationSlug, res.data))
			.catch((error) => console.log(error));
	}

	/**
	 * Init Data for the Specified Annotation.
	 * @param annotationKey Annotation Key.
	 * @param json JSON Content.
	 */
	initAnnotationData(annotationSlug: string, json: any) {
		let cellAnnotation = new CellAnnotation(
			json["slug"],
			json["label"],
			json["values_ordered"],
			json["values_distinct"],
			CellAnnotation.DEFAULT_MAX_ACTIVE_CATEGORIES
		);
		this.cellAnnotationMap.set(annotationSlug, cellAnnotation);
		this.showAnnotationDialogPicker = true;
	}
}

export default AnnotationState;

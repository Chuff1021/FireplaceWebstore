import modelReferences from "../../data/parts-model-references.json";
export const partsModels = modelReferences;
export function modelsForPart(key: string) { return partsModels.filter(model => model.parts.some(part => part.key === key)); }

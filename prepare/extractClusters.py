import h5py
import json
import sys
import numpy as np

# Parse Category/Cluster File
def parseCategoryFile (unsFile, clusterMap):
    fileName = unsFile.name.replace("/uns/", "")
    fileName = fileName.replace("_categories", "")
    clusterList = unsFile[0:len(unsFile)]
    clusterMap[fileName] = clusterList

# Count Number of Unique Categories
def countUniqueCategories(key, clusterMap):
    uniqueCategorySet = {}
    cellList = clusterMap[key]
    for i in range(0, len(cellList)):
        currentCategory = cellList[i]
        uniqueCategorySet[currentCategory] = 1
    return (len(uniqueCategorySet))

# Dump CSV Content
def dumpCsv(cellList):
    index = 0
    currentCell = cellList[0]
    keys = currentCell.keys()
    line = "id,"
    for key in keys:
        if key == "x":
            line += ("point_latitude,")
        elif key == "y":
            line += ("point_longitude,")
        else:
            line += ("%s," % key)
    print (line[0:len(line)-1])

    for currentCell in cellList:
        keys = currentCell.keys()
        line = "%d," % index
        for key in keys:
            if key == "x" or key == "y":
                line += ("%.12f," % currentCell[key])
            else:
                line += ("%s," % currentCell[key])
        print (line[0:len(line)-1])
        index +=1

# Generate Cell List
def generateCellList(umap, clusterValuesMap, clusterMap, targetGene):
    cellList = []
    for i in range(0, len(umap)):
        currentCell = {}
        #currentCell["x"] = umap[i][0]
        #currentCell["y"] = umap[i][1]
        currentCell["position"] = [umap[i][0], umap[i][1]]
        for key in clusterValuesMap:
            values = clusterValuesMap[key]
            if key in clusterMap:
                categoryMap = clusterMap[key]
                currentCell[key] = categoryMap[values[i]]
            elif key == targetGene:
                currentCell[key] = str(values[i])
        cellList.append(currentCell)
    return cellList

# Gets the Gene Index
def getGeneIndex(f, targetGene):
    varDataSet = f['var']
    geneSymbols = varDataSet["index"]
    geneIndex = np.where(geneSymbols == targetGene.encode())
    return (geneIndex[0][0])

# Parse H5AD File
def parseH5ad(fileName, targetGene, fileType):
    clusterMap = {}
    f = h5py.File(fileName, 'r')

    # Assume that we have an obsm file w/ UMap Coordinates
    obsm = f['obsm']
    umap = obsm["X_umap"]

    # Extract Categories
    uns = f['uns']
    unsFileList = list(uns.keys())
    for unsFile in unsFileList:
        if (unsFile.endswith("_categories")):
            parseCategoryFile (uns[unsFile], clusterMap)

    # Assume that we have an obs file w/ Cluster Assignments
    obs = f['obs']
    fieldNames = obs.dtype.fields.keys()

    # Extract Cluster Values
    clusterValuesMap = {}
    for field in fieldNames:
        clusterValuesMap[field] = obs[field]

    # Get the gene index and extract expression values for target gene
    targetGeneIndex = getGeneIndex(f, targetGene)
    clusterValuesMap[targetGene] = f['X'][:,targetGeneIndex]

    # Extract all the info into an array of cells
    cellList = generateCellList(umap, clusterValuesMap, clusterMap, targetGene)

    if (fileType == "json"):
        j = json.dumps(cellList, indent=4)
        print(j)
    else:
        dumpCsv(cellList)

# Open the specified h5ad file
fileName = sys.argv[1]
targetGene = sys.argv[2]
fileType = sys.argv[3]
parseH5ad(fileName, targetGene, fileType)

import h5py
import json
import sys

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
def generateCellList(umap, clusterValuesMap, clusterMap):
    cellList = []
    for i in range(0, len(umap)):
        currentCell = {}
        currentCell["x"] = umap[i][0]
        currentCell["y"] = umap[i][1]
        for key in clusterValuesMap:
            values = clusterValuesMap[key]
            try:
                categoryMap = clusterMap[key]
                currentCell[key] = categoryMap[values[i]]
            except KeyError:
                pass
        cellList.append(currentCell)
    return cellList

# Parse H5AD File
def parseH5ad(fileName, fileType):
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

    # Extract all the info
    cellList = generateCellList(umap, clusterValuesMap, clusterMap)

    if (fileType == "json"):
        j = json.dumps(cellList, indent=4)
        print(j)
    else:
        dumpCsv(cellList)

# Open the specified h5ad file
fileName = sys.argv[1]
fileType = sys.argv[2]
parseH5ad(fileName, fileType)

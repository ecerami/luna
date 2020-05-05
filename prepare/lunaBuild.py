import h5py, json, sys, argparse, yaml, os
import numpy as np

# Parse Category/Cluster File
def parse_category_file (uns_file, cluster_map):
    file_name = uns_file.name.replace("/uns/", "")
    file_name = file_name.replace("_categories", "")
    cluster_list = uns_file[0:len(uns_file)]
    cluster_map[file_name] = cluster_list

# Count Number of Unique Categories
def count_unique_categories(key, cluster_map):
    unique_category_set = {}
    cell_list = cluster_map[key]
    for i in range(0, len(cell_list)):
        current_category = cell_list[i]
        unique_category_set[current_category] = 1
    return (len(unique_category_set))

# Dump CSV Content
def dump_csv(cell_list):
    index = 0
    current_cell = cell_list[0]
    keys = current_cell.keys()
    line = "id,"
    for key in keys:
        if key == "x":
            line += ("point_latitude,")
        elif key == "y":
            line += ("point_longitude,")
        else:
            line += ("%s," % key)
    print (line[0:len(line)-1])

    for current_cell in cell_list:
        keys = current_cell.keys()
        line = "%d," % index
        for key in keys:
            if key == "x" or key == "y":
                line += ("%.12f," % current_cell[key])
            else:
                line += ("%s," % current_cell[key])
        print (line[0:len(line)-1])
        index +=1

# Generate Cell List
def generate_cell_list(umap, cluster_values_map, cluster_map, gene_list):
    cell_list = []
    for i in range(0, len(umap)):
        current_cell = {}
        current_cell["position"] = [umap[i][0], umap[i][1]]
        for key in cluster_values_map:
            values = cluster_values_map[key]
            if key in cluster_map:
                category_map = cluster_map[key]
                current_cell[key] = category_map[values[i]]
            elif key in gene_list:
                current_cell[key] = str(values[i])
        cell_list.append(current_cell)
    return cell_list

# Gets the Gene Index
def get_gene_index(f, target_gene):
    var_data_set = f['var']
    gene_symbols = var_data_set["index"]
    gene_index = np.where(gene_symbols == target_gene.encode())
    return (gene_index[0][0])

# Parse H5AD File
def parse_h5ad(file_name, gene_list, file_type):
    cluster_map = {}
    f = h5py.File(file_name, 'r')

    # Assume that we have an obsm file w/ UMap Coordinates
    obsm = f['obsm']
    umap = obsm["X_umap"]

    # Extract Categories
    uns = f['uns']
    uns_file_list = list(uns.keys())
    for uns_file in uns_file_list:
        if (uns_file.endswith("_categories")):
            parse_category_file (uns[uns_file], cluster_map)

    # Assume that we have an obs file w/ Cluster Assignments
    obs = f['obs']
    field_names = obs.dtype.fields.keys()

    # Extract Cluster Values
    cluster_values_map = {}
    for field in field_names:
        cluster_values_map[field] = obs[field]

    # Get the gene index and extract expression values for target gene
    for gene in gene_list:
        target_gene_index = get_gene_index(f, gene)
        cluster_values_map[gene] = f['X'][:,target_gene_index]

    # Extract all the info into an array of cells
    cell_list = generate_cell_list(umap, cluster_values_map, cluster_map, gene_list)
    return cell_list

parser = argparse.ArgumentParser(description='A command line tool for building Luna Single Cell Vignettes.')
parser.add_argument("-c", dest='config_path', help="path to Luna config file", action="store", default="luna.yaml")
parser.add_argument("-o", dest='out_path', help="path to Luna build directory", action="store", default="build")
parser.add_argument("-d", dest='data_format_type', help="data format type", action="store", default="json")
args = parser.parse_args()

luna_config = open(args.config_path)
data = yaml.load(luna_config, Loader=yaml.CLoader)

print ("Preparing Luna Build...")
print ("--------------------------")
print ("Parsing Luna Config File: %s" % args.config_path)

h5ad_file_name = data["h5ad"]
print ("Target h5ad File:  %s" % h5ad_file_name)
print ("Data Format Type:  %s" % args.data_format_type)

gene_list = []
for vignette in data ["vignettes"]:
    color_by = vignette["color-by"]
    if color_by:
        if color_by == "gene_expression":
            color_key = vignette["color-key"]
            gene_list.append(color_key)

print ("Total number of genes identified:  %d" % len(gene_list))
for gene in gene_list:
    print (" - " + gene)

cellList = parse_h5ad(h5ad_file_name, gene_list, args.data_format_type)

# Create the output dir, if it doesn't exit
if not os.path.isdir(args.out_path):
    os.mkdir(args.out_path)

# Output the Data
if (args.data_format_type == "json"):
    out_file_name = os.path.join(args.out_path, "lunaData.json")
    print ("Writing data to:  %s." % out_file_name)
    with open(out_file_name, 'w') as out_file:
        json.dump(cellList, out_file, indent=4)
else:
    print ("Data format not supported:  %s." % args.data_format_type)
    #dumpCsv(cellList)

# Output the Config File

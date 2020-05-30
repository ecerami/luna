import h5py
import json
import sys
import argparse
import yaml
import os
import numpy as np
import pandas as pd


def parse_category_file(uns_file, cluster_map):
    file_name = uns_file.name.replace("/uns/", "")
    file_name = file_name.replace("_categories", "")
    cluster_list = uns_file[0:len(uns_file)]
    cluster_map[file_name] = cluster_list


def count_unique_categories(key, cluster_map):
    unique_category_set = {}
    cell_list = cluster_map[key]
    for i in range(0, len(cell_list)):
        current_category = cell_list[i]
        unique_category_set[current_category] = 1
    return (len(unique_category_set))


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
    print(line[0:len(line)-1])

    for current_cell in cell_list:
        keys = current_cell.keys()
        line = "%d," % index
        for key in keys:
            if key == "x" or key == "y":
                line += ("%.12f," % current_cell[key])
            else:
                line += ("%s," % current_cell[key])
        print(line[0:len(line)-1])
        index += 1


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


def get_gene_index(f, target_gene):
    var_data_set = f['var']
    gene_symbols = var_data_set["index"]
    gene_index = np.where(gene_symbols == target_gene.encode())
    return (gene_index[0][0])


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
            parse_category_file(uns[uns_file], cluster_map)

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
        cluster_values_map[gene] = f['X'][:, target_gene_index]

    # Extract all the info into an array of cells
    cell_list = generate_cell_list(
        umap, cluster_values_map, cluster_map, gene_list)
    return cell_list


def extract_gene_list(luna_config):
    gene_list = []
    for vignette in luna_config["vignettes"]:
        color_by = vignette["color_by"]
        if color_by:
            if color_by == "gene_expression":
                color_key = vignette["color_key"]
                if color_key not in gene_list:
                    gene_list.append(color_key)
    return gene_list


def write_data_file(out_path, data_format_type, cell_list):
    # Output the Data
    if (data_format_type == "json"):
        out_file_name = os.path.join(out_path, "lunaData.json")
        print("Writing data to:  %s." % out_file_name)
        with open(out_file_name, 'w') as out_file:
            json.dump(cell_list, out_file, indent=4)
    else:
        print("Data format not supported:  %s." % data_format_type)
        # dumpCsv(cellList)


def luna_build_console(luna_config_file_name, h5ad_file_name, data_format_type, gene_list):
    print("Preparing Luna Build...")
    print("--------------------------")
    print("Parsing Luna Config File: %s" % luna_config_file_name)
    print("Target h5ad File:  %s" % h5ad_file_name)
    print("Data Format Type:  %s" % data_format_type)
    print("Total number of genes identified:  %d" % len(gene_list))
    for gene in gene_list:
        print(" - " + gene)


def write_luna_config(luna_config, out_path):
    out_file_name = os.path.join(out_path, "lunaConfig.json")
    print("Writing config to:  %s." % out_file_name)
    with open(out_file_name, 'w') as out_file:
        json.dump(luna_config, out_file, indent=4)


def get_cli_args():
    parser = argparse.ArgumentParser(
        description='A command line tool for building Luna Single Cell Vignettes.')
    parser.add_argument("-c", dest='config_path',
                        help="path to Luna config file", action="store", default="luna.yaml")
    parser.add_argument("-o", dest='out_path',
                        help="path to Luna build directory", action="store", default="build")
    parser.add_argument("-d", dest='data_format_type',
                        help="data format type", action="store", default="json")
    return parser.parse_args()

def get_center(cell_list):
    min_x = 0
    max_x = 0
    min_y = 0
    max_y = 0
    for cell in cell_list:
        position = cell["position"]
        x = position[0]
        y = position[1]
        min_x = min(x, min_x)
        min_y = min(y, min_y)
        max_x = max(x, max_x)
        max_y = max(y, max_y)
    center_x = max_x - (max_x - min_x) / 2
    center_y = max_y - (max_y - min_y) / 2
    return (center_x, center_y)

def get_gene_stats(cell_list, target_gene):
    max_expression = 0
    for cell in cell_list:
        current_expression = float(cell[target_gene])
        max_expression = max(current_expression, max_expression)
    return {
        "gene":  target_gene,
        "max_expression":  max_expression
    }

def get_gene_stats_list(cell_list, gene_list):
    gene_stats = []
    for gene in gene_list:
        gene_stats.append(get_gene_stats(cell_list, gene))
    return gene_stats

def assess_clusters(luna_config, out_path):
    json_file_name = os.path.join(out_path, "lunaData.json")
    cells_df = pd.read_json (json_file_name)
    for vignette in luna_config["vignettes"]:
        if "cluster_keys" in vignette:
            cluster_global_list = []
            target_gene = vignette["color_key"]
            for cluster_key in vignette["cluster_keys"]:
                print ("processing vignette cluster:  %s" % cluster_key)
                cluster_list = []
                exp_df = cells_df.groupby(by=cluster_key)[target_gene].describe()
                exp_df.sort_values(by=["50%"], inplace=True, ascending=False)
                for i, j in exp_df.iterrows(): 
                    stats = {
                        "cluster_value": i,
                        "min": j["min"],
                        "q1": j["25%"],
                        "median": j["50%"],
                        "q3": j["75%"],
                        "max": j["max"]
                    }
                    cluster_list.append(stats)
                cluster_global_list.append({
                    "cluster_name":  cluster_key,
                    "cluster_list": cluster_list
                })
            vignette["clusters"] = cluster_global_list

args = get_cli_args()

# Read in the Config YAML
luna_config_file_name = open(args.config_path)
luna_config = yaml.load(luna_config_file_name, Loader=yaml.CLoader)

h5ad_file_name = luna_config["h5ad"]
gene_list = extract_gene_list(luna_config)

# Create the output dir, if it doesn't exit
if not os.path.isdir(args.out_path):
    os.mkdir(args.out_path)

luna_build_console(args.config_path, h5ad_file_name,
                   args.data_format_type, gene_list)
cell_list = parse_h5ad(h5ad_file_name, gene_list, args.data_format_type)
write_data_file(args.out_path, args.data_format_type, cell_list)

assess_clusters(luna_config, args.out_path)
(center_x, center_y) = get_center(cell_list)
luna_config["center_x"] = center_x
luna_config["center_y"] = center_y
luna_config["default_zoom"] = 4
expression_map = get_gene_stats_list(cell_list, gene_list)
luna_config["gene_stats"] = expression_map

write_luna_config(luna_config, args.out_path)

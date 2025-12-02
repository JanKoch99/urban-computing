import numpy as np
import rasterio
from rasterio.warp import reproject, Resampling
import skfuzzy as fuzz
from skfuzzy import control as ctrl
import time
import os
from multiprocessing import Pool, cpu_count

# --- CONFIGURATION ---
fuzzy_inputs = [
    {"input_file": "../geoserver_data/data/pm10.tif", "max_value": 400, "name": "pm10", "good": [0, 0, 160],
     "moderate": [150, 230, 310], "bad": [300, 320, 400]},
    {"input_file": "../geoserver_data/data/pm25.tif", "max_value": 400, "name": "pm25", "good": [0, 0, 80],
     "moderate": [75, 160, 235], "bad": [200, 240, 400]},
    {"input_file": "../geoserver_data/data/russ.tif", "max_value": 35000, "name": "russ", "good": [0, 0, 209],
     "moderate": [205, 281, 356], "bad": [350, 360, 35000]},
    {"input_file": "../geoserver_data/data/no2.tif", "max_value": 1500, "name": "no2", "good": [0, 0, 256],
     "moderate": [250, 510, 766], "bad": [750, 775, 1500]},
    {"input_file": "../geoserver_data/data/ozon.tif", "max_value": 100, "name": "ozon", "good": [0, 0, 54],
     "moderate": [50, 74, 93], "bad": [90, 95, 100]},
    {"input_file": "../geoserver_data/data/laerm.tif", "max_value": 150, "name": "laerm", "good": [0, 0, 73],
     "moderate": [70, 80, 88], "bad": [85, 95, 150]}
]

# --- LOAD RASTERS ---
with rasterio.open(fuzzy_inputs[0]["input_file"]) as ref_src:
    ref_crs = ref_src.crs
    ref_transform = ref_src.transform
    ref_shape = ref_src.read(1).shape

rasters = {}
meta = None

for var in fuzzy_inputs:
    with rasterio.open(var["input_file"]) as src:
        data = src.read(1).astype(float)
        if src.crs != ref_crs:
            reprojected = np.zeros(ref_shape, dtype=float)
            reproject(source=data, destination=reprojected,
                      src_transform=src.transform, src_crs=src.crs,
                      dst_transform=ref_transform, dst_crs=ref_crs,
                      resampling=Resampling.bilinear)
            data = reprojected
        rasters[var["name"]] = data
        if meta is None:
            meta = src.meta.copy()
            meta.update({"crs": ref_crs, "transform": ref_transform,
                         "height": ref_shape[0], "width": ref_shape[1]})

# --- CREATE FUZZY VARIABLES ---
antecedents = {}
for var in fuzzy_inputs:
    ant = ctrl.Antecedent(np.linspace(0, var["max_value"], var["max_value"] + 1), var["name"])
    ant['good'] = fuzz.trimf(ant.universe, var['good'])
    ant['moderate'] = fuzz.trimf(ant.universe, var['moderate'])
    ant['bad'] = fuzz.trimf(ant.universe, var['bad'])
    antecedents[var['name']] = ant

# --- CONSEQUENT ---
quality = ctrl.Consequent(np.linspace(0, 100, 101), 'quality')
quality['very_good'] = fuzz.trimf(quality.universe, [0, 0, 25])
quality['good'] = fuzz.trimf(quality.universe, [20, 40, 60])
quality['liveable'] = fuzz.trimf(quality.universe, [50, 60, 70])
quality['bad'] = fuzz.trimf(quality.universe, [65, 80, 90])
quality['very_bad'] = fuzz.trimf(quality.universe, [85, 100, 100])

# --- RULES ---
pm10 = antecedents['pm10']
pm25 = antecedents['pm25']
russ = antecedents['russ']
no2 = antecedents['no2']
ozon = antecedents['ozon']
laerm = antecedents['laerm']

any_bad = pm10['bad'] | pm25['bad'] | russ['bad'] | no2['bad'] | ozon['bad'] | laerm['bad']
three_bad = ((pm10['bad'] & pm25['bad'] & russ['bad']) |
             (pm10['bad'] & pm25['bad'] & no2['bad']) |
             (pm10['bad'] & pm25['bad'] & ozon['bad']) |
             (pm10['bad'] & pm25['bad'] & laerm['bad']) |
             (pm10['bad'] & russ['bad'] & no2['bad']) |
             (pm10['bad'] & russ['bad'] & ozon['bad']) |
             (pm10['bad'] & russ['bad'] & laerm['bad']) |
             (pm10['bad'] & no2['bad'] & ozon['bad']) |
             (pm10['bad'] & no2['bad'] & laerm['bad']) |
             (pm10['bad'] & ozon['bad'] & laerm['bad']) |
             (pm25['bad'] & russ['bad'] & no2['bad']) |
             (pm25['bad'] & russ['bad'] & ozon['bad']) |
             (pm25['bad'] & russ['bad'] & laerm['bad']) |
             (pm25['bad'] & no2['bad'] & ozon['bad']) |
             (pm25['bad'] & no2['bad'] & laerm['bad']) |
             (pm25['bad'] & ozon['bad'] & laerm['bad']) |
             (russ['bad'] & no2['bad'] & ozon['bad']) |
             (russ['bad'] & no2['bad'] & laerm['bad']) |
             (russ['bad'] & ozon['bad'] & laerm['bad']) |
             (no2['bad'] & ozon['bad'] & laerm['bad']))

four_good = ((pm10['good'] & pm25['good'] & russ['good'] & no2['good']) |
(pm10['good'] & pm25['good'] & russ['good'] & ozon['good']) |
(pm10['good'] & pm25['good'] & russ['good'] & laerm['good']) |
(pm10['good'] & pm25['good'] & no2['good'] & ozon['good']) |
(pm10['good'] & pm25['good'] & no2['good'] & laerm['good']) |
(pm10['good'] & pm25['good'] & ozon['good'] & laerm['good']) |
(pm10['good'] & russ['good'] & no2['good'] & ozon['good']) |
(pm10['good'] & russ['good'] & no2['good'] & laerm['good']) |
(pm10['good'] & russ['good'] & ozon['good'] & laerm['good']) |
(pm10['good'] & no2['good'] & ozon['good'] & laerm['good']) |
(pm25['good'] & russ['good'] & no2['good'] & ozon['good']) |
(pm25['good'] & russ['good'] & no2['good'] & laerm['good']) |
(pm25['good'] & russ['good'] & ozon['good'] & laerm['good']) |
(pm25['good'] & no2['good'] & ozon['good'] & laerm['good']) |
(russ['good'] & no2['good'] & ozon['good'] & laerm['good'])
)
no_bad = ~any_bad

two_good = (
    (pm10['good'] & pm25['good']) |
    (pm10['good'] & russ['good']) |
    (pm10['good'] & no2['good']) |
    (pm10['good'] & ozon['good']) |
    (pm10['good'] & laerm['good']) |
    (pm25['good'] & russ['good']) |
    (pm25['good'] & no2['good']) |
    (pm25['good'] & ozon['good']) |
    (pm25['good'] & laerm['good']) |
    (russ['good'] & no2['good']) |
    (russ['good'] & ozon['good']) |
    (russ['good'] & laerm['good']) |
    (no2['good'] & ozon['good']) |
    (no2['good'] & laerm['good']) |
    (ozon['good'] & laerm['good'])
)


three_good = ((pm10['good'] & pm25['good'] & russ['good']) |
              (pm10['good'] & pm25['good'] & no2['good']) |
              (pm10['good'] & pm25['good'] & ozon['good']) |
              (pm10['good'] & pm25['good'] & laerm['good']) |
              (pm10['good'] & russ['good'] & no2['good']) |
              (pm10['good'] & russ['good'] & ozon['good']) |
              (pm10['good'] & russ['good'] & laerm['good']) |
              (pm10['good'] & no2['good'] & ozon['good']) |
              (pm10['good'] & no2['good'] & laerm['good']) |
              (pm10['good'] & ozon['good'] & laerm['good']) |
              (pm25['good'] & russ['good'] & no2['good']) |
              (pm25['good'] & russ['good'] & ozon['good']) |
              (pm25['good'] & russ['good'] & laerm['good']) |
              (pm25['good'] & no2['good'] & ozon['good']) |
              (pm25['good'] & no2['good'] & laerm['good']) |
              (pm25['good'] & ozon['good'] & laerm['good']) |
              (russ['good'] & no2['good'] & ozon['good']) |
              (russ['good'] & no2['good'] & laerm['good']) |
              (russ['good'] & ozon['good'] & laerm['good']) |
              (no2['good'] & ozon['good'] & laerm['good']))

rules = [ctrl.Rule(three_bad, quality['very_bad']),
         ctrl.Rule(any_bad, quality['bad']),
         ctrl.Rule(four_good, quality['very_good']),
         ctrl.Rule(two_good & no_bad, quality['good']),
         ctrl.Rule(no_bad, quality['liveable'])]

quality_ctrl = ctrl.ControlSystem(rules)

# --- Prepare flat data ---
flat_data = {v['name']: rasters[v['name']].flatten() for v in fuzzy_inputs}
first_key = next(iter(flat_data))
total = flat_data[first_key].size


# --- Function for multiprocessing ---
def evaluate_pixel(idx):
    sim = ctrl.ControlSystemSimulation(quality_ctrl)
    for var in fuzzy_inputs:
        sim.input[var['name']] = flat_data[var['name']][idx]
    try:
        sim.compute()
        return sim.output['quality']
    except:
        return np.nan


if __name__ == "__main__":
    start = time.time()
    print(f"Using {cpu_count()} CPU cores...")

    indices = list(range(total))
    flat_result = np.zeros(total, dtype=float)

    # Use multiprocessing Pool with chunksize
    with Pool() as pool:
        for i, val in enumerate(pool.imap(evaluate_pixel, indices, chunksize=1000)):
            flat_result[i] = val
            # progress
            percent = int((i / (total - 1)) * 100)
            if i % 5000 == 0:
                print(f"\rProgress: {percent}%", end='')

    print("\nDone! Time:", time.time() - start, "seconds")

    fuzzy_map = flat_result.reshape(rasters[first_key].shape)

    # --- Save TIFF ---
    output_file = "../geoserver_data/data/zurich_fuzzy_quality.tif"
    meta.update(dtype=rasterio.float32, count=1)
    with rasterio.open(output_file, 'w', **meta) as dst:
        dst.write(fuzzy_map.astype(rasterio.float32), 1)

    # --- Save Plot ---
    import matplotlib.pyplot as plt

    plt.figure(figsize=(10, 10))
    plt.imshow(fuzzy_map, cmap='RdYlGn_r')
    plt.colorbar(label='Living Quality (0=very good, 100=very bad)')
    data_in_geoserver_folder = "./data"
    preview_path = os.path.join(data_in_geoserver_folder, "zurich_fuzzy_quality_preview3.png")
    plt.savefig(preview_path, dpi=200, bbox_inches='tight')
    plt.axis('off')
    plt.show()

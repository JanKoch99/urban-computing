Urban Computing — Setup and Usage Guide

Overview
This repository combines three parts:
- Fuzzy script (Jupyter notebook) to generate the fuzzy quality cards/rasters
- Dockerized GeoServer stack to serve the data
- Frontend (React) to visualize the layers

What you need
- For the frontend
  - Node.js and npm (Node 18+ recommended)
  - A free local port for the dev server (usually 3000)

- For the fuzzy script
  - Python 3.9+ (3.10+ recommended)
  - Jupyter Notebook or JupyterLab (or VS Code with the Jupyter extension)
  - Install the Python libraries used in the notebook; if you don’t already have them, a common setup is: jupyter, numpy, pandas, matplotlib. Additional geospatial libraries may be required depending on your local environment and the notebook’s cells.

- For the GeoServer stack
  - Docker and Docker Compose
  - A free local port 8080 (for GeoServer)

Step-by-step: How to use this project
1) Get the data
  - Download the files from OneDrive
  - Put the files in ./geoserver_data/data

1.1) (Optional) If you want to also generate the SEP data you need to get the data here:
  - https://boris-portal.unibe.ch/entities/product/8fb9dd20-d609-4b09-950b-ae74d242544a
  - Then add your path to the file in the notebook at `fuzzy-script/ssepCreator.ipynb`

2) Generate the fuzzy cards if not copied from the OneDrive folder
   - Open the notebook at `fuzzy-script/FuzzyCardGenerator7.ipynb` in Jupyter (or VS Code/JupyterLab).
   - Run all cells to generate the required outputs. Follow the instructions inside the notebook for any data inputs and output locations.
   - This takes a while, so be patient (~4 hours)

3) Start the GeoServer stack
   - From the repository root, run:
     ```
     docker compose up -d
     ```
   - Wait until the containers are healthy/running.

4) Start the frontend
   - In a new terminal, navigate to the frontend folder and install dependencies:
     ```
     cd frontend
     npm install
     ```
   - Start the development server:
     ```
     npm start
     ```
   - The app will open at `http://localhost:3000` (or another port if 3000 is taken).

GeoServer access
- Web UI: `http://localhost:8080/geoserver/web/`
- Default credentials (for local development):
  - Username: `admin`
  - Password: `geoserver`
- GeoServer REST endpoint base: `http://localhost:8080/geoserver/`

Notes
- Make sure you complete step (1) before (2) and (3), so the generated data are available for serving and visualizing.
- If you change the generated data or add new layers, you may need to refresh GeoServer configuration or restart the stack depending on your setup.
- If ports 3000 or 8080 are in use, stop the other services or adjust your configuration accordingly.

Data access
https://1drv.ms/f/c/737279682432ed50/EtpFXH34bAROq5mgIQEvvy8BwP-sx6jgWnjICT3n1a2xzQ?e=nYuu6F

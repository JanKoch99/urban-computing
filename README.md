Zuerst die Dateien herunterladen und in ./data tun:

- https://data.geo.admin.ch/browser/index.html#/collections/ch.bafu.laerm-strassenlaerm_tag/items/laerm-strassenlaerm_tag?.language=en
- https://data.geo.admin.ch/browser/index.html#/collections/ch.bafu.luftreinhaltung-stickstoffdioxid/items/luftreinhaltung-stickstoffdioxid_2024?.language=en&.asset=asset-luftreinhaltung-stickstoffdioxid_2024_2056-tif


Danach den Docker starten mit:

```shell 
  docker compose up -d
```


Danach dieses Skript ausführen:

```shell
  bash init.sh
```

Alt:

Herunterladen --> https://data.geo.admin.ch/browser/index.html#/collections/ch.bafu.laerm-strassenlaerm_tag/items/laerm-strassenlaerm_tag?.language=en
Datenspeicher --> Datenquelle hinzufügen --> GeoTIFF --> {Name: strassenlaerm_tag, URL:file:///opt/geoserver/data_dir/data/strassenlaerm_tag.tif --> Speichern 
Stile --> Stil hinzufügen --> {name: strassenlaerm_tag_colormap, NoisePollution.sld} --> Speichern
Layer --> Layer hinzufügen --> strassenlaerm_tag --> Publizieren --> Publizierung --> Standardstil: strassenlaerm_tag_colormap

Geoserver erreichbar unter: http://localhost:8080/geoserver/web/?0

---
Hinweis: Bei allen curl-Anfragen an GeoServer muss man sich authentifizieren. Standard-Anmeldedaten sind admin/geoserver.

Beispiele:
- Version prüfen (sollte 200 OK liefern):
  curl -u admin:geoserver http://localhost:8080/geoserver/rest/about/version

- Workspaces als JSON auflisten:
  curl -u admin:geoserver -H "Accept: application/json" http://localhost:8080/geoserver/rest/workspaces

Tipp:
- Das Skript init.sh verwendet bereits die Standard-Zugangsdaten (admin/geoserver). Diese können mit Umgebungsvariablen überschrieben werden:
  GEOSERVER_USER=admin GEOSERVER_PASS=geoserver bash init.sh

Nach dem Ausführen von init.sh:
- Jeder GeoTIFF wird als Layer mit dem Basis-Dateinamen (ohne Erweiterung) im Workspace urban veröffentlicht. Es findet keine Umbenennung statt.
- Falls eine Datei genau strassenlaerm_tag.tif heißt, wird für diesen Layer der Standardstil strassenlaerm_tag_colormap gesetzt (fällt andernfalls auf NoisePollution zurück).

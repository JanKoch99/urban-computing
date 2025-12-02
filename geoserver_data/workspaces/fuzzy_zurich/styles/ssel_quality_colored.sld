<?xml version="1.0" encoding="UTF-8"?>
<sld:StyledLayerDescriptor version="1.0.0"
    xmlns="http://www.opengis.net/sld"
    xmlns:sld="http://www.opengis.net/sld"
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.opengis.net/sld 
        http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">

  <sld:NamedLayer>
    <sld:Name>combined_score_zurich</sld:Name>
    <sld:UserStyle>
      <sld:Title>Score 0–20</sld:Title>
      <sld:FeatureTypeStyle>
        <sld:Rule>
          <sld:RasterSymbolizer>
            <sld:ColorMap>
              <sld:ColorMapEntry color="#0000FF" quantity="0" label="0" />
              <sld:ColorMapEntry color="#00A0FF" quantity="5" label="5" />
              <sld:ColorMapEntry color="#00FFFF" quantity="10" label="10" />
              <sld:ColorMapEntry color="#FFFF00" quantity="15" label="15" />
              <sld:ColorMapEntry color="#FF0000" quantity="20" label="20" />

            </sld:ColorMap>
          </sld:RasterSymbolizer>
        </sld:Rule>
      </sld:FeatureTypeStyle>
    </sld:UserStyle>
  </sld:NamedLayer>
</sld:StyledLayerDescriptor>
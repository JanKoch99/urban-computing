<?xml version="1.0" encoding="UTF-8"?>
<sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld"
  xmlns:sld="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:gml="http://www.opengis.net/gml"
  version="1.0.0">
  <sld:NamedLayer>
    <sld:Name>zurich_fuzzy_quality_colored</sld:Name>
    <sld:UserStyle>
      <sld:Title>Zurich Fuzzy Quality (Green to Red)</sld:Title>
      <sld:FeatureTypeStyle>
        <sld:Rule>
          <RasterSymbolizer>
            <Opacity>1.0</Opacity>
            <ColorMap type="ramp">
              <ColorMapEntry color="#00FF00" quantity="55" label="Very Good"/>
              <ColorMapEntry color="#ADFF2F" quantity="65" label="Good"/>
              <ColorMapEntry color="#FFFF00" quantity="75" label="Moderate"/>
              <ColorMapEntry color="#FFA500" quantity="85" label="Poor"/>
              <ColorMapEntry color="#8B0000" quantity="95" label="Very Bad"/>
            </ColorMap>
          </RasterSymbolizer>
        </sld:Rule>
      </sld:FeatureTypeStyle>
    </sld:UserStyle>
  </sld:NamedLayer>
</sld:StyledLayerDescriptor>
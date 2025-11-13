<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
    xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
    xmlns="http://www.opengis.net/sld"
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>zurich_fuzzy_quality_colored</Name>
    <UserStyle>
      <Title>Fuzzy Environmental Quality</Title>
      <FeatureTypeStyle>
        <Rule>
          <RasterSymbolizer>
            <ColorMap>
              <ColorMapEntry color="#006400" quantity="17" label="Very Good"/>
              <ColorMapEntry color="#7CFC00" quantity="34" label="Good"/>
              <ColorMapEntry color="#FFFF00" quantity="51" label="Liveable"/>
              <ColorMapEntry color="#FFA500" quantity="68" label="Bad"/>
              <ColorMapEntry color="#FF0000" quantity="85" label="Very Bad"/>
            </ColorMap>
          </RasterSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
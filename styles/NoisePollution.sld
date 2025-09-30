<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
 xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
 xmlns="http://www.opengis.net/sld"
 xmlns:ogc="http://www.opengis.net/ogc"
 xmlns:xlink="http://www.w3.org/1999/xlink"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

  <NamedLayer>
    <Name>strassenlaerm_tag_colormap</Name>
    <UserStyle>
      <Title>White to Red Raster</Title>
      <Abstract>Raster colored from white (low) to red (high)</Abstract>
      <FeatureTypeStyle>
        <Rule>
          <Name>rule1</Name>
          <Title>White to Red Gradient</Title>
          <RasterSymbolizer>
            <Opacity>1.0</Opacity>
            <ColorMap type="ramp">
              <!-- Adjust quantity values to match your raster min/max -->
              <ColorMapEntry color="#ffffff" quantity="30" label="Low"/>
              <ColorMapEntry color="#ffcccc" quantity="40" label="Medium Low"/>
              <ColorMapEntry color="#ff6666" quantity="50" label="Medium"/>
              <ColorMapEntry color="#ff0000" quantity="70" label="High"/>
            </ColorMap>
          </RasterSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>

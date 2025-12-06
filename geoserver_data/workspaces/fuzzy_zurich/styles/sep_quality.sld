<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

  <NamedLayer>
    <Name>combined_ssep_quality</Name>
    <UserStyle>
      <Title>Combined SEP–Quality Difference</Title>

      <FeatureTypeStyle>
        <!-- Very Low (0–20) -->
        <Rule>
          <RasterSymbolizer>
            <ColorMap type="intervals">
              <ColorMapEntry color="#0000FF" quantity="20" label="Very Low" opacity="1"/>
            </ColorMap>
          </RasterSymbolizer>
        </Rule>

        <!-- Low (21–40) -->
        <Rule>
          <RasterSymbolizer>
            <ColorMap type="intervals">
              <ColorMapEntry color="#00A0FF" quantity="40" label="Low" opacity="1"/>
            </ColorMap>
          </RasterSymbolizer>
        </Rule>

        <!-- Medium (41–60) -->
        <Rule>
          <RasterSymbolizer>
            <ColorMap type="intervals">
              <ColorMapEntry color="#00FFFF" quantity="60" label="Medium" opacity="1"/>
            </ColorMap>
          </RasterSymbolizer>
        </Rule>

        <!-- High (61–80) -->
        <Rule>
          <RasterSymbolizer>
            <ColorMap type="intervals">
              <ColorMapEntry color="#FFFF00" quantity="80" label="High" opacity="1"/>
            </ColorMap>
          </RasterSymbolizer>
        </Rule>

        <!-- Very High (81–100) -->
        <Rule>
          <RasterSymbolizer>
            <ColorMap type="intervals">
              <ColorMapEntry color="#FF0000" quantity="100" label="Very High" opacity="1"/>
            </ColorMap>
          </RasterSymbolizer>
        </Rule>

      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
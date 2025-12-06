<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
    xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
    xmlns="http://www.opengis.net/sld"
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

  <NamedLayer>
    <Name>sep_index_colored</Name>
    <UserStyle>
      <Title>Swiss SEP Index (Red → Blue)</Title>
      <FeatureTypeStyle>
        <Rule>
          <RasterSymbolizer>
            <ColorMap type="ramp">

              <!-- Low SEP = Red -->
              <ColorMapEntry color="#B2182B" quantity="0" label="Low SEP" opacity="1"/>
              
              <!-- Medium SEP = Orange -->
              <ColorMapEntry color="#FD8D3C" quantity="50" label="Medium SEP" opacity="1"/>

              <!-- High SEP = Blue -->
              <ColorMapEntry color="#08306B" quantity="100" label="High SEP" opacity="1"/>

            </ColorMap>
          </RasterSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
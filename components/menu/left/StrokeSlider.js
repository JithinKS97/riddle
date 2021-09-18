import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";

const StrokeSlider = () => {
  return (
    <Slider
      width="100px"
      aria-label="slider-ex-1"
      defaultValue={50}
      min={10}
      max={150}
    >
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb
        _hover={{ backgroundColor: "black" }}
        borderWidth="2px"
        borderColor="black"
        boxShadow="xs"
      />
    </Slider>
  );
};

export default StrokeSlider;

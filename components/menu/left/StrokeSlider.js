import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";

const StrokeSlider = (props) => {
  const { onChange } = props;

  return (
    <Slider
      width="100px"
      aria-label="slider-ex-1"
      defaultValue={50}
      min={10}
      max={150}
      onChangeEnd={onChange}
    >
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb
        _hover={{ backgroundColor: "black" }}
        borderWidth="2px"
        borderColor="black"
        boxShadow="xs"
        _focus={{ boxShadow: "none" }}
      />
    </Slider>
  );
};

export default StrokeSlider;

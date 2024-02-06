import RNSlider, {SliderProps} from '@react-native-community/slider';

interface ISliderProps extends SliderProps {}

export const Slider = (props: ISliderProps) => {
  return (
    <RNSlider
      style={{width: 200, height: 40}}
      minimumValue={0}
      maximumValue={1}
      minimumTrackTintColor="black"
      maximumTrackTintColor="#000000"
      thumbTintColor="grey"
      {...props}
    />
  );
};

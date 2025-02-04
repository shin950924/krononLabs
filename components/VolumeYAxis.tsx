import { margin } from "@/const";
import Svg, { Line, Text } from "react-native-svg";

const VolumeYAxis: React.FC<VolumeYAxisProps> = ({
  maxVolume,
  chartHeight,
}) => {
  return (
    <Svg width={margin.right} height={chartHeight}>
      <Text x={20} y={10} fontSize={10} fill="white" textAnchor="middle">
        {(maxVolume / 10000000).toFixed(0)}
      </Text>
      <Text
        x={20}
        y={chartHeight / 2 + 5}
        fontSize={10}
        fill="white"
        textAnchor="middle"
      >
        {(maxVolume / 2 / 10000000).toFixed(0)}
      </Text>
      <Text
        x={20}
        y={chartHeight - 2}
        fontSize={10}
        fill="white"
        textAnchor="middle"
      >
        0
      </Text>
    </Svg>
  );
};

export default VolumeYAxis;

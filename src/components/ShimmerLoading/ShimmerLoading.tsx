import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
interface ShimmerLoadingProps {
  count?: number;
  height?: number;
  width?: number | string;
}

const ShimmerLoading: React.FC<ShimmerLoadingProps> = ({
  count = 5,
  height = 100,
  width = 600,
}) => {
  return <Skeleton count={count} height={height} width={width} />;
};
export default ShimmerLoading;
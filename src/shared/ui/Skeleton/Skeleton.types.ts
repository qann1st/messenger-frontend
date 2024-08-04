export type TSkeletonProps = {
  className?: string;
};

export type TSkeletonCircleProps = TSkeletonProps & {
  size?: number;
};

export type TSkeletonRectangleProps = TSkeletonProps & {
  width?: number | string;
  height?: number | string;
};

export type TSkeletonComponentProps = TSkeletonProps & {
  type: 'circle' | 'rectangle';
  size?: number | string;
  width?: number | string;
  height?: number | string;
};

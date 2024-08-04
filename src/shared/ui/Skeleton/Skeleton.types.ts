export type TSkeletonProps = {
  className?: string;
};

export type TSkeletonCircleProps = TSkeletonProps & {
  size?: number;
};

export type TSkeletonRectangleProps = TSkeletonProps & {
  width?: number;
  height?: number;
};

export type TSkeletonComponentProps = TSkeletonProps & {
  type: 'circle' | 'rectangle';
  size?: number;
  width?: number;
  height?: number;
};

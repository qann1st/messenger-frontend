import { FC } from 'react';

import { classNames } from '~/shared';

import styles from './Skeleton.module.css';

import { TSkeletonCircleProps, TSkeletonComponentProps, TSkeletonRectangleProps } from './Skeleton.types';

const Skeleton: FC<TSkeletonComponentProps> & {
  Circle: FC<TSkeletonCircleProps>;
  Rectangle: FC<TSkeletonRectangleProps>;
} = ({ type, size, width, height, borderRadius, className = '' }) => {
  const style =
    type === 'circle'
      ? { width: size, height: size, borderRadius: borderRadius ?? '50%' }
      : { width, height, borderRadius };

  return (
    <div
      className={classNames(className, type === 'circle' ? styles.skeleton_circle : styles.skeleton_rectangle)}
      style={style}
    />
  );
};

const Circle: FC<TSkeletonCircleProps> = ({ size = 50, className = '', borderRadius }) => (
  <Skeleton type='circle' size={size} className={className} borderRadius={borderRadius} />
);

const Rectangle: FC<TSkeletonRectangleProps> = ({ width = 100, height = 20, borderRadius, className = '' }) => (
  <Skeleton type='rectangle' width={width} height={height} className={className} borderRadius={borderRadius} />
);

Skeleton.Circle = Circle;
Skeleton.Rectangle = Rectangle;

export { Skeleton };

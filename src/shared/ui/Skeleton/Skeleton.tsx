import { FC } from 'react';

import { classNames } from '~/shared/lib';

import styles from './Skeleton.module.css';

import { TSkeletonCircleProps, TSkeletonComponentProps, TSkeletonRectangleProps } from './Skeleton.types';

const Skeleton: FC<TSkeletonComponentProps> & {
  Circle: FC<TSkeletonCircleProps>;
  Rectangle: FC<TSkeletonRectangleProps>;
} = ({ type, size, width, height, className = '' }) => {
  const style = type === 'circle' ? { width: size, height: size, borderRadius: '50%' } : { width, height };

  return (
    <div
      className={classNames(type === 'circle' ? styles.skeleton_circle : styles.skeleton_rectangle, className)}
      style={style}
    />
  );
};

const Circle: FC<TSkeletonCircleProps> = ({ size = 50, className = '' }) => (
  <Skeleton type='circle' size={size} className={className} />
);

const Rectangle: FC<TSkeletonRectangleProps> = ({ width = 100, height = 20, className = '' }) => (
  <Skeleton type='rectangle' width={width} height={height} className={className} />
);

Skeleton.Circle = Circle;
Skeleton.Rectangle = Rectangle;

export { Skeleton };

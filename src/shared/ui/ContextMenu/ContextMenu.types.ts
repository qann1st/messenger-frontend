import { IconType } from 'react-icons';

export type TContextMenuProps = {
  isToggled: boolean;
  posX: number;
  posY: number;
  buttons: { icon: IconType; text: string; isDelete?: boolean; onClick?: () => void; show?: boolean }[];
};

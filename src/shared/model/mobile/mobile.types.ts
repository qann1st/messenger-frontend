export type TMobileState = {
  type: 'desktop' | 'tablet' | 'mobile';
  lastChat: string;
  setType: (value: TMobileState['type']) => void;
  setLastChat: (value: string) => void;
};

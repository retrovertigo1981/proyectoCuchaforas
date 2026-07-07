export const COLOR_PALETTE = [
  '#7e7bab',
  '#ffd633',
  '#9695c3',
  '#656293',
  '#bab8dd',
  '#feca17',
  '#b28710',
  '#d9a906',
  '#ef7b6f',
  '#e7312b',
  '#cb281a',
  '#ea5a4c',
];

export const getColorForArtesana = (artesanaId: string): string => {
  let hash = 0;
  for (let i = 0; i < artesanaId.length; i++) {
    hash = artesanaId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
};

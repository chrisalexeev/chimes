export const getRandomVelocity: (speed: number) => { dX: number; dY: number } = (
  speed: number
) => {
  const angle = Math.random() * 2 * Math.PI;
  return {
    dX: Math.cos(angle) * speed,
    dY: Math.sin(angle) * speed,
  };
};

export const getRandomColor: () => string = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
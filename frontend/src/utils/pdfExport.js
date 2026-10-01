export function chartToBase64(chartRef) {
  if (!chartRef?.current) return null;
  const svgElement = chartRef.current.querySelector('svg');
  if (!svgElement) return null;

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const canvas = document.createElement('canvas');
  const svgSize = svgElement.getBoundingClientRect();
  canvas.width = svgSize.width * 2;
  canvas.height = svgSize.height * 2;
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  });
}

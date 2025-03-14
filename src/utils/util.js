export const fileType = (type, isBig = false) => {
  const fileType = [
    { type: 'audio', icon: 'file/file/icon-audio.png', bigIcon: 'file/file/icon-audio-big.png', name: '音频' },
    { type: 'cad', icon: 'file/file/icon-cad.png', bigIcon: 'file/file/icon-cad-big.png', name: 'cad' },
    { type: 'excel', icon: 'file/file/icon-excel.png', bigIcon: 'file/file/icon-excel-big.png', name: 'excel' },
    { type: 'pdf', icon: 'file/file/icon-pdf.png', bigIcon: 'file/file/icon-pdf-big.png', name: 'pdf' },
    { type: 'ppt', icon: 'file/file/icon-ppt.png', bigIcon: 'file/file/icon-ppt-big.png', name: 'ppt' },
    { type: 'wjj', icon: 'file/file/icon-wenjianjia.png', bigIcon: 'file/file/icon-wenjianjia-big.png', name: '文件夹' },
    { type: 'qyWjj', icon: 'file/file/icon-wenjianjia-blue.png', bigIcon: 'file/file/icon-wenjianjia-blue-big.png', name: '企业文件夹' },
    { type: 'word', icon: 'file/file/icon-word.png', bigIcon: 'file/file/icon-word-big.png', name: 'word' },
    { type: 'any', icon: 'file/file/icon-any.png', bigIcon: 'file/file/icon-any-big.png', name: 'any' },
  ];
  if (type) {
    let item = fileType.find((e) => e.type == type);
    if (!!item) {
      return isBig ? item.bigIcon : item.icon;
    }
  }
};

export const uniqueId = () => {
  const uniqueId = 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
  return uniqueId;
};

export const getColor = (excludes) => {
  const color =
    '#' +
    Math.floor(Math.random() * 0x1000000)
      .toString(16)
      .padStart(6, '0');
  if (color === excludes) {
    return getColor(excludes);
  }
  return color;
};

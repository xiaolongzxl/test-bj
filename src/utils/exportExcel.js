import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export const exportExcel = (htmlID, name) => {
  let xlsxParam = { raw: true }; // 导出的内容只做解析，不进行格式转换
  let wb = XLSX.utils.table_to_book(document.querySelector(htmlID), xlsxParam);

  /* get binary string as output */
  let wbOut = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
  try {
    FileSaver.saveAs(new Blob([wbOut], { type: 'application/octet-stream' }), name + '.xlsx');
  } catch (e) {
    if (typeof console !== 'undefined') {
      console.log(e, wbOut);
    }
  }
  return wbOut;
};

function generarXlsx(info, module, ansMensual) {
  const XLSX = require("xlsx");
  const casos = [];
  const ans = {};

  const newInfo = info.map((element) => {
    if (element.casosLote) {
      casos.push(...element.casosLote);
      delete element.casosLote;
    }
    return element;
  });

  info.forEach((element) => {
    if (ans["Mes"] === undefined) {
      ans["Mes"] = element.mes;
    }
  });

  ans["Modulo"] = module;

  for (let llave in ansMensual) {
    ans[llave] = ansMensual[llave];
  }

  const hoja1 = XLSX.utils.json_to_sheet(newInfo);
  const hoja2 = XLSX.utils.json_to_sheet(casos);
  const hoja3 = XLSX.utils.json_to_sheet([ans]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, hoja1, "Consolidado por lotes");
  XLSX.utils.book_append_sheet(wb, hoja2, "Casos");
  XLSX.utils.book_append_sheet(wb, hoja3, "ANS");

  const file = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);

    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }

    return buf;
  }

  const blob = new Blob([s2ab(file)], { type: "application/octet-stream" });
  const filename = `consolidado${module}.xlsx`;
  if (document.msSaveBlob) {
    document.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      return true;
    }
  }
}

export default generarXlsx;

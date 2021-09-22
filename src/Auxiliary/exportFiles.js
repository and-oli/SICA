function exportToCsv(filename, rows, fileType, ansMensual) {
  const XLSX = require("xlsx");
  let blob;
  let newName;

  if (fileType === "csv") {
    let processRow = function (row) {
      let finalVal = "\uFEFF";
      for (let j = 0; j < row.length; j++) {
        let innerValue = row[j] === null ? "" : row[j].toString();
        if (row[j] instanceof Date) {
          innerValue = row[j].toLocaleString();
        }
        let result = innerValue.replace(/"/g, '""');
        if (result.search(/("|;|\n)/g) >= 0) result = '"' + result + '"';
        if (j > 0) finalVal += ";";
        finalVal += result;
      }
      return finalVal + "\n";
    };

    let csvFile = "";
    for (let i = 0; i < rows.length; i++) {
      csvFile += processRow(rows[i]);
    }
    let csvContent = "...csv content...";
    let encodedUri = encodeURI(csvContent);
    blob = new Blob([csvFile], {
      type: "data:text/csv;charset=utf-8,\uFEFF" + encodedUri,
    });
  } else if (fileType === "xlsx") {
    const casos = [];
    const casosFuera = [];
    const ans = {};

    const newInfo = rows.map((element) => {
      if (element.casosLote && element.casosFueraPorLote) {
        casos.push(...element.casosLote);
        casosFuera.push(...element.casosFueraPorLote);
        delete element.casosLote;
        delete element.casosFueraPorLote;
      }
      return element;
    });

    rows.forEach((element) => {
      if (ans["Mes"] === undefined) {
        ans["Mes"] = element.mes;
      }
    });

    ans["Modulo"] = filename;

    for (let llave in ansMensual) {
      ans[llave] = ansMensual[llave];
    }

    const hoja1 = XLSX.utils.json_to_sheet(newInfo);
    const hoja2 = XLSX.utils.json_to_sheet(casos);
    const hoja3 = XLSX.utils.json_to_sheet(casosFuera);
    const hoja4 = XLSX.utils.json_to_sheet([ans]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, hoja1, "Consolidado por lotes");
    XLSX.utils.book_append_sheet(wb, hoja2, "Casos");
    XLSX.utils.book_append_sheet(wb, hoja3, "Casos Fuera");
    XLSX.utils.book_append_sheet(wb, hoja4, "ANS");

    const file = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);

      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
      }

      return buf;
    }

    blob = new Blob([s2ab(file)], { type: "application/octet-stream" });
    newName = `consolidado${filename}.xlsx`;
  }

  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, newName);
  } else {
    let link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      let url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", newName);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      return true;
    }
  }
}

export default exportToCsv;

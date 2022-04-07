import XLSX from 'xlsx';

function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}

export const ExcelService = {
    download: (url, name) => {
        const cta = document.createElement('a');
        cta.href = url;
        cta.download = name + '.xls';
        cta.click();

        window.URL.revokeObjectURL(url);
    },

    s2ab: (s) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;

        return buf;
    },

    downloadFile: (filename, data) => {
        const workbook = new Workbook();
        const worsheet = XLSX.utils.json_to_sheet(data);

        workbook.SheetNames.push('shit');
        workbook.Sheets['shit'] = worsheet;

        const wbout = XLSX.write(workbook, {
            bookSST: true,
            type: 'binary',
        });

        let url = window.URL.createObjectURL(
            new Blob([ExcelService.s2ab(wbout)], {
                type: 'application/octet-stream',
            })
        );

        ExcelService.download(url, filename);
    },

    downloadJson: (filename, data) => {
        const dataStr =
            'data:text/json;charset=utf-8,' +
            encodeURIComponent(JSON.stringify(data));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', dataStr);
        downloadAnchorNode.setAttribute('download', filename + '.json');
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    },
};

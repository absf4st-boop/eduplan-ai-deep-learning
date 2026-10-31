/**
 * Document Export Utility (Word .doc and PDF/Print)
 * Tailored for Indonesian SD educational administration
 */
import { SchoolProfile, TeacherProfile } from '../types';

export function downloadWordDocument(
  param1: string,
  param2?: string,
  param3?: string,
  schoolProfile?: SchoolProfile,
  teacherProfile?: TeacherProfile
): void {
  let title = 'Dokumen_EduPlan_AI';
  let htmlContent = '';

  // Determine signature:
  // (filename, title, htmlContent, school, teacher) vs (htmlContent, title)
  if (param3 !== undefined) {
    title = param2 || param1;
    htmlContent = param3;
  } else if (param2 !== undefined) {
    if (param1.includes('<') || param1.includes('div') || param1.includes('table')) {
      htmlContent = param1;
      title = param2;
    } else {
      title = param1;
      htmlContent = param2;
    }
  } else {
    htmlContent = param1;
  }

  const cleanTitle = title.replace(/[^a-zA-Z0-9_\-]/g, '_');

  // Build Kop Sekolah if available
  let kopHtml = '';
  if (schoolProfile) {
    const sName = schoolProfile.schoolName || schoolProfile.name || 'SD NEGERI';
    const sProvince = schoolProfile.province || 'JAWA TENGAH';
    const sRegency = schoolProfile.regency || 'KABUPATEN BATANG';
    const sAddress = schoolProfile.address || '';
    const sDistrict = schoolProfile.district || '';
    const sNpsn = schoolProfile.npsn || '';

    kopHtml = `
      <div style="border-bottom: 3px double #000; padding-bottom: 10px; margin-bottom: 20px; text-align: center;">
        <h4 style="margin: 0; font-size: 11pt; text-transform: uppercase;">PEMERINTAH ${sProvince.toUpperCase()}</h4>
        <h4 style="margin: 2px 0; font-size: 11pt; text-transform: uppercase;">DINAS PENDIDIKAN DAN KEBUDAYAAN ${sRegency.toUpperCase()}</h4>
        <h2 style="margin: 3px 0; font-size: 14pt; text-transform: uppercase; font-weight: bold;">${sName.toUpperCase()}</h2>
        <p style="margin: 2px 0; font-size: 9pt;">Alamat: ${sAddress}, Kec. ${sDistrict}, ${sRegency} | NPSN: ${sNpsn}</p>
      </div>
    `;
  }

  const wordHeader = `
  <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset='utf-8'>
    <title>${title}</title>
    <!--[if gte mso 9]>
    <xml>
      <w:WordDocument>
        <w:View>Print</w:View>
        <w:Zoom>100</w:Zoom>
        <w:DoNotOptimizeForBrowser/>
      </w:WordDocument>
    </xml>
    <![endif]-->
    <style>
      @page {
        size: 210mm 297mm; /* A4 */
        margin: 20mm 20mm 20mm 20mm;
        mso-page-orientation: portrait;
      }
      body {
        font-family: 'Times New Roman', Times, serif;
        font-size: 11pt;
        line-height: 1.4;
        color: #000000;
      }
      table {
        border-collapse: collapse;
        width: 100%;
        margin-top: 10px;
        margin-bottom: 10px;
      }
      table, th, td {
        border: 1px solid #000000;
      }
      th {
        background-color: #f1f5f9;
        font-weight: bold;
        text-align: center;
        padding: 5px;
      }
      td {
        padding: 5px;
        vertical-align: top;
      }
      h1, h2, h3, h4 {
        font-family: 'Times New Roman', Times, serif;
        margin: 8px 0;
      }
    </style>
  </head>
  <body>
    ${kopHtml}
    ${htmlContent}
  </body>
  </html>
  `;

  const blob = new Blob(['\ufeff', wordHeader], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${cleanTitle}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function printOrExportPdf(param1: string, param2?: string): void {
  let title = 'Dokumen_EduPlan_AI';
  let htmlContent = '';

  if (param2 !== undefined) {
    if (param1.includes('<') || param1.includes('div') || param1.includes('table')) {
      htmlContent = param1;
      title = param2;
    } else {
      title = param1;
      htmlContent = param2;
    }
  } else {
    htmlContent = param1;
  }

  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) {
    window.print();
    return;
  }

  const printDocument = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <style>
      @page {
        size: A4 portrait;
        margin: 15mm 15mm 15mm 15mm;
      }
      body {
        font-family: 'Times New Roman', Times, serif;
        color: #0f172a;
        background: #ffffff;
        margin: 0;
        padding: 10px;
        font-size: 11pt;
        line-height: 1.4;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 10px 0;
        page-break-inside: auto;
      }
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      th, td {
        border: 1px solid #334155;
        padding: 5px 8px;
        font-size: 10pt;
      }
      th {
        background-color: #f1f5f9;
      }
      @media print {
        body {
          padding: 0;
        }
        .no-print {
          display: none !important;
        }
      }
    </style>
  </head>
  <body>
    ${htmlContent}
    <script>
      window.onload = function() {
        window.print();
      };
    </script>
  </body>
  </html>
  `;

  printWindow.document.open();
  printWindow.document.write(printDocument);
  printWindow.document.close();
}

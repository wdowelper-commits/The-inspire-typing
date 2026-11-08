import { jsPDF } from 'jspdf';
import { CertificateData } from '../types';

export async function generateCertificatePDF(data: CertificateData): Promise<Blob> {
  // A4 Landscape dimensions in mm: 297 x 210
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const width = 297;
  const height = 210;

  // Outer border with royal navy blue and gold accents
  doc.setDrawColor(37, 99, 235); // #2563EB
  doc.setLineWidth(3);
  doc.rect(10, 10, width - 20, height - 20);

  // Inner subtle border
  doc.setDrawColor(219, 234, 254); // #DBEAFE
  doc.setLineWidth(1);
  doc.rect(14, 14, width - 28, height - 28);

  // Corner decorations
  doc.setDrawColor(245, 158, 11); // Amber / Gold
  doc.setLineWidth(1.5);
  const cornerSize = 10;
  // Top-left
  doc.line(16, 16, 16 + cornerSize, 16);
  doc.line(16, 16, 16, 16 + cornerSize);
  // Top-right
  doc.line(width - 16, 16, width - 16 - cornerSize, 16);
  doc.line(width - 16, 16, width - 16, 16 + cornerSize);
  // Bottom-left
  doc.line(16, height - 16, 16 + cornerSize, height - 16);
  doc.line(16, height - 16, 16, height - 16 - cornerSize);
  // Bottom-right
  doc.line(width - 16, height - 16, width - 16 - cornerSize, height - 16);
  doc.line(width - 16, height - 16, width - 16, height - 16 - cornerSize);

  // Header - Organization Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235);
  doc.text('INSPIRE TYPING ACADEMY', width / 2, 34, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('OFFICIAL CERTIFICATE OF ACHIEVEMENT & SPEED MASTERY', width / 2, 42, { align: 'center' });

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(60, 48, width - 60, 48);

  // "This certifies that"
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(71, 85, 105);
  doc.text('This is to proudly certify that', width / 2, 60, { align: 'center' });

  // Recipient Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(30);
  doc.setTextColor(30, 41, 59);
  doc.text(data.recipientName || 'Inspire Typist', width / 2, 78, { align: 'center' });

  // Underline under recipient name
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(1.5);
  const nameWidth = doc.getTextWidth(data.recipientName || 'Inspire Typist');
  doc.line(width / 2 - nameWidth / 2 - 5, 82, width / 2 + nameWidth / 2 + 5, 82);

  // Body text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(51, 65, 85);
  doc.text('has successfully demonstrated exemplary keyboard touch typing proficiency in', width / 2, 96, {
    align: 'center',
  });

  // Track name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(37, 99, 235);
  doc.text(data.achievementTitle, width / 2, 108, { align: 'center' });

  // Stats Box in Center
  const boxWidth = 140;
  const boxHeight = 28;
  const boxX = (width - boxWidth) / 2;
  const boxY = 118;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.8);
  doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 4, 4, 'FD');

  // WPM stat
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(16, 185, 129); // Emerald
  doc.text(`${data.wpm} WPM`, boxX + 35, boxY + 14, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('TYPING SPEED', boxX + 35, boxY + 22, { align: 'center' });

  // Divider inside stat box
  doc.setDrawColor(226, 232, 240);
  doc.line(boxX + 70, boxY + 5, boxX + 70, boxY + boxHeight - 5);

  // Accuracy stat
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(37, 99, 235);
  doc.text(`${data.accuracy}%`, boxX + 105, boxY + 14, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('ACCURACY', boxX + 105, boxY + 22, { align: 'center' });

  // Verification Seal / Badge graphic representation
  const sealX = width / 2;
  const sealY = 164;
  doc.setDrawColor(245, 158, 11);
  doc.setFillColor(254, 243, 199);
  doc.circle(sealX, sealY, 12, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(180, 83, 9);
  doc.text('CERTIFIED', sealX, sealY - 1, { align: 'center' });
  doc.text('VERIFIED', sealX, sealY + 3, { align: 'center' });

  // Signatures and Date
  const bottomY = 185;

  // Left: Date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Issue Date: ${data.date}`, 35, bottomY);
  doc.text(`ID: ${data.certificateId}`, 35, bottomY + 5);

  // Right: Signature line
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);
  doc.line(width - 85, bottomY - 3, width - 35, bottomY - 3);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('Director of Certification', width - 60, bottomY + 2, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Inspire Typing Board', width - 60, bottomY + 6, { align: 'center' });

  return doc.output('blob');
}

export function downloadCertificate(data: CertificateData) {
  generateCertificatePDF(data).then((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inspire-typing-certificate-${data.certificateId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}

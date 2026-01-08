import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { TrendData, MarkerInsight, LabReport } from '@/lib/types';

interface ExportData {
  patientName: string;
  reports: LabReport[];
  outOfRange: TrendData[];
  worsening: TrendData[];
  other: TrendData[];
  insights: Map<string, MarkerInsight>;
}

const COLORS = {
  primary: [59, 130, 246] as [number, number, number],
  destructive: [239, 68, 68] as [number, number, number],
  warning: [245, 158, 11] as [number, number, number],
  success: [34, 197, 94] as [number, number, number],
  muted: [100, 116, 139] as [number, number, number],
  text: [15, 23, 42] as [number, number, number],
  background: [248, 250, 252] as [number, number, number],
};

function formatValue(val: number): string {
  if (val >= 10000) return val.toLocaleString();
  if (Number.isInteger(val)) return val.toString();
  return val.toFixed(1);
}

function getStatusLabel(status: TrendData['status']): string {
  switch (status) {
    case 'out_of_range': return 'OUT OF RANGE';
    case 'worsening': return 'NEAR LIMIT';
    default: return 'WITHIN RANGE';
  }
}

function addInsightBlock(doc: jsPDF, insight: MarkerInsight, startY: number, pageWidth: number): number {
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  const insightBoxPadding = 8;
  const lineHeight = 5;
  
  let currentY = startY + 5;
  
  // Calculate if we need a new page
  const estimatedHeight = 60 + (insight.concerns.length + insight.suggestions.length + insight.doctorQuestions.length) * 6;
  if (currentY + estimatedHeight > doc.internal.pageSize.getHeight() - 30) {
    doc.addPage();
    currentY = 20;
  }
  
  // Draw insight box background
  doc.setFillColor(...COLORS.background);
  doc.roundedRect(margin, currentY, contentWidth, 10, 2, 2, 'F');
  
  // AI Insights header
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text('AI Insights', margin + insightBoxPadding, currentY + 7);
  
  // Confidence badge
  const confidenceText = insight.confidence.toUpperCase() + ' CONFIDENCE';
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.muted);
  const confidenceWidth = doc.getTextWidth(confidenceText);
  doc.text(confidenceText, pageWidth - margin - insightBoxPadding - confidenceWidth, currentY + 7);
  
  currentY += 15;
  
  // Explanation
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.text);
  const explanationLines = doc.splitTextToSize(insight.explanation, contentWidth - insightBoxPadding * 2);
  doc.text(explanationLines, margin + insightBoxPadding, currentY);
  currentY += explanationLines.length * lineHeight + 5;
  
  // Concerns
  if (insight.concerns.length > 0) {
    if (currentY > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.warning);
    doc.text('Potential Concerns:', margin + insightBoxPadding, currentY);
    currentY += lineHeight + 2;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);
    insight.concerns.forEach(concern => {
      const lines = doc.splitTextToSize('• ' + concern, contentWidth - insightBoxPadding * 2 - 5);
      doc.text(lines, margin + insightBoxPadding + 5, currentY);
      currentY += lines.length * lineHeight;
    });
    currentY += 3;
  }
  
  // Suggestions
  if (insight.suggestions.length > 0) {
    if (currentY > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.success);
    doc.text('Suggestions:', margin + insightBoxPadding, currentY);
    currentY += lineHeight + 2;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);
    insight.suggestions.forEach(suggestion => {
      const lines = doc.splitTextToSize('• ' + suggestion, contentWidth - insightBoxPadding * 2 - 5);
      doc.text(lines, margin + insightBoxPadding + 5, currentY);
      currentY += lines.length * lineHeight;
    });
    currentY += 3;
  }
  
  // Doctor Questions
  if (insight.doctorQuestions.length > 0) {
    if (currentY > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('Questions for Your Doctor:', margin + insightBoxPadding, currentY);
    currentY += lineHeight + 2;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);
    insight.doctorQuestions.forEach(question => {
      const lines = doc.splitTextToSize('• ' + question, contentWidth - insightBoxPadding * 2 - 5);
      doc.text(lines, margin + insightBoxPadding + 5, currentY);
      currentY += lines.length * lineHeight;
    });
  }
  
  return currentY + 8;
}

function addMarkerSection(
  doc: jsPDF, 
  title: string, 
  trends: TrendData[], 
  insights: Map<string, MarkerInsight>,
  startY: number,
  color: [number, number, number],
  includeInsights: boolean = true
): number {
  if (trends.length === 0) return startY;
  
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = startY;
  
  // Check for new page
  if (currentY > doc.internal.pageSize.getHeight() - 60) {
    doc.addPage();
    currentY = 20;
  }
  
  // Section header
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...color);
  doc.text(title, margin, currentY);
  currentY += 8;
  
  // Create table data
  const tableData = trends.map(trend => [
    trend.canonicalName,
    `${formatValue(trend.currentValue)} ${trend.unit}`,
    `${trend.refLow !== null ? formatValue(trend.refLow) : '—'} – ${trend.refHigh !== null ? formatValue(trend.refHigh) : '—'}`,
    getStatusLabel(trend.status),
    trend.changePercent !== null ? `${trend.changePercent > 0 ? '+' : ''}${trend.changePercent.toFixed(1)}%` : '—'
  ]);
  
  autoTable(doc, {
    startY: currentY,
    head: [['Marker', 'Value', 'Reference Range', 'Status', 'Change']],
    body: tableData,
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: color,
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 9,
      textColor: COLORS.text,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
      3: { fontStyle: 'bold' },
    },
    didDrawPage: (data) => {
      // Add footer on each page
      addFooter(doc);
    },
  });
  
  currentY = (doc as any).lastAutoTable.finalY + 5;
  
  // Add insights for markers that have them
  if (includeInsights) {
    for (const trend of trends) {
      const insight = insights.get(trend.canonicalName);
      if (insight) {
        currentY = addInsightBlock(doc, insight, currentY, pageWidth);
      }
    }
  }
  
  return currentY + 10;
}

function addFooter(doc: jsPDF) {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageCount = doc.getNumberOfPages();
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);
  
  // Page number
  doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, pageWidth - 25, pageHeight - 10);
}

export async function exportAnalysisPdf(data: ExportData): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let currentY = 20;
  
  // Get patient name from reports
  const patientName = data.reports.find(r => r.patientName)?.patientName || 'Patient';
  const reportDates = data.reports
    .filter(r => r.reportDate)
    .map(r => r.reportDate!)
    .sort((a, b) => a.getTime() - b.getTime());
  
  // Header
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('HealthTrend Analysis Report', margin, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${format(new Date(), 'MMMM d, yyyy')}`, margin, 35);
  
  currentY = 55;
  
  // Patient Info Box
  doc.setFillColor(...COLORS.background);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 25, 3, 3, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text('Patient:', margin + 8, currentY + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(patientName, margin + 35, currentY + 10);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Reports:', margin + 8, currentY + 18);
  doc.setFont('helvetica', 'normal');
  const datesText = reportDates.length > 0 
    ? reportDates.map(d => format(d, 'MMM d, yyyy')).join(' and ')
    : 'No dates available';
  doc.text(datesText, margin + 35, currentY + 18);
  
  currentY += 35;
  
  // Summary Box
  const totalMarkers = data.outOfRange.length + data.worsening.length + data.other.length;
  
  doc.setFillColor(...COLORS.background);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 20, 3, 3, 'F');
  
  const summaryY = currentY + 13;
  const colWidth = (pageWidth - margin * 2) / 3;
  
  // Total Markers
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text(`${totalMarkers}`, margin + colWidth / 2, summaryY - 3, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);
  doc.text('Total Markers', margin + colWidth / 2, summaryY + 4, { align: 'center' });
  
  // Out of Range
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.destructive);
  doc.text(`${data.outOfRange.length}`, margin + colWidth + colWidth / 2, summaryY - 3, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);
  doc.text('Out of Range', margin + colWidth + colWidth / 2, summaryY + 4, { align: 'center' });
  
  // Worsening
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.warning);
  doc.text(`${data.worsening.length}`, margin + colWidth * 2 + colWidth / 2, summaryY - 3, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);
  doc.text('Near Limit', margin + colWidth * 2 + colWidth / 2, summaryY + 4, { align: 'center' });
  
  currentY += 30;
  
  // Marker Sections
  currentY = addMarkerSection(doc, 'OUT OF RANGE MARKERS', data.outOfRange, data.insights, currentY, COLORS.destructive);
  currentY = addMarkerSection(doc, 'TRENDS TO MONITOR', data.worsening, data.insights, currentY, COLORS.warning);
  currentY = addMarkerSection(doc, 'OTHER MARKERS', data.other, data.insights, currentY, COLORS.muted, false);
  
  // Add disclaimer on last page
  const pageHeight = doc.internal.pageSize.getHeight();
  if (currentY > pageHeight - 40) {
    doc.addPage();
    currentY = 20;
  }
  
  doc.setFillColor(255, 243, 205);
  doc.roundedRect(margin, pageHeight - 35, pageWidth - margin * 2, 20, 3, 3, 'F');
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.warning);
  doc.text('DISCLAIMER', margin + 8, pageHeight - 25);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.text);
  const disclaimer = 'This report is for educational purposes only and does not constitute medical advice. Always consult your healthcare provider for interpretation of lab results.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - margin * 2 - 16);
  doc.text(disclaimerLines, margin + 8, pageHeight - 20);
  
  // Add footer to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc);
  }
  
  // Download the PDF
  doc.save(`HealthTrend-Report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}

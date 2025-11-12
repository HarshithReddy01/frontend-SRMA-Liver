import React, { useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../theme/ThemeContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import PancreasIcon from '../assets/pancreas-icon.png';
import ThemeToggle from './ThemeToggle';

interface ReportData {
  scanType: string;
  analysisDate: string;
  confidence: number;
  findings: string[];
  recommendations: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
  nextSteps: string[];
  followUpTimeline: string;
  overlayImage?: string;
  statistics?: any;
  medicalReport?: any;
  segmentationFile?: string;
  maskDownloadUrl?: string;
}

const AnalysisReport: React.FC = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [reportData, setReportData] = React.useState<ReportData | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    
    const data = location.state?.reportData || JSON.parse(localStorage.getItem('liverprofile-report') || 'null');
    if (data) {
      setReportData(data);
    } else {
      
      navigate('/upload');
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'Medium':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'High':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-blue-600 dark:text-blue-400';
    if (confidence >= 60) return 'text-blue-600 dark:text-blue-400';
    return 'text-red-600 dark:text-red-400';
  };

  
  const getBase64Image = (imgUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No canvas context');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = imgUrl;
    });
  };

  const handleDownloadPDF = async () => {
    if (!reportData) return;
    const doc = new jsPDF();
    
    try {
      const logoBase64 = await getBase64Image(PancreasIcon);
      doc.addImage(logoBase64, 'PNG', 10, 10, 20, 20);
    } catch (e) {
      // Logo loading failed, continue without it
    }
    doc.setFontSize(18);
    doc.text('LiverProfile AI Analysis Report', 35, 20);
    doc.setFontSize(11);
    doc.text('LiverProfile AI is an advanced AI-powered platform for liver segmentation and morphological analysis from 3D MRI volumes.\nThis report provides actionable insights and recommendations based on your medical scan.', 10, 35);
    doc.setFontSize(10);
    doc.text('AI Model Creator: Debesh Jha', 10, 47);
    doc.setLineWidth(0.5);
    doc.line(10, 50, 200, 50);
    
    doc.setFontSize(13);
    doc.text('Overview', 10, 58);
    doc.setFontSize(10);
    doc.text(`Scan Type: ${reportData.scanType}`, 10, 65);
    doc.text(`Analysis Date: ${reportData.analysisDate}`, 10, 71);
    doc.text(`Confidence: ${reportData.confidence}%`, 10, 77);
    doc.text(`Risk Level: ${reportData.riskLevel}`, 10, 83);
    
    // Add segmentation statistics if available
    let nextY = 93;
    if (reportData.statistics) {
      doc.setFontSize(13);
      doc.text('Segmentation Statistics', 10, nextY);
      nextY += 7;
      doc.setFontSize(10);
      if (reportData.statistics.liver_volume_ml) {
        doc.text(`Liver Volume: ${reportData.statistics.liver_volume_ml.toFixed(2)} ml`, 10, nextY);
        nextY += 6;
      }
      if (reportData.statistics.liver_percentage) {
        doc.text(`Liver Percentage: ${reportData.statistics.liver_percentage.toFixed(2)}%`, 10, nextY);
        nextY += 6;
      }
      if (reportData.statistics.liver_voxels) {
        doc.text(`Liver Voxels: ${reportData.statistics.liver_voxels.toLocaleString()}`, 10, nextY);
        nextY += 6;
      }
      if (reportData.statistics.total_voxels) {
        doc.text(`Total Voxels: ${reportData.statistics.total_voxels.toLocaleString()}`, 10, nextY);
        nextY += 6;
      }
      if (reportData.statistics.modality) {
        doc.text(`Modality: ${reportData.statistics.modality}`, 10, nextY);
        nextY += 6;
      }
      nextY += 3;
    }
    
    doc.setFontSize(13);
    doc.text('Findings', 10, nextY);
    nextY += 3;
    autoTable(doc, {
      startY: nextY,
      head: [['#', 'Finding']],
      body: reportData.findings.map((f, i) => [i + 1, f]),
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 },
    });
    nextY = (doc as any).lastAutoTable.finalY + 6;
    
    doc.setFontSize(13);
    doc.text('Recommendations', 10, nextY);
    nextY += 3;
    autoTable(doc, {
      startY: nextY,
      head: [['#', 'Recommendation']],
      body: reportData.recommendations.map((r, i) => [i + 1, r]),
      theme: 'striped',
      headStyles: { fillColor: [142, 68, 173] },
      styles: { fontSize: 10 },
    });
    nextY = (doc as any).lastAutoTable.finalY + 6;
    
    doc.setFontSize(13);
    doc.text('Next Steps', 10, nextY);
    nextY += 3;
    autoTable(doc, {
      startY: nextY,
      head: [['#', 'Next Step']],
      body: reportData.nextSteps.map((s, i) => [i + 1, s]),
      theme: 'striped',
      headStyles: { fillColor: [39, 174, 96] },
      styles: { fontSize: 10 },
    });
    nextY = (doc as any).lastAutoTable.finalY + 6;
  
    doc.setFontSize(13);
    doc.text('Follow-up Timeline', 10, nextY);
    doc.setFontSize(10);
    const followUpLines = doc.splitTextToSize(reportData.followUpTimeline, 180);
    doc.text(followUpLines, 10, nextY + 7);
    nextY += followUpLines.length * 5 + 10;
    
    // Add medical report details if available
    if (reportData.medicalReport) {
      const medReport = reportData.medicalReport;
      if (nextY > 250) {
        doc.addPage();
        nextY = 20;
      }
      
      doc.setFontSize(13);
      doc.text('Detailed Medical Report', 10, nextY);
      nextY += 7;
      doc.setFontSize(10);
      
      if (medReport.impression) {
        doc.setFontSize(11);
        doc.text('Impression:', 10, nextY);
        nextY += 6;
        doc.setFontSize(10);
        const impressionLines = doc.splitTextToSize(medReport.impression, 180);
        doc.text(impressionLines, 10, nextY);
        nextY += impressionLines.length * 5 + 5;
      }
      
      if (medReport.measurements) {
        if (nextY > 250) {
          doc.addPage();
          nextY = 20;
        }
        doc.setFontSize(11);
        doc.text('Quantitative Measurements:', 10, nextY);
        nextY += 6;
        doc.setFontSize(10);
        
        const measurements = medReport.measurements;
        if (measurements.morphology) {
          doc.text(`Connected Components: ${measurements.morphology.connected_components || 'N/A'}`, 10, nextY);
          nextY += 6;
          doc.text(`Fragmentation Level: ${measurements.morphology.fragmentation || 'N/A'}`, 10, nextY);
          nextY += 6;
        }
        nextY += 3;
      }
      
      if (medReport.quality_assessment && medReport.quality_assessment.length > 0) {
        if (nextY > 250) {
          doc.addPage();
          nextY = 20;
        }
        doc.setFontSize(11);
        doc.text('Quality Assessment:', 10, nextY);
        nextY += 6;
        doc.setFontSize(10);
        medReport.quality_assessment.forEach((note: string) => {
          const noteLines = doc.splitTextToSize(`• ${note}`, 180);
          doc.text(noteLines, 10, nextY);
          nextY += noteLines.length * 5;
        });
        nextY += 3;
      }
    }
    
    // Add disclaimer
    if (nextY > 250) {
      doc.addPage();
      nextY = 20;
    }
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    const disclaimer = reportData.medicalReport?.disclaimer || 'This report is generated automatically and should be reviewed by a qualified healthcare professional.';
    const disclaimerLines = doc.splitTextToSize(disclaimer, 180);
    doc.text(disclaimerLines, 10, nextY);
    
    doc.save('LiverProfile-Report.pdf');
  };

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      
      <div className="relative max-w-7xl mx-auto px-4 pt-8 sm:px-6 lg:px-8 pb-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Link
              to="/upload"
              className="group inline-flex items-center px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-full text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 hover:shadow-lg hover:scale-103"
            >
              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Upload
            </Link>
            <Link
              to="/"
              className="group inline-flex items-center px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-full text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 hover:shadow-lg hover:scale-103"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-blue-800 dark:from-white dark:via-blue-200 dark:to-blue-200 bg-clip-text text-transparent sm:text-5xl lg:text-6xl mb-4">
            AI Analysis Report
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Receive detailed reports with actionable insights and recommendations from our advanced AI algorithms
          </p>
        </div>


        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-600/50 p-8">
          <div className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">Scan Type</h3>
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{reportData.scanType}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/30 rounded-xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">Confidence</h3>
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className={`text-2xl font-bold ${getConfidenceColor(reportData.confidence)}`}>
                    {reportData.confidence}%
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/30 rounded-xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">Risk Level</h3>
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getRiskLevelColor(reportData.riskLevel)}`}>
                    {reportData.riskLevel} Risk
                  </span>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/30 rounded-xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">Analysis Date</h3>
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{reportData.analysisDate}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/30 rounded-xl p-6 border border-slate-200/50 dark:border-slate-600/50">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Summary
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Our advanced AI algorithms have analyzed your medical scan for early detection indicators. 
                  The analysis shows a <span className="font-semibold">{reportData.riskLevel.toLowerCase()}</span> risk level 
                  with <span className="font-semibold">{reportData.confidence}%</span> confidence. 
                  Based on the findings, we've provided specific recommendations and next steps for your healthcare provider.
                </p>
              </div>

              {reportData.overlayImage && (
                <div className="bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-800/80 dark:to-slate-700/80 rounded-xl p-6 border border-slate-200/50 dark:border-slate-600/50">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Segmentation Overlay
                  </h3>
                  <div className="flex justify-center">
                    <img 
                      src={reportData.overlayImage} 
                      alt="Liver segmentation overlay" 
                      className="max-w-full h-auto rounded-lg shadow-lg border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 text-center">
                    Green overlay indicates segmented liver region
                  </p>
                </div>
              )}

              {reportData.statistics && (
                <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 rounded-xl p-6 border border-green-200/50 dark:border-green-700/50">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Segmentation Statistics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Liver Volume</p>
                      <p className="text-lg font-bold text-green-700 dark:text-green-300">
                        {reportData.statistics.liver_volume_ml?.toFixed(2) || 'N/A'} ml
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Liver Percentage</p>
                      <p className="text-lg font-bold text-green-700 dark:text-green-300">
                        {reportData.statistics.liver_percentage?.toFixed(2) || 'N/A'}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Total Voxels</p>
                      <p className="text-lg font-bold text-green-700 dark:text-green-300">
                        {reportData.statistics.liver_voxels?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {reportData.maskDownloadUrl && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Segmentation Mask
                  </h3>
                  <a
                    href={reportData.maskDownloadUrl}
                    download
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download 3D Segmentation (.nii.gz)
                  </a>
                </div>
              )}
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <button
            onClick={() => {
              if (!reportData) return;
              const printWindow = window.open('', '_blank');
              if (!printWindow) return;
              printWindow.document.write(`
                <html>
                  <head>
                    <title>LiverProfile AI Analysis Report</title>
                    <style>
                      body { font-family: Arial, sans-serif; margin: 40px; color: #222; }
                      .logo { width: 60px; height: 60px; margin-bottom: 10px; }
                      .header { display: flex; align-items: center; gap: 16px; }
                      .title { font-size: 2rem; font-weight: bold; margin-bottom: 0; }
                      .intro { font-size: 1rem; margin-bottom: 10px; }
                      .section { margin-top: 24px; }
                      .section-title { font-size: 1.2rem; font-weight: bold; margin-bottom: 8px; }
                      table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
                      th, td { border: 1px solid #bbb; padding: 8px; text-align: left; }
                      th { background: #e3e8f0; }
                      .footer { margin-top: 32px; font-size: 0.95rem; color: #555; }
                    </style>
                  </head>
                  <body>
                    <div class="header">
                      <img src="${PancreasIcon}" class="logo" alt="LiverProfile AI Logo" />
                      <div>
                        <div class="title">LiverProfile AI Analysis Report</div>
                        <div class="intro">LiverProfile AI is an advanced AI-powered platform for liver segmentation and morphological analysis from 3D MRI volumes.<br/>This report provides actionable insights and recommendations based on your medical scan.</div>
                        <div style="font-size:0.95rem; color:#666;">AI Model Creator: Debesh Jha</div>
                      </div>
                    </div>
                    <hr/>
                    <div class="section">
                      <div class="section-title">Overview</div>
                      <div>Scan Type: <b>${reportData.scanType}</b></div>
                      <div>Analysis Date: <b>${reportData.analysisDate}</b></div>
                      <div>Confidence: <b>${reportData.confidence}%</b></div>
                      <div>Risk Level: <b>${reportData.riskLevel}</b></div>
                    </div>
                    ${reportData.statistics ? `
                    <div class="section">
                      <div class="section-title">Segmentation Statistics</div>
                      ${reportData.statistics.liver_volume_ml ? `<div>Liver Volume: <b>${reportData.statistics.liver_volume_ml.toFixed(2)} ml</b></div>` : ''}
                      ${reportData.statistics.liver_percentage ? `<div>Liver Percentage: <b>${reportData.statistics.liver_percentage.toFixed(2)}%</b></div>` : ''}
                      ${reportData.statistics.liver_voxels ? `<div>Liver Voxels: <b>${reportData.statistics.liver_voxels.toLocaleString()}</b></div>` : ''}
                      ${reportData.statistics.total_voxels ? `<div>Total Voxels: <b>${reportData.statistics.total_voxels.toLocaleString()}</b></div>` : ''}
                      ${reportData.statistics.modality ? `<div>Modality: <b>${reportData.statistics.modality}</b></div>` : ''}
                    </div>
                    ` : ''}
                    <div class="section">
                      <div class="section-title">Findings</div>
                      <table><thead><tr><th>#</th><th>Finding</th></tr></thead><tbody>
                        ${reportData.findings.map((f, i) => `<tr><td>${i + 1}</td><td>${f}</td></tr>`).join('')}
                      </tbody></table>
                    </div>
                    <div class="section">
                      <div class="section-title">Recommendations</div>
                      <table><thead><tr><th>#</th><th>Recommendation</th></tr></thead><tbody>
                        ${reportData.recommendations.map((r, i) => `<tr><td>${i + 1}</td><td>${r}</td></tr>`).join('')}
                      </tbody></table>
                    </div>
                    <div class="section">
                      <div class="section-title">Next Steps</div>
                      <table><thead><tr><th>#</th><th>Next Step</th></tr></thead><tbody>
                        ${reportData.nextSteps.map((s, i) => `<tr><td>${i + 1}</td><td>${s}</td></tr>`).join('')}
                      </tbody></table>
                    </div>
                    <div class="section">
                      <div class="section-title">Follow-up Timeline</div>
                      <div>${reportData.followUpTimeline}</div>
                    </div>
                    ${reportData.medicalReport ? `
                    <div class="section">
                      <div class="section-title">Detailed Medical Report</div>
                      ${reportData.medicalReport.impression ? `<div><strong>Impression:</strong><br/>${reportData.medicalReport.impression}</div>` : ''}
                      ${reportData.medicalReport.measurements && reportData.medicalReport.measurements.morphology ? `
                      <div style="margin-top: 16px;">
                        <strong>Quantitative Measurements:</strong><br/>
                        Connected Components: ${reportData.medicalReport.measurements.morphology.connected_components || 'N/A'}<br/>
                        Fragmentation Level: ${reportData.medicalReport.measurements.morphology.fragmentation || 'N/A'}
                      </div>
                      ` : ''}
                      ${reportData.medicalReport.quality_assessment && reportData.medicalReport.quality_assessment.length > 0 ? `
                      <div style="margin-top: 16px;">
                        <strong>Quality Assessment:</strong><br/>
                        ${reportData.medicalReport.quality_assessment.map((note: string) => `• ${note}`).join('<br/>')}
                      </div>
                      ` : ''}
                    </div>
                    ` : ''}
                    <div class="footer">
                      ${reportData.medicalReport?.disclaimer || 'This report is generated automatically and should be reviewed by a qualified healthcare professional.'}<br/>
                      Generated by LiverProfile AI | AI Model Creator: Debesh Jha
                    </div>
                  </body>
                </html>
              `);
              printWindow.document.close();
              printWindow.focus();
              setTimeout(() => printWindow.print(), 500);
            }}
            className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-103 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Report
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-103 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport; 
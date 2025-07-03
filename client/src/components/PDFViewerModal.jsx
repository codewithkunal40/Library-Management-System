import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "../styles/react-pdf/TextLayer.css";
import "../styles/react-pdf/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

const PDFViewerModal = ({ isOpen, onClose, pdfPath }) => {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.0); // 🔍 Zoom scale
  const [pageWidth, setPageWidth] = useState(getResponsiveWidth());

  useEffect(() => {
    const handleResize = () => setPageWidth(getResponsiveWidth());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function getResponsiveWidth() {
    const maxWidth = 800;
    const modalWidth = window.innerWidth * 0.8;
    return Math.min(modalWidth, maxWidth);
  }

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
      <div className="bg-white w-[90vw] h-[90vh] p-4 rounded shadow-lg relative overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <div className="space-x-2">
            <button
              onClick={zoomOut}
              className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded"
            >
              − Zoom Out
            </button>
            <button
              onClick={zoomIn}
              className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded"
            >
              + Zoom In
            </button>
          </div>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>

        <div className="overflow-auto flex-1 flex justify-center items-start">
          <Document
            file={`http://localhost:3000/${pdfPath.replace(/\\/g, "/")}`}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={(error) => console.error("PDF load error:", error)}
            loading="Loading PDF..."
          >
            {Array.from({ length: numPages || 1 }, (_, index) => (
              <Page
                key={index}
                pageNumber={index + 1}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                scale={scale}
                width={pageWidth}
              />
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PDFViewerModal;

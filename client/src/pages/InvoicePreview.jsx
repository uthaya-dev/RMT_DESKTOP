// // src/pages/InvoicePreview.jsx
// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";

// const InvoicePreview = () => {
//   const { id } = useParams();
//   const [pdfUrl, setPdfUrl] = useState("");

//   useEffect(() => {
//     // Assuming the server serves the PDF as `application/pdf`
//     const url = `http://localhost:5000/api/invoices/${id}/preview`;
//     setPdfUrl(url);
//   }, [id]);

//   return (
//     <div className="h-screen w-full p-4">
//       <h2 className="text-xl font-bold mb-4">Invoice Preview</h2>
//       {pdfUrl ? (
//         <iframe
//           src={`http://localhost:5000/api/invoices/${id}/preview`}
//           width="100%"
//           height="800px"
//         />
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default InvoicePreview;

import { useParams } from "react-router-dom";

const InvoicePreview = () => {
  const { id } = useParams();
  const pdfUrl = `http://localhost:3001/api/invoices/${id}/preview`;

  return (
    <div className="h-screen w-full p-4">
      <h2 className="text-xl font-bold mb-4">Invoice Preview</h2>
      <iframe
        src={pdfUrl}
        width="100%"
        height="800px"
        title="Invoice Preview"
      />
    </div>
  );
};

export default InvoicePreview;

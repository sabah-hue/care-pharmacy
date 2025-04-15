// Modify createInvoice to return a buffer instead of writing to file
import PDFDocument from 'pdfkit';
export const createMyInvoice = async (invoice) => {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      
      // Instead of creating a file stream, collect data in memory
      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      
      // Your existing PDF generation code here
      generateHeader(doc);
      generateCustomerInformation(doc, invoice);
      generateInvoiceTable(doc, invoice);
      generateFooter(doc);
      
      doc.end();
    });
  }
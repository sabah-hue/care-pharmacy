 export const function createInvoiceImage(invoice) {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
      
        // Set the size of the canvas
        canvas.width = 600;
        canvas.height = 800;
      
        // Draw a white background
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      
        // Set the font for text
        ctx.font = "20px Arial";
        ctx.fillStyle = "#000";
      
        // Add invoice data
        ctx.fillText("Invoice Number: " + invoice.invoice_nr, 50, 50);
        ctx.fillText("Date: " + new Date(invoice.date).toLocaleDateString(), 50, 80);
        ctx.fillText("Customer: " + invoice.shipping.name, 50, 110);
        ctx.fillText("Shipping Address: " + invoice.shipping.address, 50, 140);
        ctx.fillText("City: " + invoice.shipping.city, 50, 170);
        ctx.fillText("State: " + invoice.shipping.state, 50, 200);
        ctx.fillText("Country: " + invoice.shipping.country, 50, 230);
        ctx.fillText("Postal Code: " + invoice.shipping.postal_code, 50, 260);
      
        // Draw the items
        ctx.fillText("Items:", 50, 290);
        let yPosition = 320;
        invoice.items.forEach(item => {
          ctx.fillText(`${item.name} - ${item.price} EGP`, 50, yPosition);
          yPosition += 30;
        });
      
        // Add the subtotal and total
        ctx.fillText("Subtotal: " + invoice.subtotal + " EGP", 50, yPosition);
        yPosition += 30;
        ctx.fillText("Total: " + invoice.total + " EGP", 50, yPosition);
      
        // Convert the canvas to an image (Base64)
        const imageURL = canvas.toDataURL("image/png");
      
        // Optionally, download the image
        const a = document.createElement('a');
        a.href = imageURL;
        a.download = 'invoice.png';
        a.click();
      
        // Return the image URL
        return imageURL;
      }
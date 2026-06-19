// Export to CSV
export const exportToCSV = (data: any[], columns: { header: string; key: string }[], filename: string) => {
  const headers = columns.map(c => c.header);
  const rows = data.map(row => columns.map(c => {
    const val = row[c.key];
    if (val instanceof Date) return val.toLocaleDateString("en-GB");
    if (typeof val === "object" && val?.name) return val.name;
    return val ?? "";
  }));

  const csv = [headers, ...rows]
    .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Export to PDF (dynamic import to match existing pattern)
export const exportToPDF = async (data: any[], columns: { header: string; key: string }[], title: string, filename: string) => {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const m = 14;

  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, pageWidth, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("KING PROPERTY AUCTION", m, 18);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(title, m, 25);

  const tableRows = data.map(row =>
    columns.map(c => {
      const val = row[c.key];
      if (val instanceof Date) return val.toLocaleDateString("en-GB");
      if (typeof val === "object" && val?.name) return val.name;
      return val ?? "";
    })
  );

  autoTable(doc, {
    startY: 35,
    head: [columns.map(c => c.header)],
    body: tableRows,
    theme: "grid",
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 7, textColor: 50 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: m, right: m },
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text(
      `Page ${i}/${pageCount} | King Property Auction | ${new Date().toLocaleDateString("en-GB")}`,
      m,
      doc.internal.pageSize.height - 8,
    );
  }

  doc.save(`${filename}-${new Date().toISOString().split("T")[0]}.pdf`);
};
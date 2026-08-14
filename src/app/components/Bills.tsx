import { useState, useEffect } from "react";
import { Search, Download, Eye, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "../../lib/supabase";


interface Bill {
  id: string;
  billNo: string;
  type: "Sales" | "Purchase";
  party: string;
  date: string;
  amount: number;
  paid: number;
  status: string;
}

export function Bills() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    loadBills();
  }, []);

  function downloadPDF(bill: Bill) {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    let y = 40;

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Kwality Tiles & Granite", margin, y);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const companyLines = [
      "Shop No. 12, Central Market",
      "City Name, State - Pincode",
      "Phone: 01234-567890 | Email: info@kwalitytiles.com",
    ];
    y += 24;
    companyLines.forEach((l) => {
      doc.text(l, margin, y);
      y += 12;
    });

    // Invoice meta on right
    const metaX = pageWidth - margin - 200;
    y = 60;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");    doc.text("Invoice", metaX, y);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");    y += 18;
    doc.text(`Bill No: ${bill.billNo}`, metaX, y);
    y += 12;
    doc.text(`Date: ${new Date(bill.date).toLocaleDateString()}`, metaX, y);
    y += 12;
    doc.text(`Type: ${bill.type}`, metaX, y);

    // Receiver
    y += 26;
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", margin, y);
    doc.setFont("helvetica", "normal");
    y += 14;
    doc.text(bill.party, margin, y);

    // Table: Subtotal / GST / Total
const total = Number(bill.amount || 0);
const subtotal = +(total / 1.18).toFixed(2);
const gst = +(total - subtotal).toFixed(2);

autoTable(doc, {
  startY: y + 18,

  head: [
    [
      {
        content: "Description",
        styles: {
          halign: "left",
        },
      },
      {
        content: "Amount",
        styles: {
          halign: "right",
        },
      },
    ],
  ],

  body: [
    [
      "Subtotal",
      {
        content: `Rs. ${formatCurrency(subtotal)}`,
        styles: {
          halign: "right",
        },
      },
    ],
    [
      "GST (18%)",
      {
        content: `Rs. ${formatCurrency(gst)}`,
        styles: {
          halign: "right",
        },
      },
    ],
    [
      "Grand Total",
      {
        content: `Rs. ${formatCurrency(total)}`,
        styles: {
          halign: "right",
          fontStyle: "bold",
        },
      },
    ],
  ],

  theme: "grid",

  headStyles: {
    fillColor: [0, 121, 107],
    textColor: 255,
    fontStyle: "bold",
    halign: "left",
  },

  bodyStyles: {
    textColor: 40,
  },

  styles: {
    fontSize: 11,
    cellPadding: 8,
    lineWidth: 0.2,
  },

  alternateRowStyles: {
    fillColor: [248, 248, 248],
  },

  columnStyles: {
    0: {
      cellWidth: 300,
    },
    1: {
      cellWidth: 140,
      halign: "right",
    },
  },
});

    // Signature line
    const finalY =
  (doc as any).lastAutoTable?.finalY
    ? (doc as any).lastAutoTable.finalY + 40
    : y + 140;
    doc.save(`${bill.billNo}.pdf`);
  }

  async function loadBills() {
    const { data: sales } = await supabase.from("sales").select("*");
    const { data: purchases } = await supabase.from("purchases").select("*");

    const salesBills = sales?.map((sale: any) => ({
      id: sale.id,
      billNo: sale.bill_no,
      type: "Sales" as const,
      party: sale.customer_name,
      date: sale.bill_date,
      amount: Number(sale.total),
      paid: Number(sale.total),
      status: "Paid",
    })) || [];

    const purchaseBills = purchases?.map((purchase: any) => ({
      id: purchase.id,
      billNo: purchase.purchase_no,
      type: "Purchase" as const,
      party: purchase.supplier_name,
      date: purchase.purchase_date,
      amount: Number(purchase.total),
      paid: Number(purchase.total),
      status: "Paid",
    })) || [];

    setBills([...salesBills, ...purchaseBills]);
  }

  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.billNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.party.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || bill.type === filterType;
    const matchesStatus = filterStatus === "All" || bill.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <CheckCircle className="w-4 h-4" />;
      case "Pending":
      case "Partial":
        return <Clock className="w-4 h-4" />;
      case "Overdue":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-success/10 text-success";
      case "Pending":
        return "bg-warning/10 text-warning";
      case "Partial":
        return "bg-secondary/10 text-secondary";
      case "Overdue":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const totalAmount = filteredBills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalPaid = filteredBills.reduce((sum, bill) => sum + bill.paid, 0);
  const totalPending = totalAmount - totalPaid;

  const formatCurrency = (value: number) => {
    const [integerPart, decimalPart] = value.toFixed(2).split(".");
    const lastThree = integerPart.slice(-3);
    const otherDigits = integerPart.slice(0, -3);
    const formattedInteger = otherDigits
      ? otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree
      : lastThree;
    return `${formattedInteger}.${decimalPart}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>Bills & Payments</h1>
        <p className="text-muted-foreground mt-1">
          Track and manage all your bills and payment records
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-6 border border-border">
          <p className="text-sm text-muted-foreground">Total Bills</p>
          <h3 className="mt-1">{filteredBills.length}</h3>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border">
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <h3 className="mt-1">₹{formatCurrency(totalAmount)}</h3>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border">
          <p className="text-sm text-muted-foreground">Total Paid</p>
          <h3 className="mt-1 text-success">₹{formatCurrency(totalPaid)}</h3>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border">
          <p className="text-sm text-muted-foreground">Pending Amount</p>
          <h3 className="mt-1 text-warning">₹{formatCurrency(totalPending)}</h3>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by bill number or party name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option>All</option>
              <option>Purchase</option>
              <option>Sales</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option>All</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Partial</option>
              <option>Overdue</option>
            </select>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Bill Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Party
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Amount Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{bill.billNo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                        bill.type === "Purchase"
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary/10 text-secondary"
                      }`}
                    >
                      {bill.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{bill.party}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(bill.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-success">
                    ₹{formatCurrency(bill.paid)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs ${getStatusColor(
                        bill.status
                      )}`}
                    >
                      {getStatusIcon(bill.status)}
                      {bill.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedBill(bill);
                          setShowInvoice(true);
                        }}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => downloadPDF(bill)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showInvoice && selectedBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl p-6 w-[500px] border border-border">

            <h2 className="text-xl font-semibold mb-6">
              Invoice Details
            </h2>

            <div className="space-y-3">

              <div className="flex justify-between">
                <span>Bill No</span>
                <strong>{selectedBill.billNo}</strong>
              </div>

              <div className="flex justify-between">
                <span>Type</span>
                <strong>{selectedBill.type}</strong>
              </div>

              <div className="flex justify-between">
                <span>Customer / Supplier</span>
                <strong>{selectedBill.party}</strong>
              </div>

              <div className="flex justify-between">
                <span>Date</span>
                <strong>
                  {new Date(selectedBill.date).toLocaleDateString()}
                </strong>
              </div>

              <div className="flex justify-between">
                <span>Amount</span>
                <strong>₹{formatCurrency(selectedBill.amount)}</strong>
              </div>

              <div className="flex justify-between">
                <span>Status</span>
                <strong>{selectedBill.status}</strong>
              </div>

            </div>

            <div className="flex gap-3 mt-8">

              <button
                onClick={() => downloadPDF(selectedBill)}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg"
              >
                Download PDF
              </button>

              <button
                onClick={() => setShowInvoice(false)}
                className="px-5 py-2 bg-muted rounded-lg"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

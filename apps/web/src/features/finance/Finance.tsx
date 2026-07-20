import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal } from '../../components/UI';
import { IoAdd, IoCashOutline, IoDownloadOutline, IoEyeOutline, IoMailOutline } from 'react-icons/io5';
import API from '../../services/api';
import type { Invoice } from '../../../../../packages/shared/types';

export const Finance: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoicePdf, setShowInvoicePdf] = useState<boolean>(false);

  // New Invoice Form State
  const [clientName, setClientName] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  
  // Invoice items state
  const [items, setItems] = useState<{ desc: string; qty: number; rate: number }[]>([
    { desc: 'Technical Writing SRS Spec', qty: 1, rate: 2500 }
  ]);

  const loadInvoices = async () => {
    try {
      const data = await API.finance.listInvoices();
      setInvoices(data);
      if (data.length > 0 && !selectedInvoice) {
        setSelectedInvoice(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleAddItemRow = () => {
    setItems([...items, { desc: '', qty: 1, rate: 500 }]);
  };

  const handleItemChange = (index: number, field: 'desc' | 'qty' | 'rate', val: any) => {
    const updated = items.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: val };
      }
      return item;
    });
    setItems(updated);
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const subtotal = items.reduce((acc, curr) => acc + (curr.qty * curr.rate), 0);
    const tax = Math.round(subtotal * 0.18); // 18% GST standard
    const total = subtotal + tax;

    try {
      const formattedItems = items.map(item => ({
        description: item.desc,
        quantity: item.qty,
        rate: item.rate,
        amount: item.qty * item.rate
      }));

      const newInv = await API.finance.createInvoice({
        invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        clientName,
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        items: formattedItems,
        subtotal,
        taxRate: 18,
        taxAmount: tax,
        total,
        status: 'Draft'
      });

      // Clear
      setClientName('');
      setDueDate('');
      setItems([{ desc: 'Technical Writing SRS Spec', qty: 1, rate: 2500 }]);
      
      setModalOpen(false);
      setSelectedInvoice(newInv);
      loadInvoices();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      const updated = await API.finance.markAsPaid(id);
      setSelectedInvoice(updated);
      loadInvoices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-display text-white tracking-tight">Billing</h1>
          <p className="text-xs text-slate-400 mt-1">Manage client invoices, view payment status, and generate billing reports.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="text-xs flex items-center gap-1.5 bg-[#22C55E] hover:bg-[#1db053] text-white">
          <IoAdd size={16} /> Create Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Invoice list */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 font-display">Invoices</h3>
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {invoices.map((inv) => (
                <button
                  key={inv._id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`w-full flex items-start justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedInvoice?._id === inv._id 
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25 shadow-inner' 
                      : 'bg-slate-900/40 border-slate-850 hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-200 truncate">{inv.invoiceNumber}</h4>
                    <p className="text-[9px] text-slate-500 font-semibold truncate mt-0.5">{inv.clientName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-200 block">₹{inv.total.toLocaleString()}</span>
                    <Badge variant={inv.status === 'Paid' ? 'success' : inv.status === 'Sent' ? 'primary' : 'secondary'}>
                      {inv.status}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Selected Invoice billing panel */}
        <div className="lg:col-span-2 space-y-4">
          {selectedInvoice ? (
            <Card className="min-h-[460px] flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 rounded-xl">
                      <IoCashOutline size={20} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-200">{selectedInvoice.invoiceNumber}</h2>
                      <p className="text-[9px] text-slate-500 font-semibold uppercase mt-0.5">Due: {new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedInvoice.status !== 'Paid' && (
                      <Button onClick={() => handleMarkPaid(selectedInvoice._id)} size="sm" className="text-[10px] bg-[#22C55E] hover:bg-[#1db053] text-white">
                        Mark Paid
                      </Button>
                    )}
                    <Button onClick={() => setShowInvoicePdf(true)} size="sm" variant="secondary" className="text-[10px] flex items-center gap-1 bg-white text-[#111827] border border-[#22C55E]">
                      <IoEyeOutline size={12} /> View PDF
                    </Button>
                  </div>
                </div>

                {/* Billing Summary Table */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold">Client:</span>
                    <span className="font-bold text-white">{selectedInvoice.clientName}</span>
                  </div>

                  <div className="border border-slate-800 rounded-xl overflow-hidden mt-4">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-500 uppercase tracking-widest font-bold text-[9px]">
                          <th className="py-2.5 px-3">Description</th>
                          <th className="py-2.5 px-3 text-center">Qty</th>
                          <th className="py-2.5 px-3 text-right">Rate</th>
                          <th className="py-2.5 px-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvoice.items?.map((item, idx) => (
                          <tr key={idx} className="border-b border-slate-850 hover:bg-slate-900/10 text-slate-300">
                            <td className="py-3 px-3 font-semibold">{item.description}</td>
                            <td className="py-3 px-3 text-center font-mono">{item.quantity}</td>
                            <td className="py-3 px-3 text-right font-mono">₹{item.rate.toLocaleString()}</td>
                            <td className="py-3 px-3 text-right font-black text-slate-200">₹{item.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Calculations */}
                  <div className="space-y-1.5 max-w-xs ml-auto pt-4 border-t border-slate-800/40 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal:</span>
                      <span className="font-mono text-slate-300">₹{selectedInvoice.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Tax (18%):</span>
                      <span className="font-mono text-slate-300">₹{selectedInvoice.taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-2 font-bold text-sm">
                      <span className="text-white">Total:</span>
                      <span className="font-mono text-[#22C55E]">₹{selectedInvoice.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status footer */}
              <div className="border-t border-slate-850 pt-4 mt-8 flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                <span>Payment System: Connected</span>
                <Badge variant={selectedInvoice.status === 'Paid' ? 'success' : 'warning'}>{selectedInvoice.status}</Badge>
              </div>
            </Card>
          ) : (
            <div className="text-center py-20 text-slate-600">No invoice selected.</div>
          )}
        </div>
      </div>

      {/* Compile Invoice Modal Form */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Invoice">
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Client Name</label>
              <input
                type="text"
                required
                placeholder="Vercel"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-[#22C55E]/50"
              />
            </div>
          </div>

          {/* Dynamic items lists */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Invoice Items</span>
              <button 
                type="button" 
                onClick={handleAddItemRow}
                className="text-[10px] font-bold text-[#22C55E] hover:text-[#1db053] cursor-pointer"
              >
                + Add Line Item
              </button>
            </div>

            <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-6">
                    <input
                      type="text"
                      required
                      placeholder="Line item description..."
                      value={item.desc}
                      onChange={(e) => handleItemChange(idx, 'desc', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#22C55E]/50"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      required
                      placeholder="Qty"
                      value={item.qty}
                      onChange={(e) => handleItemChange(idx, 'qty', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#22C55E]/50"
                    />
                  </div>
                  <div className="col-span-4">
                    <input
                      type="number"
                      required
                      placeholder="Rate (₹)"
                      value={item.rate}
                      onChange={(e) => handleItemChange(idx, 'rate', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#22C55E]/50"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)} className="text-xs bg-white text-[#111827] border border-[#22C55E]">
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="text-xs bg-[#22C55E] hover:bg-[#1db053] text-white">
              Create Invoice
            </Button>
          </div>
        </form>
      </Modal>

      {/* Printable Invoice PDF simulator modal */}
      {selectedInvoice && (
        <Modal 
          isOpen={showInvoicePdf} 
          onClose={() => setShowInvoicePdf(false)} 
          title="Printable Invoice (PDF)"
          size="lg"
        >
          <div className="bg-white text-slate-950 p-8 rounded-2xl border border-slate-200 font-sans shadow-inner space-y-8 select-text">
            {/* Header info */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-black tracking-wider text-slate-900 font-display">StackPilot AI</h1>
                <p className="text-xs text-slate-500 mt-1">AI Project Management Platform</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  120 Pine Street, Suite 400<br />
                  San Francisco, CA 94103
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-black text-slate-900">INVOICE</h2>
                <span className="text-xs font-bold text-slate-500 block mt-1">{selectedInvoice.invoiceNumber}</span>
                <p className="text-[10px] text-slate-400 mt-2">
                  Due Date: {new Date(selectedInvoice.dueDate).toLocaleDateString()}<br />
                  Issued: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Client address */}
            <div className="border-t border-slate-200 pt-4">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Bill To:</span>
              <h3 className="text-xs font-bold text-slate-800">{selectedInvoice.clientName}</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Client Address</p>
            </div>

            {/* Items Table */}
            <div className="mt-6 border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-widest font-bold text-[9px]">
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Rate</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items?.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-100 text-slate-700">
                      <td className="py-3 px-3 font-semibold">{item.description}</td>
                      <td className="py-3 px-3 text-center font-mono">{item.quantity}</td>
                      <td className="py-3 px-3 text-right font-mono">₹{item.rate.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-black text-slate-900">₹{item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations and payment info */}
            <div className="flex justify-between items-start pt-4 border-t border-slate-200">
              <div className="max-w-xs">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Payment Instructions</span>
                <p className="text-[9px] text-slate-400 leading-relaxed">
                  Please process payments using the secure check-out link or via bank transfer. If you have any questions, contact billing@stackpilot.com.
                </p>
              </div>
              
              <div className="space-y-1.5 w-48 text-xs text-slate-600 text-right">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-slate-800">₹{selectedInvoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%):</span>
                  <span className="font-mono text-slate-800">₹{selectedInvoice.taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm text-slate-900">
                  <span>Total Due:</span>
                  <span className="font-mono text-[#22C55E]">₹{selectedInvoice.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="text-center pt-8 border-t border-slate-100 text-[9px] text-slate-400 font-bold uppercase tracking-widest select-none">
              Thank you for choosing StackPilot AI!
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => window.print()} className="text-xs flex items-center gap-1 bg-[#22C55E] hover:bg-[#1db053] text-white">
              <IoDownloadOutline size={14} /> Download PDF
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
export default Finance;

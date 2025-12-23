import { useState, useEffect } from 'react'
import {
  FileText, Plus, Users, Settings, Download, Trash2,
  Edit, Check, X, DollarSign, Calendar, Mail, Phone,
  MapPin, Search, Copy, Upload, Eye, BarChart3, TrendingUp,
  CheckCircle2, Clock, AlertCircle
} from 'lucide-react'
import jsPDF from 'jspdf'
import './App.css'

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [invoices, setInvoices] = useState([])
  const [clients, setClients] = useState([])
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Your Company Name',
    email: 'company@email.com',
    phone: '(555) 123-4567',
    address: '123 Business St, City, State 12345',
    logo: ''
  })

  const [showInvoiceForm, setShowInvoiceForm] = useState(false)
  const [showClientForm, setShowClientForm] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState(null)
  const [editingClient, setEditingClient] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [toasts, setToasts] = useState([])
  const [isExporting, setIsExporting] = useState(false)

  const [currentInvoice, setCurrentInvoice] = useState({
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    clientId: '',
    items: [{ description: '', quantity: 1, rate: 0 }],
    taxRate: 0,
    discount: 0,
    discountType: 'percentage',
    notes: '',
    status: 'unpaid'
  })

  const [currentClient, setCurrentClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })

  useEffect(() => {
    const savedInvoices = localStorage.getItem('invoices')
    const savedClients = localStorage.getItem('clients')
    const savedCompany = localStorage.getItem('companyInfo')

    if (savedInvoices) setInvoices(JSON.parse(savedInvoices))
    if (savedClients) setClients(JSON.parse(savedClients))
    if (savedCompany) setCompanyInfo(JSON.parse(savedCompany))
  }, [])

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices))
  }, [invoices])

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients))
  }, [clients])

  useEffect(() => {
    localStorage.setItem('companyInfo', JSON.stringify(companyInfo))
  }, [companyInfo])

  const showToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear()
    const count = invoices.length + 1
    return `INV-${year}-${String(count).padStart(4, '0')}`
  }

  const calculateSubtotal = (items) => {
    return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0)
  }

  const calculateTotal = (invoice) => {
    const subtotal = calculateSubtotal(invoice.items)
    const taxAmount = subtotal * (invoice.taxRate / 100)
    let discountAmount = 0

    if (invoice.discountType === 'percentage') {
      discountAmount = subtotal * (invoice.discount / 100)
    } else {
      discountAmount = invoice.discount
    }

    return subtotal + taxAmount - discountAmount
  }

  const validateInvoice = () => {
    if (!currentInvoice.clientId) {
      showToast('Please select a client', 'error')
      return false
    }
    if (!currentInvoice.invoiceNumber) {
      showToast('Invoice number is required', 'error')
      return false
    }
    if (!currentInvoice.dueDate) {
      showToast('Due date is required', 'error')
      return false
    }
    if (currentInvoice.items.length === 0 || !currentInvoice.items[0].description) {
      showToast('Add at least one item with description', 'error')
      return false
    }
    return true
  }

  const handleAddInvoice = () => {
    setCurrentInvoice({
      invoiceNumber: generateInvoiceNumber(),
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      clientId: '',
      items: [{ description: '', quantity: 1, rate: 0 }],
      taxRate: 0,
      discount: 0,
      discountType: 'percentage',
      notes: '',
      status: 'unpaid'
    })
    setEditingInvoice(null)
    setShowInvoiceForm(true)
  }

  const handleDuplicateInvoice = (invoice) => {
    setCurrentInvoice({
      ...invoice,
      invoiceNumber: generateInvoiceNumber(),
      date: new Date().toISOString().split('T')[0],
      status: 'unpaid'
    })
    setEditingInvoice(null)
    setShowInvoiceForm(true)
    showToast('Invoice duplicated - update details as needed', 'info')
  }

  const handleSaveInvoice = () => {
    if (!validateInvoice()) return

    if (editingInvoice !== null) {
      const updated = [...invoices]
      updated[editingInvoice] = { ...currentInvoice, id: invoices[editingInvoice].id }
      setInvoices(updated)
      showToast('Invoice updated successfully', 'success')
    } else {
      setInvoices([...invoices, { ...currentInvoice, id: Date.now() }])
      showToast('Invoice created successfully', 'success')
    }

    setShowInvoiceForm(false)
    setCurrentInvoice({
      invoiceNumber: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      clientId: '',
      items: [{ description: '', quantity: 1, rate: 0 }],
      taxRate: 0,
      discount: 0,
      discountType: 'percentage',
      notes: '',
      status: 'unpaid'
    })
  }

  const handleEditInvoice = (index) => {
    setCurrentInvoice(invoices[index])
    setEditingInvoice(index)
    setShowInvoiceForm(true)
  }

  const handleDeleteInvoice = (index) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(invoices.filter((_, i) => i !== index))
      showToast('Invoice deleted', 'success')
    }
  }

  const toggleInvoiceStatus = (index) => {
    const updated = [...invoices]
    updated[index].status = updated[index].status === 'paid' ? 'unpaid' : 'paid'
    setInvoices(updated)
    showToast(`Invoice marked as ${updated[index].status}`, 'success')
  }

  const handleAddClient = () => {
    setCurrentClient({ name: '', email: '', phone: '', address: '' })
    setEditingClient(null)
    setShowClientForm(true)
  }

  const handleSaveClient = () => {
    if (!currentClient.name) {
      showToast('Client name is required', 'error')
      return
    }

    if (editingClient !== null) {
      const updated = [...clients]
      updated[editingClient] = { ...currentClient, id: clients[editingClient].id }
      setClients(updated)
      showToast('Client updated successfully', 'success')
    } else {
      setClients([...clients, { ...currentClient, id: Date.now() }])
      showToast('Client added successfully', 'success')
    }

    setShowClientForm(false)
    setCurrentClient({ name: '', email: '', phone: '', address: '' })
  }

  const handleEditClient = (index) => {
    setCurrentClient(clients[index])
    setEditingClient(index)
    setShowClientForm(true)
  }

  const handleDeleteClient = (index) => {
    if (confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter((_, i) => i !== index))
      showToast('Client deleted', 'success')
    }
  }

  const addInvoiceItem = () => {
    setCurrentInvoice({
      ...currentInvoice,
      items: [...currentInvoice.items, { description: '', quantity: 1, rate: 0 }]
    })
  }

  const removeInvoiceItem = (index) => {
    setCurrentInvoice({
      ...currentInvoice,
      items: currentInvoice.items.filter((_, i) => i !== index)
    })
  }

  const updateInvoiceItem = (index, field, value) => {
    const updated = [...currentInvoice.items]
    updated[index][field] = value
    setCurrentInvoice({ ...currentInvoice, items: updated })
  }

  const exportToPDF = (invoice) => {
    setIsExporting(true)

    setTimeout(() => {
      const client = clients.find(c => c.id === invoice.clientId)
      if (!client) {
        setIsExporting(false)
        return
      }

      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()

      doc.setFontSize(24)
      doc.setFont(undefined, 'bold')
      doc.text(companyInfo.name, 20, 20)

      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      doc.text(companyInfo.email, 20, 28)
      doc.text(companyInfo.phone, 20, 34)
      doc.text(companyInfo.address, 20, 40)

      doc.setFontSize(28)
      doc.setFont(undefined, 'bold')
      doc.text('INVOICE', pageWidth - 20, 20, { align: 'right' })

      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      doc.text(`Invoice #: ${invoice.invoiceNumber}`, pageWidth - 20, 30, { align: 'right' })
      doc.text(`Date: ${invoice.date}`, pageWidth - 20, 36, { align: 'right' })
      doc.text(`Due: ${invoice.dueDate}`, pageWidth - 20, 42, { align: 'right' })

      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('Bill To:', 20, 60)

      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      doc.text(client.name, 20, 68)
      if (client.email) doc.text(client.email, 20, 74)
      if (client.phone) doc.text(client.phone, 20, 80)
      if (client.address) doc.text(client.address, 20, 86)

      let yPos = 110
      doc.setFillColor(100, 100, 255)
      doc.rect(20, yPos, pageWidth - 40, 10, 'F')

      doc.setTextColor(255, 255, 255)
      doc.setFont(undefined, 'bold')
      doc.text('Description', 25, yPos + 7)
      doc.text('Qty', pageWidth - 90, yPos + 7)
      doc.text('Rate', pageWidth - 60, yPos + 7)
      doc.text('Amount', pageWidth - 25, yPos + 7, { align: 'right' })

      doc.setTextColor(0, 0, 0)
      doc.setFont(undefined, 'normal')
      yPos += 15

      invoice.items.forEach(item => {
        const amount = item.quantity * item.rate
        doc.text(item.description, 25, yPos)
        doc.text(String(item.quantity), pageWidth - 90, yPos)
        doc.text(`$${item.rate.toFixed(2)}`, pageWidth - 60, yPos)
        doc.text(`$${amount.toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' })
        yPos += 7
      })

      yPos += 10
      const subtotal = calculateSubtotal(invoice.items)
      const taxAmount = subtotal * (invoice.taxRate / 100)
      let discountAmount = 0

      if (invoice.discountType === 'percentage') {
        discountAmount = subtotal * (invoice.discount / 100)
      } else {
        discountAmount = invoice.discount
      }

      const total = subtotal + taxAmount - discountAmount

      doc.text('Subtotal:', pageWidth - 70, yPos)
      doc.text(`$${subtotal.toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' })
      yPos += 7

      if (invoice.taxRate > 0) {
        doc.text(`Tax (${invoice.taxRate}%):`, pageWidth - 70, yPos)
        doc.text(`$${taxAmount.toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' })
        yPos += 7
      }

      if (invoice.discount > 0) {
        const discountLabel = invoice.discountType === 'percentage'
          ? `Discount (${invoice.discount}%):`
          : 'Discount:'
        doc.text(discountLabel, pageWidth - 70, yPos)
        doc.text(`-$${discountAmount.toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' })
        yPos += 7
      }

      doc.setFont(undefined, 'bold')
      doc.setFontSize(12)
      doc.text('Total:', pageWidth - 70, yPos)
      doc.text(`$${total.toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' })

      if (invoice.notes) {
        yPos += 20
        doc.setFontSize(10)
        doc.setFont(undefined, 'bold')
        doc.text('Notes:', 20, yPos)
        doc.setFont(undefined, 'normal')
        const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - 40)
        doc.text(splitNotes, 20, yPos + 7)
      }

      doc.save(`${invoice.invoiceNumber}.pdf`)
      setIsExporting(false)
      showToast('PDF exported successfully', 'success')
    }, 500)
  }

  const exportData = () => {
    const data = {
      invoices,
      clients,
      companyInfo,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoicepro-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Data exported successfully', 'success')
  }

  const importData = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (confirm('This will replace all current data. Continue?')) {
          setInvoices(data.invoices || [])
          setClients(data.clients || [])
          setCompanyInfo(data.companyInfo || companyInfo)
          showToast('Data imported successfully', 'success')
        }
      } catch (error) {
        showToast('Invalid backup file', 'error')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const filteredInvoices = invoices.filter(invoice => {
    const client = clients.find(c => c.id === invoice.clientId)
    const matchesSearch = !searchTerm ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client && client.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filterStatus === 'all' || invoice.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const stats = {
    totalRevenue: invoices.reduce((sum, inv) => sum + calculateTotal(inv), 0),
    paidRevenue: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + calculateTotal(inv), 0),
    unpaidRevenue: invoices.filter(inv => inv.status === 'unpaid').reduce((sum, inv) => sum + calculateTotal(inv), 0),
    totalInvoices: invoices.length,
    paidInvoices: invoices.filter(inv => inv.status === 'paid').length,
    unpaidInvoices: invoices.filter(inv => inv.status === 'unpaid').length,
    totalClients: clients.length
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <FileText size={32} />
            <h1>InvoicePro</h1>
          </div>
          <nav className="nav">
            <button
              className={activeView === 'dashboard' ? 'active' : ''}
              onClick={() => setActiveView('dashboard')}
            >
              <BarChart3 size={18} />
              Dashboard
            </button>
            <button
              className={activeView === 'invoices' ? 'active' : ''}
              onClick={() => setActiveView('invoices')}
            >
              <FileText size={18} />
              Invoices
            </button>
            <button
              className={activeView === 'clients' ? 'active' : ''}
              onClick={() => setActiveView('clients')}
            >
              <Users size={18} />
              Clients
            </button>
            <button
              className={activeView === 'settings' ? 'active' : ''}
              onClick={() => setActiveView('settings')}
            >
              <Settings size={18} />
              Settings
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        {activeView === 'dashboard' && (
          <div className="view-container">
            <div className="view-header">
              <h2>Dashboard</h2>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon revenue">
                  <DollarSign size={24} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Total Revenue</p>
                  <h3 className="stat-value">${stats.totalRevenue.toFixed(2)}</h3>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon success">
                  <CheckCircle2 size={24} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Paid Revenue</p>
                  <h3 className="stat-value">${stats.paidRevenue.toFixed(2)}</h3>
                  <p className="stat-detail">{stats.paidInvoices} invoices</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon warning">
                  <Clock size={24} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Unpaid Revenue</p>
                  <h3 className="stat-value">${stats.unpaidRevenue.toFixed(2)}</h3>
                  <p className="stat-detail">{stats.unpaidInvoices} invoices</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon info">
                  <Users size={24} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Total Clients</p>
                  <h3 className="stat-value">{stats.totalClients}</h3>
                </div>
              </div>
            </div>

            <div className="dashboard-actions">
              <button className="btn-primary" onClick={handleAddInvoice}>
                <Plus size={18} />
                New Invoice
              </button>
              <button className="btn-secondary" onClick={handleAddClient}>
                <Plus size={18} />
                New Client
              </button>
              <button className="btn-secondary" onClick={exportData}>
                <Download size={18} />
                Export Data
              </button>
              <label className="btn-secondary">
                <Upload size={18} />
                Import Data
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {invoices.length > 0 && (
              <div className="recent-section">
                <h3>Recent Invoices</h3>
                <div className="invoice-grid">
                  {invoices.slice(-6).reverse().map((invoice, index) => {
                    const client = clients.find(c => c.id === invoice.clientId)
                    const total = calculateTotal(invoice)
                    const actualIndex = invoices.indexOf(invoice)
                    return (
                      <div key={invoice.id} className="invoice-card">
                        <div className="invoice-card-header">
                          <div>
                            <h3>{invoice.invoiceNumber}</h3>
                            <p className="client-name">{client?.name || 'Unknown Client'}</p>
                          </div>
                          <span className={`status-badge ${invoice.status}`}>
                            {invoice.status}
                          </span>
                        </div>
                        <div className="invoice-card-body">
                          <div className="invoice-detail">
                            <Calendar size={16} />
                            <span>Due: {invoice.dueDate}</span>
                          </div>
                          <div className="invoice-total">
                            <DollarSign size={20} />
                            <span>${total.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="invoice-card-actions">
                          <button
                            className="btn-icon"
                            onClick={() => toggleInvoiceStatus(actualIndex)}
                            title={invoice.status === 'paid' ? 'Mark as unpaid' : 'Mark as paid'}
                          >
                            <Check size={18} />
                          </button>
                          <button
                            className="btn-icon"
                            onClick={() => exportToPDF(invoice)}
                            title="Download PDF"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {activeView === 'invoices' && (
          <div className="view-container">
            <div className="view-header">
              <h2>Invoices</h2>
              <div className="toolbar">
                <div className="search-box">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="filter-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
                <button className="btn-primary" onClick={handleAddInvoice}>
                  <Plus size={18} />
                  New Invoice
                </button>
              </div>
            </div>

            {filteredInvoices.length === 0 ? (
              <div className="empty-state">
                <FileText size={64} />
                <h3>No invoices yet</h3>
                <p>Create your first invoice to get started</p>
                <button className="btn-primary" onClick={handleAddInvoice}>
                  <Plus size={18} />
                  Create Invoice
                </button>
              </div>
            ) : (
              <div className="invoice-grid">
                {filteredInvoices.map((invoice, index) => {
                  const client = clients.find(c => c.id === invoice.clientId)
                  const total = calculateTotal(invoice)
                  return (
                    <div key={invoice.id} className="invoice-card">
                      <div className="invoice-card-header">
                        <div>
                          <h3>{invoice.invoiceNumber}</h3>
                          <p className="client-name">{client?.name || 'Unknown Client'}</p>
                        </div>
                        <span className={`status-badge ${invoice.status}`}>
                          {invoice.status}
                        </span>
                      </div>
                      <div className="invoice-card-body">
                        <div className="invoice-detail">
                          <Calendar size={16} />
                          <span>Due: {invoice.dueDate}</span>
                        </div>
                        <div className="invoice-total">
                          <DollarSign size={20} />
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="invoice-card-actions">
                        <button
                          className="btn-icon"
                          onClick={() => toggleInvoiceStatus(invoices.indexOf(invoice))}
                          title={invoice.status === 'paid' ? 'Mark as unpaid' : 'Mark as paid'}
                        >
                          <Check size={18} />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleEditInvoice(invoices.indexOf(invoice))}
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleDuplicateInvoice(invoice)}
                          title="Duplicate"
                        >
                          <Copy size={18} />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => exportToPDF(invoice)}
                          title="Download PDF"
                          disabled={isExporting}
                        >
                          <Download size={18} />
                        </button>
                        <button
                          className="btn-icon danger"
                          onClick={() => handleDeleteInvoice(invoices.indexOf(invoice))}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeView === 'clients' && (
          <div className="view-container">
            <div className="view-header">
              <h2>Clients</h2>
              <button className="btn-primary" onClick={handleAddClient}>
                <Plus size={18} />
                New Client
              </button>
            </div>

            {clients.length === 0 ? (
              <div className="empty-state">
                <Users size={64} />
                <h3>No clients yet</h3>
                <p>Add your first client to start creating invoices</p>
                <button className="btn-primary" onClick={handleAddClient}>
                  <Plus size={18} />
                  Add Client
                </button>
              </div>
            ) : (
              <div className="client-grid">
                {clients.map((client, index) => (
                  <div key={client.id} className="client-card">
                    <h3>{client.name}</h3>
                    <div className="client-details">
                      {client.email && (
                        <div className="client-detail">
                          <Mail size={16} />
                          <span>{client.email}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="client-detail">
                          <Phone size={16} />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      {client.address && (
                        <div className="client-detail">
                          <MapPin size={16} />
                          <span>{client.address}</span>
                        </div>
                      )}
                    </div>
                    <div className="client-card-actions">
                      <button
                        className="btn-icon"
                        onClick={() => handleEditClient(index)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="btn-icon danger"
                        onClick={() => handleDeleteClient(index)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeView === 'settings' && (
          <div className="view-container">
            <div className="view-header">
              <h2>Company Settings</h2>
            </div>
            <div className="settings-form">
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  value={companyInfo.name}
                  onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={companyInfo.email}
                  onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={companyInfo.phone}
                  onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={companyInfo.address}
                  onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                  rows="3"
                />
              </div>
              <button className="btn-primary" onClick={() => showToast('Settings saved', 'success')}>
                Save Settings
              </button>
            </div>
          </div>
        )}
      </main>

      {showInvoiceForm && (
        <div className="modal-overlay" onClick={() => setShowInvoiceForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingInvoice !== null ? 'Edit Invoice' : 'New Invoice'}</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn-secondary-sm"
                  onClick={() => {
                    setShowPreview(true)
                    setShowInvoiceForm(false)
                  }}
                >
                  <Eye size={18} />
                  Preview
                </button>
                <button className="btn-icon" onClick={() => setShowInvoiceForm(false)}>
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Invoice Number *</label>
                  <input
                    type="text"
                    value={currentInvoice.invoiceNumber}
                    onChange={(e) => setCurrentInvoice({...currentInvoice, invoiceNumber: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Client *</label>
                  <select
                    value={currentInvoice.clientId}
                    onChange={(e) => setCurrentInvoice({...currentInvoice, clientId: Number(e.target.value)})}
                  >
                    <option value="">Select Client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Invoice Date</label>
                  <input
                    type="date"
                    value={currentInvoice.date}
                    onChange={(e) => setCurrentInvoice({...currentInvoice, date: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Due Date *</label>
                  <input
                    type="date"
                    value={currentInvoice.dueDate}
                    onChange={(e) => setCurrentInvoice({...currentInvoice, dueDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="items-section">
                <h3>Items</h3>
                {currentInvoice.items.map((item, index) => (
                  <div key={index} className="item-row">
                    <input
                      type="text"
                      placeholder="Description *"
                      value={item.description}
                      onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateInvoiceItem(index, 'quantity', Number(e.target.value))}
                      className="qty-input"
                    />
                    <input
                      type="number"
                      placeholder="Rate"
                      value={item.rate}
                      onChange={(e) => updateInvoiceItem(index, 'rate', Number(e.target.value))}
                      className="rate-input"
                    />
                    <div className="item-total">${(item.quantity * item.rate).toFixed(2)}</div>
                    {currentInvoice.items.length > 1 && (
                      <button
                        className="btn-icon danger"
                        onClick={() => removeInvoiceItem(index)}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button className="btn-secondary" onClick={addInvoiceItem}>
                  <Plus size={18} />
                  Add Item
                </button>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tax Rate (%)</label>
                  <input
                    type="number"
                    value={currentInvoice.taxRate}
                    onChange={(e) => setCurrentInvoice({...currentInvoice, taxRate: Number(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Discount</label>
                  <div className="discount-input">
                    <input
                      type="number"
                      value={currentInvoice.discount}
                      onChange={(e) => setCurrentInvoice({...currentInvoice, discount: Number(e.target.value)})}
                    />
                    <select
                      value={currentInvoice.discountType}
                      onChange={(e) => setCurrentInvoice({...currentInvoice, discountType: e.target.value})}
                    >
                      <option value="percentage">%</option>
                      <option value="fixed">$</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={currentInvoice.notes}
                  onChange={(e) => setCurrentInvoice({...currentInvoice, notes: e.target.value})}
                  rows="3"
                  placeholder="Payment terms, thank you message, etc."
                />
              </div>

              <div className="invoice-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal(currentInvoice.items).toFixed(2)}</span>
                </div>
                {currentInvoice.taxRate > 0 && (
                  <div className="summary-row">
                    <span>Tax ({currentInvoice.taxRate}%):</span>
                    <span>${(calculateSubtotal(currentInvoice.items) * currentInvoice.taxRate / 100).toFixed(2)}</span>
                  </div>
                )}
                {currentInvoice.discount > 0 && (
                  <div className="summary-row">
                    <span>Discount:</span>
                    <span>-${(currentInvoice.discountType === 'percentage'
                      ? calculateSubtotal(currentInvoice.items) * currentInvoice.discount / 100
                      : currentInvoice.discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${calculateTotal(currentInvoice).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowInvoiceForm(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveInvoice}>
                Save Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="modal preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Invoice Preview</h2>
              <button className="btn-icon" onClick={() => setShowPreview(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="invoice-preview">
                <div className="preview-header">
                  <div>
                    <h2>{companyInfo.name}</h2>
                    <p>{companyInfo.email}</p>
                    <p>{companyInfo.phone}</p>
                    <p>{companyInfo.address}</p>
                  </div>
                  <div className="preview-invoice-info">
                    <h1>INVOICE</h1>
                    <p>#{currentInvoice.invoiceNumber}</p>
                    <p>Date: {currentInvoice.date}</p>
                    <p>Due: {currentInvoice.dueDate}</p>
                  </div>
                </div>

                <div className="preview-client">
                  <h3>Bill To:</h3>
                  {currentInvoice.clientId && (() => {
                    const client = clients.find(c => c.id === currentInvoice.clientId)
                    return client ? (
                      <>
                        <p>{client.name}</p>
                        {client.email && <p>{client.email}</p>}
                        {client.phone && <p>{client.phone}</p>}
                        {client.address && <p>{client.address}</p>}
                      </>
                    ) : <p>No client selected</p>
                  })()}
                </div>

                <table className="preview-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Rate</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentInvoice.items.map((item, i) => (
                      <tr key={i}>
                        <td>{item.description || '-'}</td>
                        <td>{item.quantity}</td>
                        <td>${item.rate.toFixed(2)}</td>
                        <td>${(item.quantity * item.rate).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="preview-totals">
                  <div><span>Subtotal:</span> <span>${calculateSubtotal(currentInvoice.items).toFixed(2)}</span></div>
                  {currentInvoice.taxRate > 0 && (
                    <div><span>Tax ({currentInvoice.taxRate}%):</span> <span>${(calculateSubtotal(currentInvoice.items) * currentInvoice.taxRate / 100).toFixed(2)}</span></div>
                  )}
                  {currentInvoice.discount > 0 && (
                    <div><span>Discount:</span> <span>-${(currentInvoice.discountType === 'percentage'
                      ? calculateSubtotal(currentInvoice.items) * currentInvoice.discount / 100
                      : currentInvoice.discount).toFixed(2)}</span></div>
                  )}
                  <div className="preview-total"><span>Total:</span> <span>${calculateTotal(currentInvoice).toFixed(2)}</span></div>
                </div>

                {currentInvoice.notes && (
                  <div className="preview-notes">
                    <h4>Notes:</h4>
                    <p>{currentInvoice.notes}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => {
                setShowPreview(false)
                setShowInvoiceForm(true)
              }}>
                Back to Edit
              </button>
              <button className="btn-primary" onClick={() => {
                setShowPreview(false)
                handleSaveInvoice()
              }}>
                Save Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {showClientForm && (
        <div className="modal-overlay" onClick={() => setShowClientForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingClient !== null ? 'Edit Client' : 'New Client'}</h2>
              <button className="btn-icon" onClick={() => setShowClientForm(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={currentClient.name}
                  onChange={(e) => setCurrentClient({...currentClient, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={currentClient.email}
                  onChange={(e) => setCurrentClient({...currentClient, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={currentClient.phone}
                  onChange={(e) => setCurrentClient({...currentClient, phone: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={currentClient.address}
                  onChange={(e) => setCurrentClient({...currentClient, address: e.target.value})}
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowClientForm(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveClient}>
                Save Client
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.type === 'success' && <CheckCircle2 size={20} />}
            {toast.type === 'error' && <AlertCircle size={20} />}
            {toast.type === 'info' && <AlertCircle size={20} />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {isExporting && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Generating PDF...</p>
        </div>
      )}
    </div>
  )
}

export default App

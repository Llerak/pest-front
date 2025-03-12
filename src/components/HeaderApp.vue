<!-- HeaderApp.vue -->
<template>
  <header class="flex w-full justify-center h-16 items-center">
    <nav class="flex gap-2 h-min">
      <SubMenu
        title="Administration"
        :items="[
          {
            name: 'Customers',
            componentName: 'Customers',
          },
          { name: 'Payments Registration', componentName: 'Payment Registration' },
          { name: 'Delete Invoices', componentName: 'Delete Invoice' },
        ]"
      />
      <SubMenu
        title="Process"
        :items="[
          { name: 'Generate invoices customer', componentName: 'Generate Invoice Customer' },
          { name: 'Generate invoices route', componentName: 'Generate Invoice Route' },
        ]"
      />
      <SubMenu
        title="Utilities"
        :items="[
          { name: 'Create Modify User', componentName: 'User View' },
          { name: 'Change Password', componentName: 'Change Password View' },
        ]"
      />
      <SubMenu
        title="Reports"
        :items="[
          { name: 'Customers', componentName: '', onClick: generateCustomerPDF },
          { name: 'Invoices one customer', componentName: 'InvoiceCustomerPDF' },
          {
            name: 'Invoices all customers',
            componentName: '',
            onClick: generateInvoicePDFByCustomerName,
          },
          { name: 'Invoices by route', componentName: '', onClick: generateInvoicePDFByRoute },
          { name: 'Invoices by month', componentName: '', onClick: generateInvoicePDFByMonth },
          { name: 'Invoices of date', componentName: 'InvoiceDatePDF' },
          {
            name: 'Payment by month',
            componentName: '',
            onClick: generatePaymentRegistrationPDFByMonth,
          },
        ]"
      />
      <p class="p-2 cursor-pointer" @click="exit">Exit</p>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { getAllCustomers } from '@/services/customerService'
import { getAllInvoice } from '@/services/invoiceService'
import { invoiceStore } from '@/store/invoiceStore'
import SubMenu from './SubMenu.vue'
import { customerStore } from '@/store/customerStore'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type ICustomer from '@/interfaces/ICustomer'
import type IInvoice from '@/interfaces/IInvoice'
import type IPaymentRegistration from '@/interfaces/IPaymentRegistration'
import { paymentRegistrationStore } from '@/store/paymentRegistrationStore'
import { getAllPaymentRegistration } from '@/services/paymentRegistrationService'

function exit() {
  location.reload()
  sessionStorage.clear()
  localStorage.clear()
}

// Function to generate the PDF with customer data
const generateCustomerPDF = async () => {
  await getAllCustomers()
  const customers = customerStore.value // Retrieve data from the store

  const doc = new jsPDF()
  const headers = [
    'ID',
    'First Name',
    'Last Name',
    'Telephone',
    'Address',
    'City',
    'State',
    'Email',
    'Route',
    'Monthly Fee',
  ]

  const data = customers.map((customer) => [
    customer.id,
    customer.firstName,
    customer.lastName,
    customer.telephone,
    `${customer.address1}, ${customer.address2}`,
    customer.city,
    customer.state,
    customer.email,
    customer.route,
    customer.monthlyFee.toFixed(2), // Format the number to two decimals
  ])

  // Calculate the total of all monthly fees
  const totalMonthlyFee = customers
    .reduce((total, customer) => total + customer.monthlyFee, 0)
    .toFixed(2)

  // Add a row at the end to display the total
  data.push(['', '', '', '', '', '', '', '', 'Total:', totalMonthlyFee])

  // Generate the table
  autoTable(doc, {
    head: [headers],
    body: data,
  })

  // Save the PDF file
  doc.save('Customers.pdf')
}
const generateInvoicePDFByRoute = async (): Promise<void> => {
  await getAllInvoice()
  await getAllCustomers()

  const customers: ICustomer[] = customerStore.value // Retrieve customer data
  const invoices: IInvoice[] = invoiceStore.value // Retrieve invoice data

  const doc = new jsPDF()
  const headers = ['Route', 'Customer ID', 'Customer Name', 'Invoice', 'Date', 'Amount']

  // Group invoices by route
  const groupedData: { [route: number]: IInvoice[] } = invoices.reduce(
    (acc, invoice) => {
      const customer = customers.find((c) => c.id === invoice.customer_id)
      if (customer) {
        if (!acc[customer.route]) {
          acc[customer.route] = []
        }
        acc[customer.route].push(invoice)
      }
      return acc
    },
    {} as { [route: number]: IInvoice[] },
  )

  const data: Array<Array<string | number>> = []
  Object.keys(groupedData).forEach((route) => {
    const routeInvoices = groupedData[+route] // Convert route to number

    // Add rows for each invoice in the route
    routeInvoices.forEach((invoice) => {
      const customer = customers.find((c) => c.id === invoice.customer_id)
      data.push([
        route,
        invoice.customer_id,
        invoice.customer_name || `${customer?.firstName} ${customer?.lastName}`,
        invoice.id,
        invoice.date,
        invoice.amount.toFixed(2),
      ])
    })

    // Calculate and add the total for the route
    const routeTotal = routeInvoices
      .reduce((total, invoice) => total + invoice.amount, 0)
      .toFixed(2)
    data.push(['', '', '', '', `Route ${route} Total:`, routeTotal])
  })

  // Generate the table
  autoTable(doc, {
    head: [headers],
    body: data,
  })

  // Save the PDF file
  doc.save('InvoicesByRoute.pdf')
}
const generateInvoicePDFByCustomerName = async (): Promise<void> => {
  await getAllInvoice()
  await getAllCustomers()

  const customers: ICustomer[] = customerStore.value // Retrieve customer data
  const invoices: IInvoice[] = invoiceStore.value // Retrieve invoice data

  const doc = new jsPDF()
  const headers = ['Customer Name', 'Customer ID', 'Route', 'Invoice', 'Date', 'Amount']

  // Combine customer and invoice data and sort by customer name
  const combinedData = invoices
    .map((invoice) => {
      const customer = customers.find((c) => c.id === invoice.customer_id)
      return {
        customer_name: invoice.customer_name || `${customer?.firstName} ${customer?.lastName}`,
        customer_id: invoice.customer_id,
        route: customer?.route || 0,
        invoice: invoice.id,
        date: invoice.date,
        amount: invoice.amount,
      }
    })
    .sort((a, b) => a.customer_name.localeCompare(b.customer_name)) // Sort alphabetically by name

  const data: Array<Array<string | number>> = combinedData.map((entry) => [
    entry.customer_name,
    entry.customer_id,
    entry.route,
    entry.invoice,
    entry.date,
    entry.amount.toFixed(2),
  ])

  // Generate the table
  autoTable(doc, {
    head: [headers],
    body: data,
  })

  // Save the PDF file
  doc.save('InvoicesByCustomerName.pdf')
}
const generateInvoicePDFByMonth = async (): Promise<void> => {
  await getAllInvoice()
  await getAllCustomers()

  const customers: ICustomer[] = customerStore.value // Retrieve customer data
  const invoices: IInvoice[] = invoiceStore.value // Retrieve invoice data

  const doc = new jsPDF()
  const headers = ['Route', 'Customer ID', 'Customer Name', 'Invoice', 'Date', 'Amount']

  // Combine customer and invoice data
  const combinedData = invoices.map((invoice) => {
    const customer = customers.find((c) => c.id === invoice.customer_id)
    return {
      route: customer?.route || 0,
      customer_id: invoice.customer_id,
      customer_name: invoice.customer_name || `${customer?.firstName} ${customer?.lastName}`,
      invoice: invoice.id,
      date: invoice.date,
      amount: invoice.amount,
      month: invoice.date.slice(5, 7), // Extract month as a string
    }
  })

  // Sort combined data by month
  combinedData.sort((a, b) => a.month.localeCompare(b.month))

  const data: Array<Array<string | number>> = []
  let currentMonth = ''
  let currentMonthTotal = 0

  combinedData.forEach((entry, index) => {
    // If we encounter a new month, add the total row for the previous month
    if (entry.month !== currentMonth && currentMonth !== '') {
      data.push(['', '', '', '', `Month ${currentMonth} Total:`, currentMonthTotal.toFixed(2)])
      currentMonthTotal = 0 // Reset the monthly total
    }

    // Update current month
    currentMonth = entry.month

    // Add the invoice row
    data.push([
      entry.route,
      entry.customer_id,
      entry.customer_name,
      entry.invoice,
      entry.date,
      entry.amount.toFixed(2),
    ])

    // Accumulate the amount for the current month
    currentMonthTotal += entry.amount

    // Add total for the last month at the end of the loop
    if (index === combinedData.length - 1) {
      data.push(['', '', '', '', `Month ${currentMonth} Total:`, currentMonthTotal.toFixed(2)])
    }
  })

  // Generate the table
  autoTable(doc, {
    head: [headers],
    body: data,
  })

  // Save the PDF file
  doc.save('InvoicesByMonth.pdf')
}
const generatePaymentRegistrationPDFByMonth = async (): Promise<void> => {
  await getAllInvoice()
  await getAllCustomers()
  await getAllPaymentRegistration()

  const customers = customerStore.value // Retrieve customer data
  const invoices = invoiceStore.value // Retrieve invoice data
  const payments: IPaymentRegistration[] = paymentRegistrationStore.value // Retrieve payment data

  const doc = new jsPDF()
  const headers = [
    'Month',
    'Customer ID',
    'Customer Name',
    'Invoice ID',
    'Date',
    'Amount',
    'Value',
    'Balance',
    'New Balance',
  ]

  const groupedData: { [month: number]: IPaymentRegistration[] } = payments.reduce(
    (acc, payment) => {
      const month = new Date(payment.date).getMonth() + 1 // Extract the month
      if (!acc[month]) {
        acc[month] = []
      }

      // Retrieve customer name
      const customer = customers.find((c) => c.id === payment.customer_id)
      payment.customer_name = customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown'

      // Retrieve invoice value
      const invoice = invoices.find((inv) => inv.id === payment.invoice_id)
      payment.value = invoice ? invoice.amount : 0 // Invoice total amount

      acc[month].push(payment)
      return acc
    },
    {} as { [month: number]: IPaymentRegistration[] },
  )

  const data: Array<Array<string | number>> = []
  let grandTotalAmount = 0 // Total across all months for amount
  let grandTotalValue = 0 // Total across all months for value
  let grandRemainingBalance = 0 // Total across all months for remaining balance

  Object.keys(groupedData).forEach((month) => {
    const monthlyPayments = groupedData[+month] // Convert month to number

    // Sort by invoice ID and date within the month
    monthlyPayments.sort(
      (a, b) =>
        a.invoice_id - b.invoice_id || new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    // Track invoices already counted for value
    const countedInvoices: Set<number> = new Set()

    // Reset cumulative totals for each invoice
    const invoiceTotals: { [invoiceId: number]: number } = {}
    let monthlyTotalAmount = 0
    let monthlyTotalValue = 0

    // Add rows for each payment in the month
    monthlyPayments.forEach((payment) => {
      // Ensure cumulative total for the current invoice is initialized
      if (!invoiceTotals[payment.invoice_id]) {
        invoiceTotals[payment.invoice_id] = 0
      }

      // Calculate balance and new balance
      payment.balance = payment.value - invoiceTotals[payment.invoice_id] // Balance before this payment
      payment.new_balance = payment.balance - payment.amount // Balance after this payment

      // Update cumulative total for the invoice
      invoiceTotals[payment.invoice_id] += payment.amount

      // Add payment amount to monthly total
      monthlyTotalAmount += payment.amount

      // Only count the invoice value once
      if (!countedInvoices.has(payment.invoice_id)) {
        countedInvoices.add(payment.invoice_id)
        monthlyTotalValue += payment.value
      }

      // Add payment row
      data.push([
        month, // Month number
        payment.customer_id,
        payment.customer_name,
        payment.invoice_id,
        payment.date,
        payment.amount.toFixed(2), // Current payment
        payment.value.toFixed(2), // Invoice total value
        payment.balance.toFixed(2), // Balance before the payment
        payment.new_balance.toFixed(2), // Balance after the payment
      ])
    })

    // Calculate monthly remaining balance
    const monthlyRemainingBalance = monthlyTotalValue - monthlyTotalAmount

    // Add totals for the month
    data.push([
      '',
      '',
      '',
      '',
      `Month ${month} Totals:`,
      monthlyTotalAmount.toFixed(2), // Total amount paid
      monthlyTotalValue.toFixed(2), // Total invoice values
      '', // No balance here
      monthlyRemainingBalance.toFixed(2), // Remaining balance for the month
    ])

    // Update grand totals
    grandTotalAmount += monthlyTotalAmount
    grandTotalValue += monthlyTotalValue
    grandRemainingBalance += monthlyRemainingBalance
  })

  // Add grand totals to the end
  data.push([
    '',
    '',
    '',
    '',
    'Grand Totals:',
    grandTotalAmount.toFixed(2), // Total of all payments
    grandTotalValue.toFixed(2), // Total of all invoice values
    '', // No balance here
    grandRemainingBalance.toFixed(2), // Remaining balance across all months
  ])

  // Generate the table
  autoTable(doc, {
    head: [headers],
    body: data,
  })

  // Save the PDF file
  doc.save('PaymentRegistrationByMonth.pdf')
}
</script>

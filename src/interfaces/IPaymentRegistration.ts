export default interface IPaymentRegistration {
  id: number
  customer_id: number
  customer_name: string
  invoice_id: number
  date: string
  amount: number
  new_balance: number
  balance: number
  value: number
}

<template>
  <form
    class="flex flex-col gap-4 bg-white p-6 shadow-custom-shadow rounded-lg relative min-w-[460px]"
    autocomplete="off"
  >
    <h4 class="mb-4">Payment Registration</h4>
    <div class="flex gap-8 items-start">
      <div class="flex items-end gap-4">
        <InputSelect
          title="Invoice Nb"
          placeholder=""
          class="w-32"
          :model-value="selectedInvoice"
          :options="invoiceList"
          @update:model-value="(value: any) => handleInvoiceUpdate(value)"
        ></InputSelect>
      </div>
      <div class="flex gap-4 items-start">
        <InputCustom
          title="Value"
          type="text"
          :disabled="true"
          placeholder=""
          class="w-32"
          v-model="paymentRegistration.value"
          :show-error="false"
        ></InputCustom>
        <InputCustom
          title="Balance"
          :disabled="true"
          type="text"
          placeholder=""
          v-model="paymentRegistration.balance"
          :show-error="false"
          class="w-32"
        ></InputCustom>
      </div>
    </div>

    <ButtonClose></ButtonClose>
    <hr class="border-none h-[1px] flex w-full mb-4 bg-custom-gradient-linear" />
    <div class="flex gap-4 items-end">
      <InputCustom
        title="Customer code"
        placeholder=""
        :disabled="true"
        class="w-32"
        type="number"
        v-model="paymentRegistration.customer_id"
      ></InputCustom>
      <InputCustom
        title="Customer name"
        placeholder=""
        :disabled="true"
        class="w-full"
        type="text"
        v-model="paymentRegistration.customer_name"
      ></InputCustom>
    </div>
    <InputCustom
      title="Date of payment"
      type="date"
      class="w-40"
      placeholder=""
      v-model="paymentRegistration.date"
      :show-error="false"
    ></InputCustom>
    <div class="flex gap-4">
      <InputCustom
        title="Amount"
        type="number"
        class="w-full"
        placeholder=""
        v-model="paymentRegistration.amount"
        :show-error="false"
        @update:model-value="
          () =>
            (paymentRegistration.new_balance =
              paymentRegistration.balance - paymentRegistration.amount)
        "
      ></InputCustom>
      <InputCustom
        title="New Balance"
        type="text"
        :disabled="true"
        class="w-full"
        placeholder=""
        v-model="paymentRegistration.new_balance"
        :show-error="false"
      ></InputCustom>
    </div>
    <div class="flex w-full justify-end gap-4 mt-4">
      <button class="text-white bg-primary" type="button" @click="save()">Save</button>
      <button
        class="text-primary bg-white border-primary border-solid border-2"
        type="button"
        @click="clearForm()"
      >
        Clear
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import ButtonClose from '@/components/ButtonClose.vue'
import InputCustom from '@/components/InputCustom.vue'
import InputSelect from '@/components/InputSelect.vue'
import type { ICustomSelectOption } from '@/interfaces/ICustomSelectOption'
import { onMounted, ref, type Ref } from 'vue'
import type IPaymentRegistration from '@/interfaces/IPaymentRegistration'
import { getAllCustomers } from '@/services/customerService'
import { getAllInvoice } from '@/services/invoiceService'
import { getAllPaymentRegistration, registerPayment } from '@/services/paymentRegistrationService'
import { invoiceList, invoiceStore } from '@/store/invoiceStore'
import { customerStore } from '@/store/customerStore'
import { paymentRegistrationStore } from '@/store/paymentRegistrationStore'

const initialPaymentRegistration: IPaymentRegistration = {
  id: 0,
  customer_id: 0,
  customer_name: '',
  invoice_id: 0,
  date: '',
  amount: 0,
  value: 0,
  balance: 0,
  new_balance: 0,
}

const paymentRegistration: Ref<IPaymentRegistration> = ref({ ...initialPaymentRegistration })

const selectedInvoice: Ref<ICustomSelectOption<number>> = ref({
  value: 0,
  text: '',
})

function handleInvoiceUpdate(value: ICustomSelectOption<number>) {
  selectedInvoice.value = value
  paymentRegistration.value.invoice_id = value.value

  // Buscar el invoice correspondiente en la lista
  const idCustomer = invoiceStore.value.find((invoice) => invoice.id === value.value)
  if (idCustomer) {
    paymentRegistration.value.value = idCustomer.amount
    paymentRegistration.value.customer_id = idCustomer.customer_id

    // Buscar el cliente en customerStore por el customer_id
    const customer = customerStore.value.find((customer) => customer.id === idCustomer.customer_id)
    if (customer) {
      paymentRegistration.value.customer_name = customer.firstName
    } else {
      paymentRegistration.value.customer_name = '' // Si no encuentra el cliente
    }

    // Buscar y sumar los pagos relacionados a esta factura
    const totalPagos = paymentRegistrationStore.value
      .filter((payment) => payment.invoice_id === value.value) // Filtrar pagos de la factura
      .reduce((sum, payment) => sum + payment.amount, 0) // Sumar los montos

    // Calcular y asignar el balance
    paymentRegistration.value.balance = idCustomer.amount - totalPagos
  } else {
    paymentRegistration.value.customer_id = 0 // No se encontró el invoice
    paymentRegistration.value.customer_name = ''
    paymentRegistration.value.balance = 0 // Balance predeterminado
  }
}

async function clearForm() {
  await getAllCustomers()
  await getAllInvoice()

  const today = new Date().toISOString().split('T')[0] 
  initialPaymentRegistration.date = today

  paymentRegistration.value = { ...initialPaymentRegistration }
  selectedInvoice.value = {
    value: 0,
    text: '',
  }

  await getAllPaymentRegistration()
}

async function save() {

  if (paymentRegistration.value.amount <= 0) {
    alert('The amount must be greater than 0')
    return
  }

  if (paymentRegistration.value.new_balance < 0) {
    alert('The new balance cannot be negative')
    return
  }

  if (paymentRegistration.value.invoice_id != 0) {
    try {
      await registerPayment(paymentRegistration.value)
      alert('Payment made successfully')
    } catch (error) {
      console.error(error)
    }
  } else {
    alert('An error occurred, check that you have the invoice selected.')
  }
  clearForm()
}

onMounted(async () => {
  try {
    await clearForm()
  } catch (error) {
    console.log(error)
  }
})
</script>

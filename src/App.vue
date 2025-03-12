<template>
  <LoginView v-if="permissionLevel == 0"></LoginView>
  <main v-else class="w-full h-full p-2 flex flex-col justify-center items-center bg-slate-200">
    <HeaderApp class="fixed top-0 left-0 z-20 bg-white"></HeaderApp>
    <GenerateInvoiceRoute
      v-if="selectedComponent == 'Generate Invoice Route'"
    ></GenerateInvoiceRoute>
    <CustomersView v-if="selectedComponent == 'Customers'"></CustomersView>
    <DeleteInvoice v-if="selectedComponent == 'Delete Invoice'"></DeleteInvoice>
    <PaymentRegistration v-if="selectedComponent == 'Payment Registration'"></PaymentRegistration>
    <GenerateInvoiceCustomer
      v-if="selectedComponent == 'Generate Invoice Customer'"
    ></GenerateInvoiceCustomer>
    <UserView v-if="selectedComponent == 'User View'"></UserView>
    <InvoiceCustomerPDF v-if="selectedComponent == 'InvoiceCustomerPDF'"></InvoiceCustomerPDF>
    <InvoiceDatePDF v-if="selectedComponent == 'InvoiceDatePDF'"></InvoiceDatePDF>
    <ChangePasswordUser v-if="selectedComponent == 'Change Password View'"></ChangePasswordUser>
  </main>
</template>

<script setup lang="ts">
import CustomersView from './views/CustomersView.vue'
import DeleteInvoice from './views/DeleteInvoice.vue'
import UserView from './views/UserView.vue'
import PaymentRegistration from './views/PaymentRegistration.vue'
import GenerateInvoiceCustomer from './views/GenerateInvoiceCustomer.vue'
import GenerateInvoiceRoute from './views/GenerateInvoiceRoute.vue'
import ChangePasswordUser from './views/ChangePasswordUser.vue'
import HeaderApp from './components/HeaderApp.vue'
import LoginView from './views/LoginView.vue'
import InvoiceCustomerPDF from './views/InvoiceCustomerPDF.vue'
import { permissionLevel, selectedComponent } from './store/store'
import InvoiceDatePDF from './views/InvoiceDatePDF.vue'
</script>

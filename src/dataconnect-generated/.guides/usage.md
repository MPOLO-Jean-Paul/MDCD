# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useUpsertStaff, useUpsertPatient, useAddInventoryItem, useUpdateStock, useLogTransaction, useCreateInvoice, useUpdateInvoiceStatus, useArchiveLabReport, useGetInventory, useGetPatientHistory } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useUpsertStaff(upsertStaffVars);

const { data, isPending, isSuccess, isError, error } = useUpsertPatient(upsertPatientVars);

const { data, isPending, isSuccess, isError, error } = useAddInventoryItem(addInventoryItemVars);

const { data, isPending, isSuccess, isError, error } = useUpdateStock(updateStockVars);

const { data, isPending, isSuccess, isError, error } = useLogTransaction(logTransactionVars);

const { data, isPending, isSuccess, isError, error } = useCreateInvoice(createInvoiceVars);

const { data, isPending, isSuccess, isError, error } = useUpdateInvoiceStatus(updateInvoiceStatusVars);

const { data, isPending, isSuccess, isError, error } = useArchiveLabReport(archiveLabReportVars);

const { data, isPending, isSuccess, isError, error } = useGetInventory();

const { data, isPending, isSuccess, isError, error } = useGetPatientHistory(getPatientHistoryVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertStaff, upsertPatient, addInventoryItem, updateStock, logTransaction, createInvoice, updateInvoiceStatus, archiveLabReport, getInventory, getPatientHistory } from '@dataconnect/generated';


// Operation UpsertStaff:  For variables, look at type UpsertStaffVars in ../index.d.ts
const { data } = await UpsertStaff(dataConnect, upsertStaffVars);

// Operation UpsertPatient:  For variables, look at type UpsertPatientVars in ../index.d.ts
const { data } = await UpsertPatient(dataConnect, upsertPatientVars);

// Operation AddInventoryItem:  For variables, look at type AddInventoryItemVars in ../index.d.ts
const { data } = await AddInventoryItem(dataConnect, addInventoryItemVars);

// Operation UpdateStock:  For variables, look at type UpdateStockVars in ../index.d.ts
const { data } = await UpdateStock(dataConnect, updateStockVars);

// Operation LogTransaction:  For variables, look at type LogTransactionVars in ../index.d.ts
const { data } = await LogTransaction(dataConnect, logTransactionVars);

// Operation CreateInvoice:  For variables, look at type CreateInvoiceVars in ../index.d.ts
const { data } = await CreateInvoice(dataConnect, createInvoiceVars);

// Operation UpdateInvoiceStatus:  For variables, look at type UpdateInvoiceStatusVars in ../index.d.ts
const { data } = await UpdateInvoiceStatus(dataConnect, updateInvoiceStatusVars);

// Operation ArchiveLabReport:  For variables, look at type ArchiveLabReportVars in ../index.d.ts
const { data } = await ArchiveLabReport(dataConnect, archiveLabReportVars);

// Operation GetInventory: 
const { data } = await GetInventory(dataConnect);

// Operation GetPatientHistory:  For variables, look at type GetPatientHistoryVars in ../index.d.ts
const { data } = await GetPatientHistory(dataConnect, getPatientHistoryVars);


```
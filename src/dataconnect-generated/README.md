# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetInventory*](#getinventory)
  - [*GetPatientHistory*](#getpatienthistory)
  - [*GetLatestInvoice*](#getlatestinvoice)
  - [*GetGlobalAnalytics*](#getglobalanalytics)
- [**Mutations**](#mutations)
  - [*UpsertStaff*](#upsertstaff)
  - [*UpsertPatient*](#upsertpatient)
  - [*AddInventoryItem*](#addinventoryitem)
  - [*UpdateStock*](#updatestock)
  - [*LogTransaction*](#logtransaction)
  - [*CreateInvoice*](#createinvoice)
  - [*UpdateInvoiceStatus*](#updateinvoicestatus)
  - [*ArchiveLabReport*](#archivelabreport)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetInventory
You can execute the `GetInventory` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getInventory(options?: ExecuteQueryOptions): QueryPromise<GetInventoryData, undefined>;

interface GetInventoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetInventoryData, undefined>;
}
export const getInventoryRef: GetInventoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getInventory(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetInventoryData, undefined>;

interface GetInventoryRef {
  ...
  (dc: DataConnect): QueryRef<GetInventoryData, undefined>;
}
export const getInventoryRef: GetInventoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getInventoryRef:
```typescript
const name = getInventoryRef.operationName;
console.log(name);
```

### Variables
The `GetInventory` query has no variables.
### Return Type
Recall that executing the `GetInventory` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetInventoryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetInventoryData {
  inventoryItems: ({
    id: UUIDString;
    name: string;
    category: string;
    unitPrice: number;
    currentStock: number;
    reorderLevel: number;
    updatedAt: TimestampString;
  } & InventoryItem_Key)[];
}
```
### Using `GetInventory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getInventory } from '@dataconnect/generated';


// Call the `getInventory()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getInventory();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getInventory(dataConnect);

console.log(data.inventoryItems);

// Or, you can use the `Promise` API.
getInventory().then((response) => {
  const data = response.data;
  console.log(data.inventoryItems);
});
```

### Using `GetInventory`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getInventoryRef } from '@dataconnect/generated';


// Call the `getInventoryRef()` function to get a reference to the query.
const ref = getInventoryRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getInventoryRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.inventoryItems);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.inventoryItems);
});
```

## GetPatientHistory
You can execute the `GetPatientHistory` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getPatientHistory(vars: GetPatientHistoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetPatientHistoryData, GetPatientHistoryVariables>;

interface GetPatientHistoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPatientHistoryVariables): QueryRef<GetPatientHistoryData, GetPatientHistoryVariables>;
}
export const getPatientHistoryRef: GetPatientHistoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPatientHistory(dc: DataConnect, vars: GetPatientHistoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetPatientHistoryData, GetPatientHistoryVariables>;

interface GetPatientHistoryRef {
  ...
  (dc: DataConnect, vars: GetPatientHistoryVariables): QueryRef<GetPatientHistoryData, GetPatientHistoryVariables>;
}
export const getPatientHistoryRef: GetPatientHistoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPatientHistoryRef:
```typescript
const name = getPatientHistoryRef.operationName;
console.log(name);
```

### Variables
The `GetPatientHistory` query requires an argument of type `GetPatientHistoryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPatientHistoryVariables {
  patientId: UUIDString;
}
```
### Return Type
Recall that executing the `GetPatientHistory` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPatientHistoryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPatientHistoryData {
  patientDetail?: {
    id: UUIDString;
    medicalHistory?: string | null;
    familyHistory?: string | null;
    allergies?: string | null;
    bloodGroup?: string | null;
  } & PatientDetail_Key;
}
```
### Using `GetPatientHistory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPatientHistory, GetPatientHistoryVariables } from '@dataconnect/generated';

// The `GetPatientHistory` query requires an argument of type `GetPatientHistoryVariables`:
const getPatientHistoryVars: GetPatientHistoryVariables = {
  patientId: ..., 
};

// Call the `getPatientHistory()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPatientHistory(getPatientHistoryVars);
// Variables can be defined inline as well.
const { data } = await getPatientHistory({ patientId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPatientHistory(dataConnect, getPatientHistoryVars);

console.log(data.patientDetail);

// Or, you can use the `Promise` API.
getPatientHistory(getPatientHistoryVars).then((response) => {
  const data = response.data;
  console.log(data.patientDetail);
});
```

### Using `GetPatientHistory`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPatientHistoryRef, GetPatientHistoryVariables } from '@dataconnect/generated';

// The `GetPatientHistory` query requires an argument of type `GetPatientHistoryVariables`:
const getPatientHistoryVars: GetPatientHistoryVariables = {
  patientId: ..., 
};

// Call the `getPatientHistoryRef()` function to get a reference to the query.
const ref = getPatientHistoryRef(getPatientHistoryVars);
// Variables can be defined inline as well.
const ref = getPatientHistoryRef({ patientId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPatientHistoryRef(dataConnect, getPatientHistoryVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.patientDetail);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.patientDetail);
});
```

## GetLatestInvoice
You can execute the `GetLatestInvoice` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getLatestInvoice(vars: GetLatestInvoiceVariables, options?: ExecuteQueryOptions): QueryPromise<GetLatestInvoiceData, GetLatestInvoiceVariables>;

interface GetLatestInvoiceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLatestInvoiceVariables): QueryRef<GetLatestInvoiceData, GetLatestInvoiceVariables>;
}
export const getLatestInvoiceRef: GetLatestInvoiceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLatestInvoice(dc: DataConnect, vars: GetLatestInvoiceVariables, options?: ExecuteQueryOptions): QueryPromise<GetLatestInvoiceData, GetLatestInvoiceVariables>;

interface GetLatestInvoiceRef {
  ...
  (dc: DataConnect, vars: GetLatestInvoiceVariables): QueryRef<GetLatestInvoiceData, GetLatestInvoiceVariables>;
}
export const getLatestInvoiceRef: GetLatestInvoiceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLatestInvoiceRef:
```typescript
const name = getLatestInvoiceRef.operationName;
console.log(name);
```

### Variables
The `GetLatestInvoice` query requires an argument of type `GetLatestInvoiceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetLatestInvoiceVariables {
  patientId: UUIDString;
}
```
### Return Type
Recall that executing the `GetLatestInvoice` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLatestInvoiceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetLatestInvoiceData {
  invoices: ({
    id: UUIDString;
    totalAmount: number;
    status: string;
    createdAt: TimestampString;
    reason: string;
    amountPatient: number;
    amountInsurance: number;
  } & Invoice_Key)[];
}
```
### Using `GetLatestInvoice`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLatestInvoice, GetLatestInvoiceVariables } from '@dataconnect/generated';

// The `GetLatestInvoice` query requires an argument of type `GetLatestInvoiceVariables`:
const getLatestInvoiceVars: GetLatestInvoiceVariables = {
  patientId: ..., 
};

// Call the `getLatestInvoice()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLatestInvoice(getLatestInvoiceVars);
// Variables can be defined inline as well.
const { data } = await getLatestInvoice({ patientId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLatestInvoice(dataConnect, getLatestInvoiceVars);

console.log(data.invoices);

// Or, you can use the `Promise` API.
getLatestInvoice(getLatestInvoiceVars).then((response) => {
  const data = response.data;
  console.log(data.invoices);
});
```

### Using `GetLatestInvoice`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLatestInvoiceRef, GetLatestInvoiceVariables } from '@dataconnect/generated';

// The `GetLatestInvoice` query requires an argument of type `GetLatestInvoiceVariables`:
const getLatestInvoiceVars: GetLatestInvoiceVariables = {
  patientId: ..., 
};

// Call the `getLatestInvoiceRef()` function to get a reference to the query.
const ref = getLatestInvoiceRef(getLatestInvoiceVars);
// Variables can be defined inline as well.
const ref = getLatestInvoiceRef({ patientId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLatestInvoiceRef(dataConnect, getLatestInvoiceVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.invoices);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.invoices);
});
```

## GetGlobalAnalytics
You can execute the `GetGlobalAnalytics` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getGlobalAnalytics(options?: ExecuteQueryOptions): QueryPromise<GetGlobalAnalyticsData, undefined>;

interface GetGlobalAnalyticsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetGlobalAnalyticsData, undefined>;
}
export const getGlobalAnalyticsRef: GetGlobalAnalyticsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getGlobalAnalytics(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetGlobalAnalyticsData, undefined>;

interface GetGlobalAnalyticsRef {
  ...
  (dc: DataConnect): QueryRef<GetGlobalAnalyticsData, undefined>;
}
export const getGlobalAnalyticsRef: GetGlobalAnalyticsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getGlobalAnalyticsRef:
```typescript
const name = getGlobalAnalyticsRef.operationName;
console.log(name);
```

### Variables
The `GetGlobalAnalytics` query has no variables.
### Return Type
Recall that executing the `GetGlobalAnalytics` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetGlobalAnalyticsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetGlobalAnalyticsData {
  invoices: ({
    totalAmount: number;
    status: string;
    createdAt: TimestampString;
    reason: string;
    amountPatient: number;
    amountInsurance: number;
  })[];
}
```
### Using `GetGlobalAnalytics`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getGlobalAnalytics } from '@dataconnect/generated';


// Call the `getGlobalAnalytics()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getGlobalAnalytics();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getGlobalAnalytics(dataConnect);

console.log(data.invoices);

// Or, you can use the `Promise` API.
getGlobalAnalytics().then((response) => {
  const data = response.data;
  console.log(data.invoices);
});
```

### Using `GetGlobalAnalytics`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getGlobalAnalyticsRef } from '@dataconnect/generated';


// Call the `getGlobalAnalyticsRef()` function to get a reference to the query.
const ref = getGlobalAnalyticsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getGlobalAnalyticsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.invoices);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.invoices);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpsertStaff
You can execute the `UpsertStaff` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertStaff(vars: UpsertStaffVariables): MutationPromise<UpsertStaffData, UpsertStaffVariables>;

interface UpsertStaffRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertStaffVariables): MutationRef<UpsertStaffData, UpsertStaffVariables>;
}
export const upsertStaffRef: UpsertStaffRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertStaff(dc: DataConnect, vars: UpsertStaffVariables): MutationPromise<UpsertStaffData, UpsertStaffVariables>;

interface UpsertStaffRef {
  ...
  (dc: DataConnect, vars: UpsertStaffVariables): MutationRef<UpsertStaffData, UpsertStaffVariables>;
}
export const upsertStaffRef: UpsertStaffRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertStaffRef:
```typescript
const name = upsertStaffRef.operationName;
console.log(name);
```

### Variables
The `UpsertStaff` mutation requires an argument of type `UpsertStaffVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertStaffVariables {
  id: UUIDString;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  specialty?: string | null;
  phone?: string | null;
}
```
### Return Type
Recall that executing the `UpsertStaff` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertStaffData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertStaffData {
  staff_upsert: Staff_Key;
}
```
### Using `UpsertStaff`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertStaff, UpsertStaffVariables } from '@dataconnect/generated';

// The `UpsertStaff` mutation requires an argument of type `UpsertStaffVariables`:
const upsertStaffVars: UpsertStaffVariables = {
  id: ..., 
  firstName: ..., 
  lastName: ..., 
  role: ..., 
  email: ..., 
  specialty: ..., // optional
  phone: ..., // optional
};

// Call the `upsertStaff()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertStaff(upsertStaffVars);
// Variables can be defined inline as well.
const { data } = await upsertStaff({ id: ..., firstName: ..., lastName: ..., role: ..., email: ..., specialty: ..., phone: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertStaff(dataConnect, upsertStaffVars);

console.log(data.staff_upsert);

// Or, you can use the `Promise` API.
upsertStaff(upsertStaffVars).then((response) => {
  const data = response.data;
  console.log(data.staff_upsert);
});
```

### Using `UpsertStaff`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertStaffRef, UpsertStaffVariables } from '@dataconnect/generated';

// The `UpsertStaff` mutation requires an argument of type `UpsertStaffVariables`:
const upsertStaffVars: UpsertStaffVariables = {
  id: ..., 
  firstName: ..., 
  lastName: ..., 
  role: ..., 
  email: ..., 
  specialty: ..., // optional
  phone: ..., // optional
};

// Call the `upsertStaffRef()` function to get a reference to the mutation.
const ref = upsertStaffRef(upsertStaffVars);
// Variables can be defined inline as well.
const ref = upsertStaffRef({ id: ..., firstName: ..., lastName: ..., role: ..., email: ..., specialty: ..., phone: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertStaffRef(dataConnect, upsertStaffVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.staff_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.staff_upsert);
});
```

## UpsertPatient
You can execute the `UpsertPatient` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertPatient(vars: UpsertPatientVariables): MutationPromise<UpsertPatientData, UpsertPatientVariables>;

interface UpsertPatientRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertPatientVariables): MutationRef<UpsertPatientData, UpsertPatientVariables>;
}
export const upsertPatientRef: UpsertPatientRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertPatient(dc: DataConnect, vars: UpsertPatientVariables): MutationPromise<UpsertPatientData, UpsertPatientVariables>;

interface UpsertPatientRef {
  ...
  (dc: DataConnect, vars: UpsertPatientVariables): MutationRef<UpsertPatientData, UpsertPatientVariables>;
}
export const upsertPatientRef: UpsertPatientRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertPatientRef:
```typescript
const name = upsertPatientRef.operationName;
console.log(name);
```

### Variables
The `UpsertPatient` mutation requires an argument of type `UpsertPatientVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertPatientVariables {
  id: UUIDString;
  firstName: string;
  lastName: string;
  nationalId?: string | null;
  gender?: string | null;
  bloodGroup?: string | null;
}
```
### Return Type
Recall that executing the `UpsertPatient` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertPatientData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertPatientData {
  patientDetail_upsert: PatientDetail_Key;
}
```
### Using `UpsertPatient`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertPatient, UpsertPatientVariables } from '@dataconnect/generated';

// The `UpsertPatient` mutation requires an argument of type `UpsertPatientVariables`:
const upsertPatientVars: UpsertPatientVariables = {
  id: ..., 
  firstName: ..., 
  lastName: ..., 
  nationalId: ..., // optional
  gender: ..., // optional
  bloodGroup: ..., // optional
};

// Call the `upsertPatient()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertPatient(upsertPatientVars);
// Variables can be defined inline as well.
const { data } = await upsertPatient({ id: ..., firstName: ..., lastName: ..., nationalId: ..., gender: ..., bloodGroup: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertPatient(dataConnect, upsertPatientVars);

console.log(data.patientDetail_upsert);

// Or, you can use the `Promise` API.
upsertPatient(upsertPatientVars).then((response) => {
  const data = response.data;
  console.log(data.patientDetail_upsert);
});
```

### Using `UpsertPatient`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertPatientRef, UpsertPatientVariables } from '@dataconnect/generated';

// The `UpsertPatient` mutation requires an argument of type `UpsertPatientVariables`:
const upsertPatientVars: UpsertPatientVariables = {
  id: ..., 
  firstName: ..., 
  lastName: ..., 
  nationalId: ..., // optional
  gender: ..., // optional
  bloodGroup: ..., // optional
};

// Call the `upsertPatientRef()` function to get a reference to the mutation.
const ref = upsertPatientRef(upsertPatientVars);
// Variables can be defined inline as well.
const ref = upsertPatientRef({ id: ..., firstName: ..., lastName: ..., nationalId: ..., gender: ..., bloodGroup: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertPatientRef(dataConnect, upsertPatientVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.patientDetail_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.patientDetail_upsert);
});
```

## AddInventoryItem
You can execute the `AddInventoryItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addInventoryItem(vars: AddInventoryItemVariables): MutationPromise<AddInventoryItemData, AddInventoryItemVariables>;

interface AddInventoryItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddInventoryItemVariables): MutationRef<AddInventoryItemData, AddInventoryItemVariables>;
}
export const addInventoryItemRef: AddInventoryItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addInventoryItem(dc: DataConnect, vars: AddInventoryItemVariables): MutationPromise<AddInventoryItemData, AddInventoryItemVariables>;

interface AddInventoryItemRef {
  ...
  (dc: DataConnect, vars: AddInventoryItemVariables): MutationRef<AddInventoryItemData, AddInventoryItemVariables>;
}
export const addInventoryItemRef: AddInventoryItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addInventoryItemRef:
```typescript
const name = addInventoryItemRef.operationName;
console.log(name);
```

### Variables
The `AddInventoryItem` mutation requires an argument of type `AddInventoryItemVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddInventoryItemVariables {
  name: string;
  category: string;
  unitPrice: number;
  initialStock: number;
  reorderLevel: number;
}
```
### Return Type
Recall that executing the `AddInventoryItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddInventoryItemData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddInventoryItemData {
  inventoryItem_insert: InventoryItem_Key;
}
```
### Using `AddInventoryItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addInventoryItem, AddInventoryItemVariables } from '@dataconnect/generated';

// The `AddInventoryItem` mutation requires an argument of type `AddInventoryItemVariables`:
const addInventoryItemVars: AddInventoryItemVariables = {
  name: ..., 
  category: ..., 
  unitPrice: ..., 
  initialStock: ..., 
  reorderLevel: ..., 
};

// Call the `addInventoryItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addInventoryItem(addInventoryItemVars);
// Variables can be defined inline as well.
const { data } = await addInventoryItem({ name: ..., category: ..., unitPrice: ..., initialStock: ..., reorderLevel: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addInventoryItem(dataConnect, addInventoryItemVars);

console.log(data.inventoryItem_insert);

// Or, you can use the `Promise` API.
addInventoryItem(addInventoryItemVars).then((response) => {
  const data = response.data;
  console.log(data.inventoryItem_insert);
});
```

### Using `AddInventoryItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addInventoryItemRef, AddInventoryItemVariables } from '@dataconnect/generated';

// The `AddInventoryItem` mutation requires an argument of type `AddInventoryItemVariables`:
const addInventoryItemVars: AddInventoryItemVariables = {
  name: ..., 
  category: ..., 
  unitPrice: ..., 
  initialStock: ..., 
  reorderLevel: ..., 
};

// Call the `addInventoryItemRef()` function to get a reference to the mutation.
const ref = addInventoryItemRef(addInventoryItemVars);
// Variables can be defined inline as well.
const ref = addInventoryItemRef({ name: ..., category: ..., unitPrice: ..., initialStock: ..., reorderLevel: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addInventoryItemRef(dataConnect, addInventoryItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.inventoryItem_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.inventoryItem_insert);
});
```

## UpdateStock
You can execute the `UpdateStock` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateStock(vars: UpdateStockVariables): MutationPromise<UpdateStockData, UpdateStockVariables>;

interface UpdateStockRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStockVariables): MutationRef<UpdateStockData, UpdateStockVariables>;
}
export const updateStockRef: UpdateStockRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateStock(dc: DataConnect, vars: UpdateStockVariables): MutationPromise<UpdateStockData, UpdateStockVariables>;

interface UpdateStockRef {
  ...
  (dc: DataConnect, vars: UpdateStockVariables): MutationRef<UpdateStockData, UpdateStockVariables>;
}
export const updateStockRef: UpdateStockRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateStockRef:
```typescript
const name = updateStockRef.operationName;
console.log(name);
```

### Variables
The `UpdateStock` mutation requires an argument of type `UpdateStockVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateStockVariables {
  itemId: UUIDString;
  newStock: number;
}
```
### Return Type
Recall that executing the `UpdateStock` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateStockData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateStockData {
  inventoryItem_update?: InventoryItem_Key | null;
}
```
### Using `UpdateStock`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateStock, UpdateStockVariables } from '@dataconnect/generated';

// The `UpdateStock` mutation requires an argument of type `UpdateStockVariables`:
const updateStockVars: UpdateStockVariables = {
  itemId: ..., 
  newStock: ..., 
};

// Call the `updateStock()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateStock(updateStockVars);
// Variables can be defined inline as well.
const { data } = await updateStock({ itemId: ..., newStock: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateStock(dataConnect, updateStockVars);

console.log(data.inventoryItem_update);

// Or, you can use the `Promise` API.
updateStock(updateStockVars).then((response) => {
  const data = response.data;
  console.log(data.inventoryItem_update);
});
```

### Using `UpdateStock`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateStockRef, UpdateStockVariables } from '@dataconnect/generated';

// The `UpdateStock` mutation requires an argument of type `UpdateStockVariables`:
const updateStockVars: UpdateStockVariables = {
  itemId: ..., 
  newStock: ..., 
};

// Call the `updateStockRef()` function to get a reference to the mutation.
const ref = updateStockRef(updateStockVars);
// Variables can be defined inline as well.
const ref = updateStockRef({ itemId: ..., newStock: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateStockRef(dataConnect, updateStockVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.inventoryItem_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.inventoryItem_update);
});
```

## LogTransaction
You can execute the `LogTransaction` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
logTransaction(vars: LogTransactionVariables): MutationPromise<LogTransactionData, LogTransactionVariables>;

interface LogTransactionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: LogTransactionVariables): MutationRef<LogTransactionData, LogTransactionVariables>;
}
export const logTransactionRef: LogTransactionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
logTransaction(dc: DataConnect, vars: LogTransactionVariables): MutationPromise<LogTransactionData, LogTransactionVariables>;

interface LogTransactionRef {
  ...
  (dc: DataConnect, vars: LogTransactionVariables): MutationRef<LogTransactionData, LogTransactionVariables>;
}
export const logTransactionRef: LogTransactionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the logTransactionRef:
```typescript
const name = logTransactionRef.operationName;
console.log(name);
```

### Variables
The `LogTransaction` mutation requires an argument of type `LogTransactionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface LogTransactionVariables {
  itemId: UUIDString;
  type: string;
  quantity: number;
  reason?: string | null;
  staffId?: UUIDString | null;
}
```
### Return Type
Recall that executing the `LogTransaction` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `LogTransactionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface LogTransactionData {
  inventoryTransaction_insert: InventoryTransaction_Key;
}
```
### Using `LogTransaction`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, logTransaction, LogTransactionVariables } from '@dataconnect/generated';

// The `LogTransaction` mutation requires an argument of type `LogTransactionVariables`:
const logTransactionVars: LogTransactionVariables = {
  itemId: ..., 
  type: ..., 
  quantity: ..., 
  reason: ..., // optional
  staffId: ..., // optional
};

// Call the `logTransaction()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await logTransaction(logTransactionVars);
// Variables can be defined inline as well.
const { data } = await logTransaction({ itemId: ..., type: ..., quantity: ..., reason: ..., staffId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await logTransaction(dataConnect, logTransactionVars);

console.log(data.inventoryTransaction_insert);

// Or, you can use the `Promise` API.
logTransaction(logTransactionVars).then((response) => {
  const data = response.data;
  console.log(data.inventoryTransaction_insert);
});
```

### Using `LogTransaction`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, logTransactionRef, LogTransactionVariables } from '@dataconnect/generated';

// The `LogTransaction` mutation requires an argument of type `LogTransactionVariables`:
const logTransactionVars: LogTransactionVariables = {
  itemId: ..., 
  type: ..., 
  quantity: ..., 
  reason: ..., // optional
  staffId: ..., // optional
};

// Call the `logTransactionRef()` function to get a reference to the mutation.
const ref = logTransactionRef(logTransactionVars);
// Variables can be defined inline as well.
const ref = logTransactionRef({ itemId: ..., type: ..., quantity: ..., reason: ..., staffId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = logTransactionRef(dataConnect, logTransactionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.inventoryTransaction_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.inventoryTransaction_insert);
});
```

## CreateInvoice
You can execute the `CreateInvoice` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createInvoice(vars: CreateInvoiceVariables): MutationPromise<CreateInvoiceData, CreateInvoiceVariables>;

interface CreateInvoiceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateInvoiceVariables): MutationRef<CreateInvoiceData, CreateInvoiceVariables>;
}
export const createInvoiceRef: CreateInvoiceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createInvoice(dc: DataConnect, vars: CreateInvoiceVariables): MutationPromise<CreateInvoiceData, CreateInvoiceVariables>;

interface CreateInvoiceRef {
  ...
  (dc: DataConnect, vars: CreateInvoiceVariables): MutationRef<CreateInvoiceData, CreateInvoiceVariables>;
}
export const createInvoiceRef: CreateInvoiceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createInvoiceRef:
```typescript
const name = createInvoiceRef.operationName;
console.log(name);
```

### Variables
The `CreateInvoice` mutation requires an argument of type `CreateInvoiceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateInvoiceVariables {
  patientId: UUIDString;
  items: string;
  totalAmount: number;
  amountPatient: number;
  amountInsurance: number;
  reason: string;
}
```
### Return Type
Recall that executing the `CreateInvoice` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateInvoiceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateInvoiceData {
  invoice_insert: Invoice_Key;
}
```
### Using `CreateInvoice`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createInvoice, CreateInvoiceVariables } from '@dataconnect/generated';

// The `CreateInvoice` mutation requires an argument of type `CreateInvoiceVariables`:
const createInvoiceVars: CreateInvoiceVariables = {
  patientId: ..., 
  items: ..., 
  totalAmount: ..., 
  amountPatient: ..., 
  amountInsurance: ..., 
  reason: ..., 
};

// Call the `createInvoice()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createInvoice(createInvoiceVars);
// Variables can be defined inline as well.
const { data } = await createInvoice({ patientId: ..., items: ..., totalAmount: ..., amountPatient: ..., amountInsurance: ..., reason: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createInvoice(dataConnect, createInvoiceVars);

console.log(data.invoice_insert);

// Or, you can use the `Promise` API.
createInvoice(createInvoiceVars).then((response) => {
  const data = response.data;
  console.log(data.invoice_insert);
});
```

### Using `CreateInvoice`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createInvoiceRef, CreateInvoiceVariables } from '@dataconnect/generated';

// The `CreateInvoice` mutation requires an argument of type `CreateInvoiceVariables`:
const createInvoiceVars: CreateInvoiceVariables = {
  patientId: ..., 
  items: ..., 
  totalAmount: ..., 
  amountPatient: ..., 
  amountInsurance: ..., 
  reason: ..., 
};

// Call the `createInvoiceRef()` function to get a reference to the mutation.
const ref = createInvoiceRef(createInvoiceVars);
// Variables can be defined inline as well.
const ref = createInvoiceRef({ patientId: ..., items: ..., totalAmount: ..., amountPatient: ..., amountInsurance: ..., reason: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createInvoiceRef(dataConnect, createInvoiceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.invoice_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.invoice_insert);
});
```

## UpdateInvoiceStatus
You can execute the `UpdateInvoiceStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateInvoiceStatus(vars: UpdateInvoiceStatusVariables): MutationPromise<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;

interface UpdateInvoiceStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateInvoiceStatusVariables): MutationRef<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;
}
export const updateInvoiceStatusRef: UpdateInvoiceStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateInvoiceStatus(dc: DataConnect, vars: UpdateInvoiceStatusVariables): MutationPromise<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;

interface UpdateInvoiceStatusRef {
  ...
  (dc: DataConnect, vars: UpdateInvoiceStatusVariables): MutationRef<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;
}
export const updateInvoiceStatusRef: UpdateInvoiceStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateInvoiceStatusRef:
```typescript
const name = updateInvoiceStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateInvoiceStatus` mutation requires an argument of type `UpdateInvoiceStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateInvoiceStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateInvoiceStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateInvoiceStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateInvoiceStatusData {
  invoice_update?: Invoice_Key | null;
}
```
### Using `UpdateInvoiceStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateInvoiceStatus, UpdateInvoiceStatusVariables } from '@dataconnect/generated';

// The `UpdateInvoiceStatus` mutation requires an argument of type `UpdateInvoiceStatusVariables`:
const updateInvoiceStatusVars: UpdateInvoiceStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateInvoiceStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateInvoiceStatus(updateInvoiceStatusVars);
// Variables can be defined inline as well.
const { data } = await updateInvoiceStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateInvoiceStatus(dataConnect, updateInvoiceStatusVars);

console.log(data.invoice_update);

// Or, you can use the `Promise` API.
updateInvoiceStatus(updateInvoiceStatusVars).then((response) => {
  const data = response.data;
  console.log(data.invoice_update);
});
```

### Using `UpdateInvoiceStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateInvoiceStatusRef, UpdateInvoiceStatusVariables } from '@dataconnect/generated';

// The `UpdateInvoiceStatus` mutation requires an argument of type `UpdateInvoiceStatusVariables`:
const updateInvoiceStatusVars: UpdateInvoiceStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateInvoiceStatusRef()` function to get a reference to the mutation.
const ref = updateInvoiceStatusRef(updateInvoiceStatusVars);
// Variables can be defined inline as well.
const ref = updateInvoiceStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateInvoiceStatusRef(dataConnect, updateInvoiceStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.invoice_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.invoice_update);
});
```

## ArchiveLabReport
You can execute the `ArchiveLabReport` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
archiveLabReport(vars: ArchiveLabReportVariables): MutationPromise<ArchiveLabReportData, ArchiveLabReportVariables>;

interface ArchiveLabReportRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ArchiveLabReportVariables): MutationRef<ArchiveLabReportData, ArchiveLabReportVariables>;
}
export const archiveLabReportRef: ArchiveLabReportRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
archiveLabReport(dc: DataConnect, vars: ArchiveLabReportVariables): MutationPromise<ArchiveLabReportData, ArchiveLabReportVariables>;

interface ArchiveLabReportRef {
  ...
  (dc: DataConnect, vars: ArchiveLabReportVariables): MutationRef<ArchiveLabReportData, ArchiveLabReportVariables>;
}
export const archiveLabReportRef: ArchiveLabReportRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the archiveLabReportRef:
```typescript
const name = archiveLabReportRef.operationName;
console.log(name);
```

### Variables
The `ArchiveLabReport` mutation requires an argument of type `ArchiveLabReportVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ArchiveLabReportVariables {
  patientId: UUIDString;
  consultationId: UUIDString;
  testResults: string;
  interpretations?: string | null;
}
```
### Return Type
Recall that executing the `ArchiveLabReport` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ArchiveLabReportData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ArchiveLabReportData {
  labReportArchive_insert: LabReportArchive_Key;
}
```
### Using `ArchiveLabReport`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, archiveLabReport, ArchiveLabReportVariables } from '@dataconnect/generated';

// The `ArchiveLabReport` mutation requires an argument of type `ArchiveLabReportVariables`:
const archiveLabReportVars: ArchiveLabReportVariables = {
  patientId: ..., 
  consultationId: ..., 
  testResults: ..., 
  interpretations: ..., // optional
};

// Call the `archiveLabReport()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await archiveLabReport(archiveLabReportVars);
// Variables can be defined inline as well.
const { data } = await archiveLabReport({ patientId: ..., consultationId: ..., testResults: ..., interpretations: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await archiveLabReport(dataConnect, archiveLabReportVars);

console.log(data.labReportArchive_insert);

// Or, you can use the `Promise` API.
archiveLabReport(archiveLabReportVars).then((response) => {
  const data = response.data;
  console.log(data.labReportArchive_insert);
});
```

### Using `ArchiveLabReport`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, archiveLabReportRef, ArchiveLabReportVariables } from '@dataconnect/generated';

// The `ArchiveLabReport` mutation requires an argument of type `ArchiveLabReportVariables`:
const archiveLabReportVars: ArchiveLabReportVariables = {
  patientId: ..., 
  consultationId: ..., 
  testResults: ..., 
  interpretations: ..., // optional
};

// Call the `archiveLabReportRef()` function to get a reference to the mutation.
const ref = archiveLabReportRef(archiveLabReportVars);
// Variables can be defined inline as well.
const ref = archiveLabReportRef({ patientId: ..., consultationId: ..., testResults: ..., interpretations: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = archiveLabReportRef(dataConnect, archiveLabReportVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.labReportArchive_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.labReportArchive_insert);
});
```


# OtterPocketBase - PocketBase Manager via Aliases

OtterPocketBase is a utility class for managing interactions with a PocketBase instance using aliases defined in a YAML configuration file. This approach centralizes the management of collections and actions, while connection and authentication are secured via environment variables.

## Configuration

The `endpoint_alias.yaml` file at the root of the project defines only the aliases:

```yaml
aliases:
  - alias: "get_users"
    collection: "users"
    action: "getList"
  - alias: "get_user_by_id"
    collection: "users"
    action: "getOne"
    options:
      expand: "profile"
```

---

## Connection and Authentication

Connection is entirely managed via the `.env` file.

**Required environment variables:**
- `PB_URL`: The URL of your PocketBase instance (e.g., `https://your-pocketbase.com`).
- `PB_EMAIL`: The Superuser account email.
- `PB_PASSWORD`: The associated password.

If `PB_EMAIL` and `PB_PASSWORD` are present during `init()`, the bot will attempt `authWithPassword` authentication exclusively on the `_superusers` collection (compatible with PocketBase v0.23+). Otherwise, it will operate in guest mode.

---

## OtterPocketBase Class

### Initialization

Initialization is now **automatic**. The connection to PocketBase and the loading of the YAML configuration occur during the first call to `execByAlias()` or `getClient()`. You no longer need to call `init()` manually.

### Using Aliases

#### `execByAlias<T>(alias, ...params)`
Executes the action associated with the alias. This method ensures the connection is established before launching the request.

| Action | Parameter 1 | Parameter 2 | Parameter 3 | Description |
| :--- | :--- | :--- | :--- | :--- |
| `getList` | `page` (number) | `perPage` (number) | `options` (object) | Retrieves a paginated list. |
| `getFullList` | `options` (object) | - | - | Retrieves all records. |
| `getOne` | `id` (string) | `options` (object) | - | Retrieves a record by its ID. |
| `getFirstListItem` | `filter` (string) | `options` (object) | - | Retrieves the first item matching the filter. |
| `create` | `data` (object) | `options` (object) | - | Creates a new record. |
| `update` | `id` (string) | `data` (object) | `options` (object) | Updates an existing record. |
| `delete` | `id` (string) | `options` (object) | - | Deletes a record. |

**Examples:**

```typescript
import { OtterPocketBase } from "@/otterbots/utils/pocketbase/pocketbase";

// No need for init()!
const users = await OtterPocketBase.execByAlias("get_users");

// Retrieve a document by ID with query options
const user = await OtterPocketBase.execByAlias("get_user_by_id", "RECORD_ID", { expand: "roles" });

// Create a document
const newLog = await OtterPocketBase.execByAlias("create_log", { 
    message: "Action performed",
    user: "12345" 
});

// Delete a document
await OtterPocketBase.execByAlias("delete_log", "RECORD_ID");
```

### Direct Client Access

#### `getClient()` (Asynchronous static method)
If you need to use specific features not covered by aliases (e.g., Realtime/Subscriptions), use `getClient()`. It guarantees the instance is initialized before returning it.

```typescript
const client = await OtterPocketBase.getClient();
client.collection('messages').subscribe('*', (e) => {
    console.log(e.action, e.record);
});
```

---

## Development and Types

When calling `execByAlias<T>`, it is highly recommended to pass an interface to type the return value:

```typescript
interface User {
    id: string;
    username: string;
}

const user = await OtterPocketBase.execByAlias<User>("get_user_by_id", "ID");
// user is of type User | undefined
```

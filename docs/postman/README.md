<!-- Emmanuel Aro's project submission for evaluation. -->

# Postman testing guide

A step-by-step guide for verifying every Ticket Matrix API endpoint with Postman.

## 1. Import the collection

1. Open **Postman** → click **Import** (top-left).
2. Drag the file **`TicketMatrix.postman_collection.json`** from this folder into the import dialog (or paste it via *Raw text*).
3. Click **Import** — a new collection named **Ticket Matrix API** appears in the sidebar.

## 2. Configure the environment

The collection ships with three variables:

| Variable | Default | What it is |
|---|---|---|
| `base_url` | `http://localhost:8000/api` | Root URL of the Django REST API. Change this to point at your deployed API (e.g. `https://your-app.onrender.com/api`). |
| `customer_id` | *(empty)* | Auto-populated by the *Create customer* request. |
| `ticket_id` | *(empty)* | Auto-populated by the *Create ticket (inline customer)* request. |

To edit:

1. Click the collection name **Ticket Matrix API** in the sidebar.
2. Open the **Variables** tab.
3. Set the *Current value* column for `base_url` if your API isn't on `localhost:8000`.
4. Hit **Save**.

## 3. Run the requests in order

The collection is organised so you can step through it top-to-bottom and exercise every code path.

1. **Health → Healthcheck** — confirm the API is up. Should return `200 OK`.
2. **Customers → Create customer** — creates a customer. The test script saves the new ID into `customer_id`.
3. **Customers → Get / Update customer** — uses the saved `customer_id` automatically.
4. **Tickets → Create ticket (inline customer)** — creates a ticket and a customer in one shot if the email doesn't exist. Saves the new ID into `ticket_id`.
5. **Tickets → Create ticket (existing customer_id)** — exercises the `customer_id` branch using the customer you created in step 2.
6. **Tickets → Get / Update ticket** — uses `ticket_id`.
7. **Comments → Add comment to ticket** — appends a comment to the saved ticket.
8. **Stats / Aggregation → Ticket stats** — returns `total`, `completed`, `completion_rate`, plus `by_status` / `by_priority` / `by_category` aggregations. This powers the dashboard's *Tickets Completion Rate* gauge and the metric cards.
9. **Tickets → Delete ticket** and **Customers → Delete customer** — final cleanup if you want to leave the database empty.

## 4. Filtering & search

The *List tickets* request includes optional query params (toggle them with the checkbox in the **Params** tab):

- `status=open|in_progress|on_hold|resolved|closed`
- `priority=low|medium|high|urgent`
- `category=technical|billing|account|feature_request|general`
- `search=<term>` — searches subject, description, reference, and customer name.
- `ordering=-created_at` (default) or `priority`, `status`, etc.

## 5. Run the whole collection (optional)

Use Postman's **Collection Runner** (▶ on the collection) to execute every request in sequence. The test scripts that capture `customer_id` and `ticket_id` make this work end-to-end without manual edits.

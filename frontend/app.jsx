const { useEffect, useState } = React;

function App() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState({ type: "success", message: "Ready" });
  const [responseBody, setResponseBody] = useState("Latest API response will appear here.");
  const [loading, setLoading] = useState(false);
  const [productId, setProductId] = useState("");
  const [createForm, setCreateForm] = useState({ name: "", price: "" });
  const [patchForm, setPatchForm] = useState({ id: "", name: "", price: "" });
  const [deleteId, setDeleteId] = useState("");

  async function request(path, options = {}) {
    setLoading(true);
    setStatus({ type: "success", message: "Loading..." });

    try {
      const response = await fetch(path, {
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        ...options,
      });

      const text = await response.text();
      let data = text;

      try {
        data = text ? JSON.parse(text) : {};
      } catch (_error) {
        data = text;
      }

      setResponseBody(JSON.stringify(data, null, 2));

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setStatus({ type: "success", message: `${response.status} ${response.statusText}` });
      return data;
    } catch (error) {
      setStatus({ type: "error", message: `Request failed: ${error.message}` });
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function loadProducts() {
    const data = await request("/products");
    if (Array.isArray(data)) {
      setProducts(data);
    }
  }

  useEffect(() => {
    loadProducts().catch(() => {});
  }, []);

  async function handleGetOne() {
    if (productId === "") {
      setStatus({ type: "error", message: "Enter an id to fetch." });
      return;
    }

    await request(`/products/${productId}`);
  }

  async function handleCreate(event) {
    event.preventDefault();

    if (!createForm.name || createForm.price === "") {
      setStatus({ type: "error", message: "Fill in name and price for POST." });
      return;
    }

    await request("/products", {
      method: "POST",
      body: JSON.stringify({
        name: createForm.name,
        price: Number(createForm.price),
      }),
    });

    setCreateForm({ name: "", price: "" });
    await loadProducts();
  }

  async function handlePatch(event) {
    event.preventDefault();

    if (patchForm.id === "") {
      setStatus({ type: "error", message: "Enter a target id for PATCH." });
      return;
    }

    const body = {};

    if (patchForm.name !== "") {
      body.name = patchForm.name;
    }

    if (patchForm.price !== "") {
      body.price = Number(patchForm.price);
    }

    if (Object.keys(body).length === 0) {
      setStatus({ type: "error", message: "Enter at least one field to update." });
      return;
    }

    await request(`/products/${patchForm.id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });

    setPatchForm({ id: "", name: "", price: "" });
    await loadProducts();
  }

  async function handleDelete(event) {
    event.preventDefault();

    if (deleteId === "") {
      setStatus({ type: "error", message: "Enter an id to delete." });
      return;
    }

    await request(`/products/${deleteId}`, {
      method: "DELETE",
    });

    setDeleteId("");
    await loadProducts();
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <span className="eyebrow">React Frontend</span>
        <h1>Products API Console</h1>
        <p>
          A simple single-page client for the <code>/products</code> API in
          <code>backend/end</code>. You can fetch, inspect, create, update, and
          delete products while watching the latest JSON response on the same screen.
        </p>
      </section>

      <section className="layout">
        <div className="stack">
          <article className="panel">
            <div className="panel-header">
              <h2>Product List</h2>
              <div className="toolbar">
                <span className="badge">{products.length} items</span>
                <button className="btn btn-primary" onClick={() => loadProducts()} disabled={loading}>
                  Refresh list
                </button>
              </div>
            </div>
            <div className="panel-body">
              <div className="card-list">
                {products.map((product, index) => (
                  <div className="product-card" key={`${product.name}-${index}`}>
                    <div className="product-top">
                      <div>
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-price">price: {product.price}</p>
                      </div>
                      <div className="product-id">#{index}</div>
                    </div>
                    <div className="button-row">
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setProductId(String(index));
                          request(`/products/${index}`).catch(() => {});
                        }}
                        disabled={loading}
                      >
                        Fetch item
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          setDeleteId(String(index));
                          request(`/products/${index}`, { method: "DELETE" })
                            .then(() => loadProducts())
                            .catch(() => {});
                        }}
                        disabled={loading}
                      >
                        Delete item
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <h2>Request Controls</h2>
              <span className={`status ${status.type}`}>{status.message}</span>
            </div>
            <div className="panel-body stack">
              <div className="field">
                <label htmlFor="get-id">GET /products/:id</label>
                <div className="button-row">
                  <input
                    id="get-id"
                    type="number"
                    min="0"
                    value={productId}
                    onChange={(event) => setProductId(event.target.value)}
                    placeholder="0"
                  />
                  <button className="btn btn-secondary" onClick={handleGetOne} disabled={loading}>
                    Fetch one
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreate} className="stack">
                <div className="grid-two">
                  <div className="field">
                    <label htmlFor="create-name">POST name</label>
                    <input
                      id="create-name"
                      value={createForm.name}
                      onChange={(event) =>
                        setCreateForm((current) => ({ ...current, name: event.target.value }))
                      }
                      placeholder="sofa"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="create-price">POST price</label>
                    <input
                      id="create-price"
                      type="number"
                      min="0"
                      value={createForm.price}
                      onChange={(event) =>
                        setCreateForm((current) => ({ ...current, price: event.target.value }))
                      }
                      placeholder="500"
                    />
                  </div>
                </div>
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  Create product
                </button>
              </form>

              <form onSubmit={handlePatch} className="stack">
                <div className="grid-two">
                  <div className="field">
                    <label htmlFor="patch-id">PATCH id</label>
                    <input
                      id="patch-id"
                      type="number"
                      min="0"
                      value={patchForm.id}
                      onChange={(event) =>
                        setPatchForm((current) => ({ ...current, id: event.target.value }))
                      }
                      placeholder="1"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="patch-name">PATCH name</label>
                    <input
                      id="patch-name"
                      value={patchForm.name}
                      onChange={(event) =>
                        setPatchForm((current) => ({ ...current, name: event.target.value }))
                      }
                      placeholder="new chair"
                    />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="patch-price">PATCH price</label>
                  <input
                    id="patch-price"
                    type="number"
                    min="0"
                    value={patchForm.price}
                    onChange={(event) =>
                      setPatchForm((current) => ({ ...current, price: event.target.value }))
                    }
                    placeholder="999"
                  />
                </div>
                <button className="btn btn-secondary" type="submit" disabled={loading}>
                  Update product
                </button>
              </form>

              <form onSubmit={handleDelete} className="stack">
                <div className="field">
                  <label htmlFor="delete-id">DELETE id</label>
                  <input
                    id="delete-id"
                    type="number"
                    min="0"
                    value={deleteId}
                    onChange={(event) => setDeleteId(event.target.value)}
                    placeholder="2"
                  />
                </div>
                <button className="btn btn-danger" type="submit" disabled={loading}>
                  Delete product
                </button>
              </form>
            </div>
          </article>
        </div>

        <div className="stack">
          <article className="panel">
            <div className="panel-header">
              <h2>Response</h2>
              <span className="badge">JSON</span>
            </div>
            <div className="panel-body">
              <pre className="response-box">{responseBody}</pre>
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <h2>Notes</h2>
            </div>
            <div className="panel-body">
              <div className="tips">
                1. Start the server and open `http://localhost:8080`
                {"\n"}2. The product list is fetched automatically on first load
                {"\n"}3. Item ids are array indexes, so they shift after delete
                {"\n"}4. The latest API response is shown on the right
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

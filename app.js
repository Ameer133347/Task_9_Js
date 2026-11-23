// 1. Original Products Array
const products = [
    { id: 1, name: 'Laptop', category: 'electronics', price: 25000, stock: 4 },
    { id: 2, name: 'Mouse', category: 'electronics', price: 350, stock: 0 },
    { id: 3, name: 'T-Shirt', category: 'clothes', price: 400, stock: 12 },
    { id: 4, name: 'Jacket', category: 'clothes', price: 1800, stock: 2 },
    { id: 5, name: 'Rice 5kg', category: 'food', price: 220, stock: 30 },
    { id: 6, name: 'Coffee', category: 'food', price: 300, stock: 0 },
    { id: 7, name: 'Headphones', category: 'electronics', price: 1500, stock: 7 },
    { id: 8, name: 'Shoes', category: 'clothes', price: 2200, stock: 5 }
];


// 2. Create a working copy
let currentProducts = products.map(product => ({ ...product }));

let nextId = 9;
let currentFilter = "all";
let categoryFilter = "all";
let isSorted = false;


// 3. HTML Elements
const productsList = document.getElementById("productsList");
const productsCount = document.getElementById("productsCount");
const totalValue = document.getElementById("totalValue");
const status = document.getElementById("status");
const mostExpensive = document.getElementById("mostExpensive");

const productForm = document.getElementById("productForm");
const errorMessage = document.getElementById("errorMessage");


// 4. One function to update data and draw the list
function changeData(callback) {
    currentProducts = callback(currentProducts);
    renderProducts();
}


// 5. Filter function creators
function maxPrice(max) {
    return product => product.price <= max;
}

function minPrice(min) {
    return product => product.price >= min;
}


// 6. Display Products
function renderProducts() {

    let shownProducts = [...currentProducts];

    // Apply selected filter
    if (currentFilter === "inStock") {
        shownProducts = shownProducts.filter(
            product => product.stock > 0
        );
    }

    else if (currentFilter === "cheap") {
        shownProducts = shownProducts.filter(maxPrice(500));
    }

    else if (currentFilter === "expensive") {
        shownProducts = shownProducts.filter(minPrice(2000));
    }

    // Apply category filter
    if (categoryFilter !== "all") {
        shownProducts = shownProducts.filter(
            product => product.category === categoryFilter
        );
    }

    // Sort without changing original order
    if (isSorted) {
        shownProducts.sort((a, b) => a.price - b.price);
    }

    // Clear old list
    productsList.innerHTML = "";

    // Display every product
    shownProducts.forEach(product => {

        const li = document.createElement("li");

        if (product.stock === 0) {
            li.classList.add("out-of-stock");
        }

        const info = document.createElement("div");
        info.className = "product-info";

        info.textContent =
            `${product.id} - ${product.name} - ${product.price} EGP - stock: ${product.stock}`;

        const actions = document.createElement("div");
        actions.className = "product-actions";

        // +1 Button
        const addBtn = document.createElement("button");
        addBtn.textContent = "+1";

        addBtn.addEventListener("click", () => {
            changeData(list =>
                list.map(item =>
                    item.id === product.id
                        ? { ...item, stock: item.stock + 1 }
                        : item
                )
            );
        });

        // Sell Button
        const sellBtn = document.createElement("button");
        sellBtn.textContent = "Sell";
        sellBtn.className = "sell-btn";

        sellBtn.addEventListener("click", () => {
            changeData(list =>
                list.map(item =>
                    item.id === product.id
                        ? { ...item, stock: Math.max(0, item.stock - 1) }
                        : item
                )
            );
        });

        // Remove Button
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "remove-btn";

        removeBtn.addEventListener("click", () => {

            const confirmed = confirm(
                `Remove ${product.name}?`
            );

            if (confirmed) {
                changeData(list =>
                    list.filter(item => item.id !== product.id)
                );
            }
        });

        actions.append(addBtn, sellBtn, removeBtn);

        li.append(info, actions);

        productsList.appendChild(li);
    });


    // 7. Number of products shown
    productsCount.textContent = shownProducts.length;


    // 8. Total stock value
    const total = shownProducts.reduce(
        (sum, product) => sum + product.price * product.stock,
        0
    );

    totalValue.textContent = total.toLocaleString("en-US");


    // 9. Status line
    if (shownProducts.length === 0) {
        status.textContent = "No products";
    }

    else if (shownProducts.every(product => product.stock > 0)) {
        status.textContent = "Everything is in stock";
    }

    else {
        status.textContent = "Some products are out of stock";
    }


    // 10. Most expensive product
    if (shownProducts.length === 0) {
        mostExpensive.textContent = "-";
    }

    else {
        const expensiveProduct = shownProducts.reduce(
            (max, product) =>
                product.price > max.price ? product : max
        );

        mostExpensive.textContent = expensiveProduct.name;
    }
}


// 11. All Button
document.getElementById("allBtn").addEventListener("click", () => {
    currentFilter = "all";
    isSorted = false;
    renderProducts();
});


// 12. In Stock Button
document.getElementById("inStockBtn").addEventListener("click", () => {
    currentFilter = "inStock";
    isSorted = false;
    renderProducts();
});


// 13. Cheap Button
document.getElementById("cheapBtn").addEventListener("click", () => {
    currentFilter = "cheap";
    isSorted = false;
    renderProducts();
});


// 14. Expensive Button
document.getElementById("expensiveBtn").addEventListener("click", () => {
    currentFilter = "expensive";
    isSorted = false;
    renderProducts();
});


// 15. Sort Button
document.getElementById("sortBtn").addEventListener("click", () => {
    isSorted = true;
    renderProducts();
});


// 16. Discount 10% Button
document.getElementById("discountBtn").addEventListener("click", () => {

    changeData(list =>
        list.map(product => ({
            ...product,
            price: Math.max(50, product.price * 0.9)
        }))
    );
});


// 17. Reset Button
document.getElementById("resetBtn").addEventListener("click", () => {

    currentFilter = "all";
    categoryFilter = "all";
    isSorted = false;
    nextId = 9;

    document.getElementById("categoryFilter").value = "all";

    changeData(() =>
        products.map(product => ({ ...product }))
    );
});


// 18. Category Filter
document.getElementById("categoryFilter").addEventListener("change", event => {

    categoryFilter = event.target.value;

    renderProducts();
});


// 19. Add New Product Form
productForm.addEventListener("submit", event => {

    event.preventDefault();

    errorMessage.textContent = "";

    const name = document.getElementById("name").value.trim();
    const category = document.getElementById("category").value;
    const priceInput = document.getElementById("price").value.trim();
    const stockInput = document.getElementById("stock").value.trim();

    const price = Number(priceInput);
    const stock = Number(stockInput);

    // Validation

    if (name.length < 3) {
        errorMessage.textContent =
            "Name must be at least 3 characters.";
        return;
    }

    // Check duplicate name (case-insensitive)
    const exists = currentProducts.some(
        product => product.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
        const existingProduct = currentProducts.find(
            product => product.name.toLowerCase() === name.toLowerCase()
        );

        errorMessage.textContent =
            `${existingProduct.name} already exists (id ${existingProduct.id}).`;

        return;
    }

    if (!category) {
        errorMessage.textContent =
            "Please choose a category.";
        return;
    }

    if (priceInput === "" || !Number.isFinite(price) || price <= 0) {
        errorMessage.textContent =
            "Price must be a number greater than 0.";
        return;
    }

    if (
        stockInput === "" ||
        !Number.isInteger(stock) ||
        stock < 0 ||
        stock > 1000
    ) {
        errorMessage.textContent =
            "Stock must be an integer between 0 and 1000.";
        return;
    }

    // Create New Product
    const newProduct = {
        id: nextId,
        name: name,
        category: category,
        price: price,
        stock: stock
    };

    // Add product
    changeData(list => [...list, newProduct]);

    nextId++;

    // Clear form
    productForm.reset();

    errorMessage.textContent = "";
});


// 20. Initial Display
renderProducts();

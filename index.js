let offset = 1;
let totalCount = 0;
const onPage = 3;

const fetchProducts = async (ofst) => {
    const response = await fetch(`http://localhost:8000/products?offset=${ofst}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        
    })

    if (response.ok) {
        return await response.json();
    } else {
        console.error("failed get response");
    }
}

const loadProducts = async (ofst) => {
    const products = await fetchProducts(ofst);

    const tableBody = document.querySelector('#productsTable tbody');
    tableBody.innerHTML = "";

    totalCount = products.count;

    for (let product of products.results) {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <th scope="row">${product.id}</th>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.description}</td>
        `;
        tableBody.appendChild(newRow);
    }
};

window.onload = loadProducts;

document.getElementById('wrongInput').style.display = 'none';
document.getElementById('successInput').style.display = 'none';

document.getElementById('productCreateForm').addEventListener('submit', async function(event) {
    event.preventDefault();
});

document.getElementById('prev').addEventListener('click', function(event) {
    event.preventDefault();
    if (offset > 1) {
        offset--;
        loadProducts(offset);
    }
});

document.getElementById('next').addEventListener('click', function(event) {
    event.preventDefault();
    if (offset < totalCount - 1) {
        offset++;
        loadProducts(offset);
    }
});

const fetchCreateProduct = async (data) => {
    try {
        const response = await fetch("http://localhost:8000/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const successInput = document.getElementById('successInput');
        const nameErrorDiv = document.getElementById("nameError");
        const priceErrorDiv = document.getElementById("priceError");
        const wrongInput = document.getElementById("wrongInput");

        [successInput, nameErrorDiv, priceErrorDiv, wrongInput].forEach((item) => {
            item.style.display = "none";
        });

        if (response.ok) {
            successInput.style.display = 'block';
        } else {
            successInput.style.display = 'none';

            const responseData = await response.json();

            let requestValidationFailed = false;

            if (responseData.name) {
                requestValidationFailed = true;
                nameErrorDiv.textContent = responseData.name;
                nameErrorDiv.style.display = "block";
            } else {
                nameErrorDiv.style.display = "none";
            }

            if (responseData.price) {
                requestValidationFailed = true;
                priceErrorDiv.textContent = responseData.price;
                priceErrorDiv.style.display = "block";
            } else {
                priceErrorDiv.style.display = "none";
            }
    
            if (! requestValidationFailed) {
                wrongInput.textContent = responseData;
                wrongInput.style.display = "block";
            } else {
                wrongInput.style.display = "none";
            }
        }        
    } catch (e) {
        console.log(e);
        console.error(response);
    }
};


const createProduct = async () => {
    const form = document.getElementById("productCreateForm");
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    await fetchCreateProduct(data);
    offset = totalCount - 2;
    await loadProducts(offset);
};

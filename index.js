document.getElementById('wrongInput').style.display = 'none';
document.getElementById('successInput').style.display = 'none';

document.getElementById('productCreateForm').addEventListener('submit', async function(event) {
    event.preventDefault();
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
};

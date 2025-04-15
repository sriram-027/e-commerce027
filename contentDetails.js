document.addEventListener('DOMContentLoaded', function() {
    console.clear();
    
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) {
        console.error('No product ID found in URL');
        return;
    }

    // Update cart badge if cookie exists
    if (document.cookie.includes(',counter=')) {
        const counter = document.cookie.split(',')[1].split('=')[1];
        document.getElementById("badge").innerHTML = counter;
    }

    // Fetch product details
    fetch(`https://5d76bf96515d1a0014085cf9.mockapi.io/product/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(product => {
            dynamicContentDetails(product);
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
            document.getElementById('containerProduct').innerHTML = `
                <div class="error-message">
                    <h2>Product Not Found</h2>
                    <p>We couldn't find the product you're looking for.</p>
                    <a href="index.html">Return to Home</a>
                </div>
            `;
        });

    function dynamicContentDetails(product) {
        const container = document.getElementById('containerProduct');
        container.innerHTML = ''; // Clear any existing content

        const mainContainer = document.createElement('div');
        mainContainer.id = 'containerD';

        // Image Section
        const imageSection = document.createElement('div');
        imageSection.id = 'imageSection';
        
        const mainImage = document.createElement('img');
        mainImage.id = 'imgDetails';
        mainImage.src = product.preview;
        mainImage.alt = product.name;
        imageSection.appendChild(mainImage);

        // Product Details
        const productDetails = document.createElement('div');
        productDetails.id = 'productDetails';
        
        const name = document.createElement('h1');
        name.textContent = product.name;
        
        const brand = document.createElement('h4');
        brand.textContent = product.brand;
        
        const price = document.createElement('h3');
        price.textContent = `Rs ${product.price}`;
        
        const descriptionTitle = document.createElement('h3');
        descriptionTitle.textContent = 'Description';
        
        const description = document.createElement('p');
        description.textContent = product.description;
        
        // Product Preview
        const previewSection = document.createElement('div');
        previewSection.id = 'productPreview';
        
        const previewTitle = document.createElement('h3');
        previewTitle.textContent = 'Product Preview';
        previewSection.appendChild(previewTitle);

        // Add preview images
        product.photos.forEach((photo, index) => {
            const previewImg = document.createElement('img');
            previewImg.id = 'previewImg';
            previewImg.src = photo;
            previewImg.alt = `Preview ${index + 1}`;
            previewImg.onclick = () => {
                mainImage.src = photo;
            };
            previewSection.appendChild(previewImg);
        });

        // Add to Cart Button
        const buttonDiv = document.createElement('div');
        buttonDiv.id = 'button';
        
        const addToCartBtn = document.createElement('button');
        addToCartBtn.textContent = 'Add to Cart';
        addToCartBtn.onclick = function() {
            addToCart(id);
        };
        buttonDiv.appendChild(addToCartBtn);

        // Assemble product details
        productDetails.appendChild(name);
        productDetails.appendChild(brand);
        productDetails.appendChild(price);
        productDetails.appendChild(descriptionTitle);
        productDetails.appendChild(description);
        productDetails.appendChild(previewSection);
        productDetails.appendChild(buttonDiv);

        // Assemble main container
        mainContainer.appendChild(imageSection);
        mainContainer.appendChild(productDetails);
        container.appendChild(mainContainer);
    }

    function addToCart(productId) {
        let order = productId;
        let counter = 1;
        
        if (document.cookie.includes(',counter=')) {
            order = productId + " " + document.cookie.split(',')[0].split('=')[1];
            counter = Number(document.cookie.split(',')[1].split('=')[1]) + 1;
        }
        
        document.cookie = `orderId=${order},counter=${counter};path=/`;
        document.getElementById("badge").innerHTML = counter;
        console.log('Product added to cart:', productId);
    }
});
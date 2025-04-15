document.addEventListener('DOMContentLoaded', function() {
    // Reset cart cookie
    document.cookie = "orderId=0,counter=0;path=/";
    
    // Update cart badge to 0
    document.getElementById("badge").innerHTML = "0";

    // Optional: Send order confirmation to mock API
    fetch('https://5d76bf96515d1a0014085cf9.mockapi.io/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            createdAt: new Date().toISOString(),
            status: "confirmed"
        })
    })
    .then(response => response.json())
    .then(data => console.log('Order confirmation sent:', data))
    .catch(error => console.error('Error sending order confirmation:', error));
});
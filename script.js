document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('horoscopeForm');
    const messageDiv = document.getElementById('formMessage');
    const submitButton = document.getElementById('submitButton');

    // IMPORTANT: Replace with YOUR actual Google Apps Script Web App URL
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxoNPFyBF_GPQlbUqcrmRQ0AjUvAacinlTSkYF9uUmkeq7Vp-tI0WyAdjI7E8IC-4Z_Gw/exec';

    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent default form submission

        messageDiv.textContent = 'Submitting your details...';
        messageDiv.className = 'form-message'; // Reset classes
        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            // Sanitize keys for Google Sheets (remove spaces, special chars for column headers if desired)
            // For now, we'll use the exact `name` attributes from HTML
            data[key] = value;
        });

        // Add a timestamp for when the form was submitted
        data['Timestamp'] = new Date().toISOString();

        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Important for simple POST to Google Apps Script from client-side if not handling CORS in script
            cache: 'no-cache',
            redirect: 'follow',
            body: JSON.stringify(data) // Send data as a JSON string
        })
        .then(response => {
            // With 'no-cors', we can't inspect the response body directly for success
            // So we'll assume success if the request doesn't throw an error.
            // For better error handling, you'd need a proper CORS setup in Google Apps Script.
            messageDiv.textContent = 'Thank you! Your details have been submitted successfully.';
            messageDiv.className = 'form-message success';
            form.reset(); // Clear the form
        })
        .catch(error => {
            console.error('Error:', error);
            messageDiv.textContent = 'Oops! Something went wrong. Please try again later.';
            messageDiv.className = 'form-message error';
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Details';
        });
    });
});
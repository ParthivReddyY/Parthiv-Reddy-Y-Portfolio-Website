// Initialize EmailJS with your user ID
(function() {
    emailjs.init('sE-ekxGZwTJZZaM-s');
})();

// Form submission handler
const form = document.getElementById('contact-form');
const submitButton = form.querySelector('button[type="submit"]');

function showNotification(message, isSuccess = true) {
    const notification = document.createElement('div');
    notification.className = `notification ${isSuccess ? 'success' : 'error'}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '1rem 2rem';
    notification.style.borderRadius = '5px';
    notification.style.backgroundColor = isSuccess ? 'var(--accent-color)' : '#ff4444';
    notification.style.color = isSuccess ? 'var(--primary-color)' : 'white';
    notification.style.zIndex = '1000';
    notification.style.animation = 'slideIn 0.3s ease-out';
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

async function handleSubmit(event) {
    event.preventDefault();
    
    // Prevent double submission
    if (submitButton.disabled) {
        return;
    }
    
    // Disable submit button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Get form data and format according to the template variables
    const formData = new FormData(form);
    const templateParams = {
        from_name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        // No need for to_name as it's hardcoded in the template
    };

    console.log('Sending email with params:', templateParams); // Debug log

    try {
        // Add a small delay to prevent accidental double submissions
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Send email with updated template parameters
        const response = await emailjs.send('service_4a1uerd', 'template_a0jhc07', templateParams);
        
        if (response.status === 200) {
            showNotification('Message sent successfully!');
            form.reset();
        } else {
            throw new Error('Failed to send message');
        }
        
    } catch (error) {
        console.error('Failed to send email:', error);
        showNotification('Failed to send message. Please try again.', false);
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
    }
}

// Add form validation before submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Basic form validation
    const name = form.querySelector('input[name="name"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const subject = form.querySelector('input[name="subject"]').value.trim();
    const message = form.querySelector('textarea[name="message"]').value.trim();
    
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', false);
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', false);
        return;
    }
    
    handleSubmit(e);
});

// Add loading state for inputs
const inputs = form.querySelectorAll('input, textarea');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
});

// Add keypress handling for textarea
const messageArea = form.querySelector('textarea');
if (messageArea) {
    messageArea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    });
}

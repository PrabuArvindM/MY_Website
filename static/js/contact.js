/* ==========================================================================
   PRABU ARVIND M - PRODUCTION OTP EMAIL VERIFICATION & CONTACT MODULE
   ========================================================================== */

let isEmailVerified = false;
let otpTimerInterval = null;
let resendTimerInterval = null;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', handleContactSubmit);
  }
});

/* 1. Request OTP Code */
function requestOTP() {
  const emailInput = document.getElementById('contact-email');
  const email = emailInput ? emailInput.value.trim() : '';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    showToast("Invalid email address.", "error");
    if (emailInput) emailInput.focus();
    return;
  }

  const verifyBtn = document.getElementById('verify-email-btn');
  const originalBtnText = verifyBtn ? verifyBtn.innerHTML : 'Verify Email';
  if (verifyBtn) {
    verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending OTP...';
    verifyBtn.disabled = true;
  }

  fetch('/api/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
    .then(async res => {
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        showToast("OTP Sent Successfully.", "success");
        
        // Display OTP Drawer
        const otpContainer = document.getElementById('otp-container');
        if (otpContainer) otpContainer.style.display = 'block';

        // Start Timers (5-min OTP expiry, 60-second resend cooldown)
        startOTPTimer(300); // 5 minutes
        startResendCooldown(60); // 60 seconds

        const otpInput = document.getElementById('otp-input');
        if (otpInput) {
          otpInput.value = '';
          otpInput.focus();
        }
      } else {
        showToast(data.detail || "Failed to send email.", "error");
      }
    })
    .catch(err => {
      console.error("Send OTP Error:", err);
      showToast("Server error. Please try again later.", "error");
    })
    .finally(() => {
      if (verifyBtn) {
        verifyBtn.innerHTML = originalBtnText;
        verifyBtn.disabled = false;
      }
    });
}

/* 2. Submit OTP Code for Verification */
function submitOTP() {
  const emailInput = document.getElementById('contact-email');
  const otpInput = document.getElementById('otp-input');

  const email = emailInput ? emailInput.value.trim() : '';
  const otp = otpInput ? otpInput.value.trim() : '';

  if (!otp || otp.length !== 6 || isNaN(otp)) {
    showToast("Incorrect OTP.", "error");
    if (otpInput) otpInput.focus();
    return;
  }

  const verifyOtpBtn = document.getElementById('verify-otp-btn');
  const originalBtnText = verifyOtpBtn ? verifyOtpBtn.innerHTML : 'Verify OTP';
  if (verifyOtpBtn) {
    verifyOtpBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    verifyOtpBtn.disabled = true;
  }

  fetch('/api/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  })
    .then(async res => {
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        // Verification Success Workflow
        isEmailVerified = true;
        showToast("OTP verification successful.", "success");

        // UI Updates
        const otpContainer = document.getElementById('otp-container');
        if (otpContainer) otpContainer.style.display = 'none';

        const badge = document.getElementById('email-verified-badge');
        if (badge) badge.style.display = 'block';

        const verifyEmailBtn = document.getElementById('verify-email-btn');
        if (verifyEmailBtn) verifyEmailBtn.style.display = 'none';

        if (emailInput) emailInput.readOnly = true;

        // Unlock Subject, Message & Enable Submit Button
        const subjectInput = document.getElementById('contact-subject');
        if (subjectInput) {
          subjectInput.disabled = false;
          subjectInput.placeholder = "e.g. AI Research Collaboration";
        }

        const messageInput = document.getElementById('contact-message');
        if (messageInput) {
          messageInput.disabled = false;
          messageInput.placeholder = "Describe your project, inquiry, or research proposal...";
        }

        const submitBtn = document.getElementById('contact-submit-btn');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }

        // Jarvis Voice AI Announcement
        if (typeof speakJarvis === 'function') {
          speakJarvis("Your email has been verified successfully. You can now send your message to Prabu Arvind.");
        }
      } else {
        showToast(data.detail || "Incorrect OTP.", "error");
      }
    })
    .catch(err => {
      console.error("Verify OTP Error:", err);
      showToast("Server error. Please try again later.", "error");
    })
    .finally(() => {
      if (verifyOtpBtn) {
        verifyOtpBtn.innerHTML = originalBtnText;
        verifyOtpBtn.disabled = false;
      }
    });
}

/* 3. Deliver Verified Contact Message */
async function handleContactSubmit(e) {
  e.preventDefault();

  if (!isEmailVerified) {
    showToast("Email address has not been verified.", "error");
    return;
  }

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const statusContainer = document.getElementById('contact-status-msg');

  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const subject = subjectInput ? subjectInput.value.trim() : '';
  const message = messageInput ? messageInput.value.trim() : '';

  if (statusContainer) {
    statusContainer.style.display = 'none';
    statusContainer.innerHTML = '';
  }

  if (!name) {
    showToast("Please enter your full name.", "error");
    if (nameInput) nameInput.focus();
    return;
  }

  if (!subject) {
    showToast("Please enter a subject.", "error");
    if (subjectInput) subjectInput.focus();
    return;
  }

  if (!message || message.length < 20) {
    showToast("Message must be at least 20 characters.", "error");
    if (messageInput) messageInput.focus();
    return;
  }

  const btn = document.getElementById('contact-submit-btn');
  const originalBtnText = btn ? btn.innerHTML : 'Send Message';
  if (btn) {
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Delivering message...';
    btn.disabled = true;
  }

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message })
    });

    const data = await res.json();

    if (res.ok && data.status === 'success') {
      if (statusContainer) {
        statusContainer.style.display = 'block';
        statusContainer.className = 'contact-success-banner fade-in';
        statusContainer.innerHTML = `
          <div style="background: rgba(0, 230, 118, 0.1); border: 1px solid var(--accent-green); padding: 18px; border-radius: 14px; margin-top: 16px;">
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--accent-green); margin-bottom: 6px;">
              ✓ Message Sent Successfully!
            </div>
            <p style="color: var(--text-main); margin: 0; font-size: 0.95rem; line-height: 1.6;">
              ${data.message}
            </p>
          </div>
        `;
      }

      showToast("🎉 Message sent successfully!", "success");

      // Reset verification & form fields
      isEmailVerified = false;
      if (emailInput) emailInput.readOnly = false;
      if (subjectInput) { subjectInput.disabled = true; subjectInput.placeholder = "Verify email to unlock subject"; }
      if (messageInput) { messageInput.disabled = true; messageInput.placeholder = "Verify email to unlock message input..."; }

      const badge = document.getElementById('email-verified-badge');
      if (badge) badge.style.display = 'none';

      const verifyEmailBtn = document.getElementById('verify-email-btn');
      if (verifyEmailBtn) verifyEmailBtn.style.display = 'inline-block';

      const form = document.getElementById('contact-form');
      if (form) {
        try { form.reset(); } catch(err) {}
      }

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message (Verify Email First)';
      }
    } else {
      showToast(data.detail || "Failed to send email.", "error");
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalBtnText;
      }
    }
  } catch (err) {
    console.error("Contact Submit Error:", err);
    showToast("Server error. Please try again later.", "error");
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalBtnText;
    }
  }
}

/* 4. Timers Helper Functions */
function startOTPTimer(seconds) {
  if (otpTimerInterval) clearInterval(otpTimerInterval);
  let remaining = seconds;

  const timerEl = document.getElementById('otp-timer');
  
  const updateDisplay = () => {
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    if (timerEl) {
      timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    if (remaining <= 0) {
      clearInterval(otpTimerInterval);
      if (timerEl) timerEl.textContent = "00:00 (Expired)";
      showToast("OTP expired.", "error");
    }
    remaining--;
  };

  updateDisplay();
  otpTimerInterval = setInterval(updateDisplay, 1000);
}

function startResendCooldown(seconds) {
  if (resendTimerInterval) clearInterval(resendTimerInterval);
  let remaining = seconds;

  const resendBtn = document.getElementById('resend-otp-btn');
  const cooldownEl = document.getElementById('resend-cooldown');
  if (resendBtn) resendBtn.disabled = true;

  const updateDisplay = () => {
    if (cooldownEl) cooldownEl.textContent = remaining;
    if (remaining <= 0) {
      clearInterval(resendTimerInterval);
      if (resendBtn) {
        resendBtn.disabled = false;
        resendBtn.innerHTML = 'Resend OTP';
      }
    }
    remaining--;
  };

  updateDisplay();
  resendTimerInterval = setInterval(updateDisplay, 1000);
}

/* Clipboard Copy Helpers */
function copyEmail() {
  const email = "prabuarvind2005@gmail.com";
  navigator.clipboard.writeText(email).then(() => {
    showToast("Email address copied to clipboard!", "success");
  }).catch(() => {
    showToast("Email: prabuarvind2005@gmail.com", "success");
  });
}

function copyPhone() {
  const phone = "+91 6383516976";
  navigator.clipboard.writeText(phone).then(() => {
    showToast("Phone number copied to clipboard!", "success");
  }).catch(() => {
    showToast("Phone: +91 6383516976", "success");
  });
}

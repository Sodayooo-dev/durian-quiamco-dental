    // Application state
    const BookingApp = {
      elements: {},
      isSubmitting: false,

      // Initialize the application
      init() {
        this.cacheElements();
        this.bindEvents();
        this.setupForm();
      },

      // Cache DOM elements for better performance
      cacheElements() {
        this.elements = {
          nextBtn: document.getElementById('nextButton'),
          step1: document.getElementById('step1'),
          step2: document.getElementById('step2'),
          dateInput: document.getElementById('appointmentDate'),
          timeSelect: document.getElementById('appointmentTime'),
          summary: document.getElementById('appointmentSummary'),
          hiddenDate: document.getElementById('hiddenDate'),
          hiddenTime: document.getElementById('hiddenTime'),
          form: document.getElementById('bookingForm'),
          modal: document.getElementById('successModal'),
          continueBtn: document.getElementById('continueBtn'),
          homeBtn: document.getElementById('homeBtn'),
          birthdateInput: document.getElementById('birthdate'),
          ageInput: document.getElementById('age')
        };
      },

      // Bind all event handlers
      bindEvents() {
        // Step navigation
        this.elements.nextBtn?.addEventListener('click', (e) => this.handleNextStep(e));
        
        // Form submission
        this.elements.form?.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Modal controls
        this.elements.continueBtn?.addEventListener('click', () => this.closeModal());
        this.elements.homeBtn?.addEventListener('click', () => this.goHome());
        
        // Auto-calculate age from birthdate
        this.elements.birthdateInput?.addEventListener('change', () => this.calculateAge());
        
        // Medical history toggles
        this.setupMedicalToggles();
        
        // Allergies toggle
        this.setupAllergiesToggle();
        
        // Modal keyboard/click handlers
        this.setupModalHandlers();
      },

      // Setup form defaults and validation
      setupForm() {
        const today = new Date();
        const minDate = today.toISOString().split('T')[0];
        if (this.elements.dateInput) {
          this.elements.dateInput.min = minDate;
        }
      },

      // Handle step navigation
      handleNextStep(e) {
        e.preventDefault();
        
        const date = this.elements.dateInput?.value;
        const time = this.elements.timeSelect?.value;

        if (!date || !time) {
          this.showError('Please select both a date and a time.');
          return;
        }

        // Store values
        if (this.elements.hiddenDate) this.elements.hiddenDate.value = date;
        if (this.elements.hiddenTime) this.elements.hiddenTime.value = time;

        // Update summary
        const formattedDate = this.formatDate(date);
        const formattedTime = this.formatTime(time);
        if (this.elements.summary) {
          this.elements.summary.textContent = `Appointment: ${formattedDate} at ${formattedTime}`;
        }

        // Navigate to step 2
        this.elements.step1?.classList.remove('active');
        this.elements.step2?.classList.add('active');
      },

      // Handle form submission
      async handleFormSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        if (!this.validateForm()) return;
        
        this.isSubmitting = true;
        const submitBtn = this.elements.form?.querySelector('button[type="submit"]');
        this.setButtonLoading(submitBtn, true);

        try {
          const formData = this.collectFormData();
          const response = await fetch('js/personal_info_to_db.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
          });

          const responseText = await response.text();
          
          if (response.ok && (responseText.includes('Personal details saved') || responseText.includes('saved'))) {
            this.showModal();
          } else {
            this.showError(`Submission failed: ${responseText}`);
          }
        } catch (error) {
          this.showError(`Network error: ${error.message}`);
        } finally {
          this.isSubmitting = false;
          this.setButtonLoading(submitBtn, false);
        }
      },

      // Validate form before submission
      validateForm() {
        const requiredFields = [
          'fullName', 'birthdate', 'age', 'sex', 'homeAddress', 'mobile'
        ];

        for (const fieldId of requiredFields) {
          const field = document.getElementById(fieldId);
          if (!field?.value.trim()) {
            field?.focus();
            this.showError(`Please fill in the ${field?.labels[0]?.textContent || fieldId} field.`);
            return false;
          }
        }

        // Validate email format if provided
        const email = document.getElementById('email');
        if (email?.value && !this.isValidEmail(email.value)) {
          email.focus();
          this.showError('Please enter a valid email address.');
          return false;
        }

        // Validate age
        const age = document.getElementById('age');
        if (age?.value && (parseInt(age.value) < 0 || parseInt(age.value) > 120)) {
          age.focus();
          this.showError('Please enter a valid age between 0 and 120.');
          return false;
        }

        return true;
      },

      // Email validation helper
      isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },

      // Calculate age from birthdate
      calculateAge() {
        const birthdateInput = this.elements.birthdateInput;
        const ageInput = this.elements.ageInput;
        
        if (!birthdateInput?.value || !ageInput) return;

        const birthDate = new Date(birthdateInput.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        if (age >= 0 && age <= 120) {
          ageInput.value = age;
        }
      },

      // Setup medical history toggles
      setupMedicalToggles() {
        const toggles = [
          { yes: 'medTreatmentYes', no: 'medTreatmentNo', target: 'medCondition' },
          { yes: 'surgeryYes', no: 'surgeryNo', target: 'surgeryDetails' }
        ];

        toggles.forEach(toggle => {
          const yesElement = document.getElementById(toggle.yes);
          const noElement = document.getElementById(toggle.no);
          const targetElement = document.getElementById(toggle.target);

          yesElement?.addEventListener('change', () => {
            if (yesElement.checked && targetElement) {
              targetElement.disabled = false;
            }
          });

          noElement?.addEventListener('change', () => {
            if (noElement.checked && targetElement) {
              targetElement.disabled = true;
              targetElement.value = '';
            }
          });
        });
      },

      // Setup allergies other option toggle
      setupAllergiesToggle() {
        const otherCheckbox = document.getElementById('otherAllergy');
        const otherInput = document.getElementById('otherAllergies');

        otherCheckbox?.addEventListener('change', () => {
          if (otherInput) {
            otherInput.disabled = !otherCheckbox.checked;
            if (!otherCheckbox.checked) {
              otherInput.value = '';
            }
          }
        });
      },

      // Setup modal event handlers
      setupModalHandlers() {
        // Close on escape key
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && this.elements.modal?.classList.contains('show')) {
            this.closeModal();
          }
        });

        // Close on backdrop click
        this.elements.modal?.addEventListener('click', (e) => {
          if (e.target === this.elements.modal) {
            this.closeModal();
          }
        });
      },

      // Collect all form data
      collectFormData() {
        const getValue = (id) => {
          const element = document.getElementById(id);
          return element?.value?.trim() || '';
        };

        const getOptionalValue = (value) => value || 'N/A';

        const getRadioValue = (name) => {
          const element = document.querySelector(`input[name="${name}"]:checked`);
          return element?.value || 'No';
        };

        const getCheckboxValue = (id) => {
          const element = document.getElementById(id);
          return element?.checked ? 'Yes' : 'No';
        };

        return {
          // Appointment details
          appointment_date: this.elements.hiddenDate?.value || '',
          appointment_time: this.elements.hiddenTime?.value || '',

          // Required fields
          name: getValue('fullName'),
          birthdate: getValue('birthdate'),
          age: getValue('age'),
          sex: getValue('sex'),
          homeAddress: getValue('homeAddress'),
          mobile: getValue('mobile'),

          // Optional fields
          religion: getOptionalValue(getValue('religion')),
          nationality: getOptionalValue(getValue('nationality')),
          occupation: getOptionalValue(getValue('occupation')),
          email: getOptionalValue(getValue('email')),
          refBy: getOptionalValue(getValue('referrer')),
          prevDent: getOptionalValue(getValue('prevDentist')),
          lastDentVisit: getValue('lastVisit') || new Date().toISOString().split('T')[0],
          resForConsult: getOptionalValue(getValue('reason')),
          physician: getOptionalValue(getValue('physician')),
          officeContact: getOptionalValue(getValue('physicianOffice')),
          medications: getOptionalValue(getValue('medications')),
          bloodType: getOptionalValue(getValue('bloodType')),
          bloodPressure: getOptionalValue(getValue('bloodPressure')),

          // Medical conditions
          undr_trtmnt: document.getElementById('medTreatmentYes')?.checked ? 
            getOptionalValue(getValue('medCondition')) : 'N/A',
          surgery: document.getElementById('surgeryYes')?.checked ? 
            getOptionalValue(getValue('surgeryDetails')) : 'N/A',

          // Women's health
          pregy: getCheckboxValue('pregnant'),
          nurs: getCheckboxValue('nursing'),
          bcpills: getCheckboxValue('birthControl'),

          // Allergies
          allergy: this.collectAllergies()
        };
      },

      // Collect allergies information
      collectAllergies() {
        const allergyIds = ['localAnesthetic', 'aspirin', 'penicillin', 'latex', 'sulfa'];
        const allergies = [];

        allergyIds.forEach(id => {
          const element = document.getElementById(id);
          if (element?.checked) {
            allergies.push(element.value);
          }
        });

        // Check for other allergies
        const otherCheckbox = document.getElementById('otherAllergy');
        const otherInput = document.getElementById('otherAllergies');
        
        if (otherCheckbox?.checked && otherInput?.value.trim()) {
          allergies.push(otherInput.value.trim());
        }

        return allergies.length > 0 ? allergies.join(', ') : 'None';
      },

      // Set button loading state
      setButtonLoading(button, isLoading) {
        if (!button) return;

        if (isLoading) {
          button.disabled = true;
          button.dataset.originalText = button.textContent;
          button.textContent = 'Submitting...';
          button.style.opacity = '0.7';
        } else {
          button.disabled = false;
          button.textContent = button.dataset.originalText || 'Submit Appointment';
          button.style.opacity = '1';
        }
      },

      // Format time for display
      formatTime(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = ((hours + 11) % 12) + 1;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      },

      // Format date for display
      formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      },

      // Show success modal
      showModal() {
        if (!this.elements.modal) return;

        this.elements.modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Focus the continue button for accessibility
        setTimeout(() => {
          this.elements.continueBtn?.focus();
        }, 500);
      },

      // Close success modal
      closeModal() {
        if (!this.elements.modal) return;

        this.elements.modal.classList.remove('show');
        document.body.style.overflow = '';

        // Reset form after a short delay
        setTimeout(() => {
          this.resetForm();
        }, 300);
      },

      // Reset form to initial state
      resetForm() {
        this.elements.form?.reset();
        this.elements.step2?.classList.remove('active');
        this.elements.step1?.classList.add('active');
        if (this.elements.summary) {
          this.elements.summary.textContent = '';
        }

        // Reset disabled states
        const conditionalFields = ['medCondition', 'surgeryDetails', 'otherAllergies'];
        conditionalFields.forEach(id => {
          const field = document.getElementById(id);
          if (field) {
            field.disabled = true;
            field.value = '';
          }
        });
      },

      // Navigate to home page
      goHome() {
        window.location.href = 'index.html';
      },

      // Show error message
      showError(message) {
        // Remove existing error messages
        document.querySelectorAll('.error-message').forEach(el => el.remove());

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.setAttribute('role', 'alert');

        document.body.appendChild(errorDiv);

        // Auto-remove and click to dismiss
        const removeError = () => {
          if (errorDiv.parentNode) {
            errorDiv.remove();
          }
        };
        
        errorDiv.addEventListener('click', removeError);
        setTimeout(removeError, 8000);
      }
    };

    // Initialize application when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => BookingApp.init());
    } else {
      BookingApp.init();
    }
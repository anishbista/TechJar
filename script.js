document.addEventListener("DOMContentLoaded", function () {
    const formSteps = document.querySelectorAll(".form-step");
    const nextButtons = document.querySelectorAll(".next-btn");
    const prevButtons = document.querySelectorAll(".prev-btn");
    const submitButton = document.querySelector(".submit-btn");
    const formContainer = document.querySelector(".form-container");
    let currentStep = 0;

    showStep(currentStep);

    nextButtons.forEach((button) => button.addEventListener("click", handleNextButtonClick));
    prevButtons.forEach((button) => button.addEventListener("click", handlePrevButtonClick));
    submitButton.addEventListener("click", displayConfirmation);

    function handleNextButtonClick() {
        if (validateStep(currentStep)) {
            currentStep++;
            showStep(currentStep);
        } else {
            displayErrorMessages(currentStep);
            console.log("Validation failed for step: " + currentStep);
        }
    }

    function handlePrevButtonClick() {
        currentStep--;
        showStep(currentStep);
    }

    function showStep(stepIndex) {
        formSteps.forEach((step, index) => {
            step.classList.toggle("active", index === stepIndex);
        });

        submitButton.style.display = stepIndex === formSteps.length - 1 ? "block" : "none";
    }

    function validateStep(stepIndex) {
        const currentFields = formSteps[stepIndex].querySelectorAll("[required]");
        let isValid = true;

        currentFields.forEach((field) => {
            if (!field.value.trim() || (field.getAttribute("type") === "email" && !validateField(field, validateEmail)) || (field.getAttribute("name") === "phone" && !validateField(field, validatePhoneNumber))) {
                isValid = false;
            }
        });

        return isValid;
    }

    function validateField(field, validationFunction) {
        return validationFunction(field.value);
    }

    function displayErrorMessages(stepIndex) {
        const currentFields = formSteps[stepIndex].querySelectorAll("[required]");

        currentFields.forEach((field) => {
            let errorMessage = "";
            if (!field.value.trim()) {
                errorMessage = "Please fill out this field";
            } else if (field.getAttribute("type") === "email" && !validateField(field, validateEmail)) {
                errorMessage = "Please enter a valid email address";
            } else if (field.getAttribute("name") === "phone" && !validateField(field, validatePhoneNumber)) {
                errorMessage = "Please enter a valid phone number";
            }

            if (errorMessage) {
                displayErrorMessage(field, errorMessage);
            }
        });
    }

    function displayErrorMessage(field, message) {
        const errorMessage = document.createElement("span");
        errorMessage.classList.add("error-message");
        errorMessage.textContent = message;

        if (!field.nextElementSibling || !field.nextElementSibling.classList.contains("error-message")) {
            field.parentNode.insertBefore(errorMessage, field.nextSibling);
        }
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePhoneNumber(phoneNumber) {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phoneNumber);
    }

    function displayConfirmation() {
        const confirmationStep = createConfirmationStep();
        formContainer.appendChild(confirmationStep);

        formSteps.forEach((step) => (step.style.display = "none"));
        confirmationStep.style.display = "block";
        submitButton.style.display = "none";
    }

    function createConfirmationStep() {
        const confirmationStep = document.createElement("div");
        confirmationStep.classList.add("form-step");

        const summary = document.createElement("p");
        summary.textContent = "Summary of entered information: ";

        formSteps.forEach((step, index) => {
            if (index !== formSteps.length - 1) {
                const fields = step.querySelectorAll("[name]");
                fields.forEach((field) => {
                    const label = field.previousElementSibling.textContent;
                    const value = field.value;
                    summary.textContent += `${label}: ${value}, `;
                });
            }
        });

        confirmationStep.appendChild(summary);
        return confirmationStep;
    }
});

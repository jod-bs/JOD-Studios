"use client";

import { useState } from "react";
import { whatsappUrl } from "@/lib/site";

const steps = ["Services needed", "Project description", "Timeline", "Budget", "Your details"];
const services = ["Dubbing", "SFX & Music", "Audio Mix", "Video Edit", "VFX", "Animation"];
const timelines = ["Urgent", "1-2 weeks", "1 month", "Flexible"];

const NAME_REGEX = /^[\p{L}\s.'-]{2,60}$/u;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const HAS_LETTERS_REGEX = /\p{L}/u;
const HAS_DIGITS_REGEX = /[0-9]/;

export default function ProjectForm() {
  const [step, setStep] = useState(0);
  const [service, setService] = useState("VFX");
  const [description, setDescription] = useState("");
  const [timeline, setTimeline] = useState("1-2 weeks");
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    id?: string;
    service: string;
    name: string;
    email: string;
  } | null>(null);

  // Input Sanitizers
  const handleNameChange = (val: string) => {
    // Allow Unicode letters; strip digits and disallowed symbols
    const sanitized = val.replace(/[0-9]/g, "").replace(/[^\p{L}\s.'-]/gu, "");
    setName(sanitized);
    if (errorMessage) setErrorMessage("");
  };

  const handleBudgetChange = (val: string) => {
    // Strip letters - allow numbers, commas, periods, hyphens, and currency symbols
    const sanitized = val.replace(/\p{L}/gu, "").replace(/[^0-9\s,.-₹$€£]/g, "");
    setBudget(sanitized);
    if (errorMessage) setErrorMessage("");
  };

  const handlePhoneChange = (val: string) => {
    // Strip alphabetic text - allow only digits, +, space, and hyphens
    const sanitized = val.replace(/[a-zA-Z]/g, "").replace(/[^0-9+\s-]/g, "");
    setPhone(sanitized);
    if (errorMessage) setErrorMessage("");
  };

  const validateStep = (currentStep: number): boolean => {
    setErrorMessage("");

    if (currentStep === 0) {
      if (!service.trim()) {
        setErrorMessage("Please select a service discipline to proceed.");
        return false;
      }
    } else if (currentStep === 1) {
      if (!description.trim()) {
        setErrorMessage("Please tell us about your project before continuing.");
        return false;
      }
      if (description.trim().length < 8) {
        setErrorMessage("Please provide a little more detail about your project scope (at least 8 characters).");
        return false;
      }
    } else if (currentStep === 2) {
      if (!timeline.trim()) {
        setErrorMessage("Please select an estimated project timeline.");
        return false;
      }
    } else if (currentStep === 3) {
      const trimmedBudget = budget.trim();
      if (!trimmedBudget) {
        setErrorMessage("Working budget is required. Please provide a numeric amount.");
        return false;
      }
      // Budget must not contain letters and must contain digits
      if (HAS_LETTERS_REGEX.test(trimmedBudget) || !HAS_DIGITS_REGEX.test(trimmedBudget)) {
        setErrorMessage("Budget must be a numeric value (numbers only, e.g. 50000 or ₹1,50,000).");
        return false;
      }
      const rawNumbers = trimmedBudget.replace(/[^0-9]/g, "");
      if (rawNumbers.length < 2) {
        setErrorMessage("Please enter a valid numeric budget amount.");
        return false;
      }
    } else if (currentStep === 4) {
      // 1. Name validation (Text only, no numbers)
      const trimmedName = name.trim();
      if (!trimmedName) {
        setErrorMessage("Please enter your name.");
        return false;
      }
      if (HAS_DIGITS_REGEX.test(trimmedName)) {
        setErrorMessage("Name cannot contain numbers. Please enter letters only.");
        return false;
      }
      if (!NAME_REGEX.test(trimmedName)) {
        setErrorMessage("Please enter a valid name (at least 2 letters, no numbers or special symbols).");
        return false;
      }

      // 2. Email validation (RFC format)
      const trimmedEmail = email.trim();
      if (!trimmedEmail) {
        setErrorMessage("Please enter your email address.");
        return false;
      }
      if (!EMAIL_REGEX.test(trimmedEmail)) {
        setErrorMessage("Please enter a valid email address (e.g. name@domain.com).");
        return false;
      }

      // 3. Phone number validation (Numbers only, min 10 digits)
      const trimmedPhone = phone.trim();
      if (!trimmedPhone) {
        setErrorMessage("Please enter your Phone / WhatsApp number.");
        return false;
      }
      if (HAS_LETTERS_REGEX.test(trimmedPhone)) {
        setErrorMessage("Phone number cannot contain letters. Please enter numbers only.");
        return false;
      }
      const digitsOnly = trimmedPhone.replace(/[^0-9]/g, "");
      if (digitsOnly.length < 10) {
        setErrorMessage("Phone number must have at least 10 digits (numbers only, e.g. +91 98765 43210).");
        return false;
      }
      if (digitsOnly.length > 15) {
        setErrorMessage("Phone number exceeds the maximum length of 15 digits.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((current) => Math.min(current + 1, steps.length - 1));
    }
  };

  const handlePrev = () => {
    setErrorMessage("");
    setStep((current) => Math.max(current - 1, 0));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Enter key on early steps should advance, not validate contact fields
    if (step < steps.length - 1) {
      handleNext();
      return;
    }
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: service.trim(),
          description: description.trim(),
          timeline: timeline.trim(),
          budget: budget.trim(),
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        }),
      });

      let data: { success?: boolean; error?: string; submission?: { id?: string } };
      try {
        data = await response.json();
      } catch {
        throw new Error("Server returned an invalid response. Please try again.");
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit project inquiry.");
      }

      setSubmittedData({
        id: data.submission?.id,
        service,
        name: name.trim(),
        email: email.trim(),
      });
      setIsSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(0);
    setService("VFX");
    setDescription("");
    setTimeline("1-2 weeks");
    setBudget("");
    setName("");
    setEmail("");
    setPhone("");
    setIsSubmitted(false);
    setSubmittedData(null);
    setErrorMessage("");
  };

  const whatsappMessage = `Hi JOD Studios, I've submitted a project brief for ${service}. My name is ${name}.`;

  if (isSubmitted) {
    return (
      <div className="form form-success-box">
        <div className="success-badge">✓ BRIEF RECORDED IN STUDIO DATABASE</div>
        <h3 className="success-title">Thank you, {submittedData?.name}!</h3>
        <p className="success-desc">
          Your project specifications for <strong>{submittedData?.service}</strong> have been securely stored in our studio database. Our production team and administrators will review your inquiry in the Admin Portal and get in touch via <strong>{submittedData?.email}</strong>.
        </p>
        <div className="success-actions">
          <a
            href={whatsappUrl(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="button"
          >
            Connect on WhatsApp Now →
          </a>
          <button type="button" onClick={handleReset} className="button secondary">
            Submit Another Project
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="steps">
        {steps.map((_, index) => (
          <i key={index} className={`step ${index <= step ? "active" : ""}`} />
        ))}
      </div>

      <div className="eyebrow">
        0{step + 1} — {steps[step]}
      </div>

      {step === 0 && (
        <>
          <label>What are we creating? <span className="req">*</span></label>
          <div className="options">
            {services.map((item) => (
              <button
                type="button"
                className={`option ${service === item ? "selected" : ""}`}
                onClick={() => {
                  setService(item);
                  setErrorMessage("");
                }}
                key={item}
              >
                {item}
                {service === item && <span className="option-check"> ●</span>}
              </button>
            ))}
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <label>Tell us the story <span className="req">*</span></label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errorMessage) setErrorMessage("");
            }}
            placeholder="A little about your project, audience and ambition..."
            required
          />
        </>
      )}

      {step === 2 && (
        <>
          <label>When do you need it? <span className="req">*</span></label>
          <div className="options">
            {timelines.map((item) => (
              <button
                type="button"
                className={`option ${timeline === item ? "selected" : ""}`}
                onClick={() => {
                  setTimeline(item);
                  setErrorMessage("");
                }}
                key={item}
              >
                {item}
                {timeline === item && <span className="option-check"> ●</span>}
              </button>
            ))}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <label>
            Working budget <span className="field-hint">(Numbers only)</span> <span className="req">*</span>
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={budget}
            onChange={(e) => handleBudgetChange(e.target.value)}
            placeholder="e.g. 50,000 or ₹1,50,000"
            required
          />
        </>
      )}

      {step === 4 && (
        <>
          <label>
            Your name <span className="field-hint">(Letters only, no numbers)</span> <span className="req">*</span>
          </label>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Vikram Malhotra"
          />

          <label>
            Email <span className="field-hint">(Valid email format)</span> <span className="req">*</span>
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMessage) setErrorMessage("");
            }}
            placeholder="you@company.com"
          />

          <label>
            Phone / WhatsApp <span className="field-hint">(Numbers only, min 10 digits)</span> <span className="req">*</span>
          </label>
          <input
            required
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="+91 98765 43210"
          />
        </>
      )}

      {errorMessage && (
        <div className="form-error">
          <span className="error-icon">!</span> {errorMessage}
        </div>
      )}

      <div className="form-nav-group">
        {step > 0 && (
          <button
            className="button secondary"
            type="button"
            onClick={handlePrev}
            disabled={isSubmitting}
          >
            ← Previous
          </button>
        )}

        {step < steps.length - 1 ? (
          <button
            className="button dark"
            type="button"
            onClick={handleNext}
          >
            Continue →
          </button>
        ) : (
          <button
            className="button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting Brief..." : "Let's create something amazing →"}
          </button>
        )}
      </div>
    </form>
  );
}

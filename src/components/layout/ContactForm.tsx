// src/components/sections/ContactForm.tsx
import type { ChangeEvent, FormEvent} from 'react';
import React, { useState } from 'react';
import Button from '../common/Button';

/**
 * Form data structure for contact form
 */
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Error state structure for form validation
 */
interface FormErrors {
  [key: string]: string | null;
}

/**
 * Props for the FormInput sub-component
 */
interface FormInputProps {
  /** Input label */
  label: string;
  /** Input name (used as identifier) */
  name: string;
  /** Input type */
  type?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether this input is a textarea */
  textarea?: boolean;
  /** Any additional props */
  [key: string]: unknown;
}

/**
 * Contact form component with validation and submission handling
 * 
 * @example
 * ```tsx
 * <ContactForm />
 * ```
 */
const ContactForm: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  // Error state
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Reset submission states
    setSubmitSuccess(false);
    setSubmitError(null);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Show submitting state
    setIsSubmitting(true);
    
    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // In a real application, you would send the form data to an API
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      
      // if (!response.ok) throw new Error('Failed to submit form');
      
      // Success state
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      // Error state
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Input component with error handling
  const FormInput: React.FC<FormInputProps> = ({ 
    label, 
    name, 
    type = 'text', 
    placeholder, 
    textarea = false,
    ...rest 
  }) => (
    <div className="mb-4">
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-white mb-1"
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          value={formData[name as keyof FormData] || ''}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
            errors[name] 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-white/10 focus:border-purple-500'
          }`}
          rows={6}
          {...rest}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          placeholder={placeholder}
          value={formData[name as keyof FormData] || ''}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
            errors[name] 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-white/10 focus:border-purple-500'
          }`}
          {...rest}
        />
      )}
      {errors[name] && (
        <p className="mt-1 text-sm text-red-400">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 shadow-lg">
      {submitSuccess ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-green-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
          <p className="text-white/80 mb-6">
            Thank you for contacting us. We'll get back to you as soon as possible.
          </p>
          <Button 
            variant="outline" 
            className="border-white text-white hover:bg-white/20"
            onClick={() => setSubmitSuccess(false)}
          >
            Send Another Message
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Name"
              name="name"
              placeholder="Enter your name"
            />
            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
            />
          </div>
          <FormInput
            label="Subject"
            name="subject"
            placeholder="How can we help?"
          />
          <FormInput
            label="Message"
            name="message"
            placeholder="Enter your message..."
            textarea
          />
          
          {submitError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-200 text-sm">{submitError}</p>
            </div>
          )}
          
          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700"
              type="submit"
            >
              Send Message
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
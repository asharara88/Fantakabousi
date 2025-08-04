import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  description?: string;
  options?: { value: string; label: string }[];
  validation?: (value: string) => string | null;
  autoComplete?: string;
  pattern?: string;
  min?: number;
  max?: number;
  step?: number;
}

interface AccessibleFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => Promise<void>;
  submitLabel?: string;
  title?: string;
  description?: string;
  className?: string;
}

const AccessibleForm: React.FC<AccessibleFormProps> = ({
  fields,
  onSubmit,
  submitLabel = "Submit",
  title,
  description,
  className = ""
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      return field.validation(value);
    }

    // Built-in validations
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    if (field.type === 'url' && value) {
      try {
        new URL(value);
      } catch {
        return 'Please enter a valid URL';
      }
    }

    if (field.type === 'number' && value !== undefined) {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return 'Please enter a valid number';
      }
      if (field.min !== undefined && numValue < field.min) {
        return `Value must be at least ${field.min}`;
      }
      if (field.max !== undefined && numValue > field.max) {
        return `Value must be no more than ${field.max}`;
      }
    }

    return null;
  };

  const handleFieldChange = (field: FormField, value: any) => {
    setFormData(prev => ({ ...prev, [field.name]: value }));
    
    // Clear error when user starts typing
    if (errors[field.name]) {
      setErrors(prev => ({ ...prev, [field.name]: '' }));
    }
  };

  const handleFieldBlur = (field: FormField) => {
    const value = formData[field.name];
    const error = validateField(field, value);
    if (error) {
      setErrors(prev => ({ ...prev, [field.name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Focus first error field
      const firstErrorField = fields.find(field => newErrors[field.name]);
      if (firstErrorField) {
        const element = formRef.current?.querySelector(`[name="${firstErrorField.name}"]`) as HTMLElement;
        element?.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await onSubmit(formData);
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const fieldId = `field-${field.name}`;
    const errorId = `${fieldId}-error`;
    const descriptionId = `${fieldId}-description`;
    const hasError = !!errors[field.name];
    const value = formData[field.name] || '';

    const commonProps = {
      id: fieldId,
      name: field.name,
      required: field.required,
      'aria-invalid': hasError,
      'aria-describedby': [
        field.description ? descriptionId : '',
        hasError ? errorId : ''
      ].filter(Boolean).join(' '),
      autoComplete: field.autoComplete,
      className: `
        w-full px-4 py-3 border-2 rounded-xl transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary/20
        ${hasError 
          ? 'border-red-500 bg-red-50 dark:bg-red-950/20' 
          : 'border-border bg-background hover:border-muted-foreground focus:border-primary'
        }
      `,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const newValue = field.type === 'checkbox' 
          ? (e.target as HTMLInputElement).checked
          : e.target.value;
        handleFieldChange(field, newValue);
      },
      onBlur: () => handleFieldBlur(field),
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            placeholder={field.placeholder}
            rows={4}
            value={value}
          />
        );

      case 'select':
        return (
          <select {...commonProps} value={value}>
            <option value="">{field.placeholder || `Select ${field.label}`}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-3">
            <input
              {...commonProps}
              type="checkbox"
              checked={value}
              className="w-5 h-5 text-primary border-2 border-border rounded focus:ring-primary"
            />
            <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
              {field.label}
            </label>
          </div>
        );

      case 'radio':
        return (
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-foreground">{field.label}</legend>
            {field.options?.map(option => (
              <div key={option.value} className="flex items-center space-x-3">
                <input
                  id={`${fieldId}-${option.value}`}
                  name={field.name}
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  className="w-5 h-5 text-primary border-2 border-border focus:ring-primary"
                />
                <label 
                  htmlFor={`${fieldId}-${option.value}`}
                  className="text-sm font-medium text-foreground"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </fieldset>
        );

      default:
        return (
          <input
            {...commonProps}
            type={field.type}
            placeholder={field.placeholder}
            pattern={field.pattern}
            min={field.min}
            max={field.max}
            step={field.step}
            value={value}
          />
        );
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
      noValidate
    >
      {/* Form header */}
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h2 className="text-heading-lg text-foreground">{title}</h2>
          )}
          {description && (
            <p className="text-body text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Form fields */}
      <div className="space-y-6">
        {fields.map(field => (
          <div key={field.name} className="space-y-2">
            {field.type !== 'checkbox' && field.type !== 'radio' && (
              <label
                htmlFor={`field-${field.name}`}
                className="block text-sm font-medium text-foreground"
              >
                {field.label}
                {field.required && (
                  <span className="text-red-500 ml-1" aria-label="required">*</span>
                )}
              </label>
            )}

            {field.description && (
              <p
                id={`field-${field.name}-description`}
                className="text-sm text-muted-foreground"
              >
                {field.description}
              </p>
            )}

            {renderField(field)}

            {/* Error message */}
            {errors[field.name] && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-red-500"
                role="alert"
                id={`field-${field.name}-error`}
              >
                <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{errors[field.name]}</span>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Submit button */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            w-full px-6 py-4 rounded-xl font-semibold transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary/20
            ${isSubmitting
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary/80'
            }
          `}
        >
          {isSubmitting ? 'Submitting...' : submitLabel}
        </button>
      </div>

      {/* Submit status */}
      {submitStatus !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            flex items-center space-x-2 p-4 rounded-xl
            ${submitStatus === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
            }
          `}
          role="alert"
        >
          {submitStatus === 'success' ? (
            <>
              <CheckCircleIcon className="w-5 h-5" />
              <span>Form submitted successfully!</span>
            </>
          ) : (
            <>
              <ExclamationCircleIcon className="w-5 h-5" />
              <span>There was an error submitting the form. Please try again.</span>
            </>
          )}
        </motion.div>
      )}
    </form>
  );
};

export default AccessibleForm;
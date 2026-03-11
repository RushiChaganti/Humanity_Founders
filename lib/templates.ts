import { FieldConfig, LogicRule } from '@/types/forms';

export interface FormTemplate {
    id: string;
    title: string;
    description: string;
    category?: 'safety' | 'recruitment' | 'feedback' | 'general';
    fields: FieldConfig[];
    logic_rules: LogicRule[];
}

export const TEMPLATES: FormTemplate[] = [
    {
        id: 'safety-inspection',
        title: 'Site Safety Inspection',
        description: 'General safety inspection checklist for construction or industrial sites.',
        category: 'safety',
        fields: [
            {
                id: 'inspector-name',
                type: 'text',
                label: 'Inspector Name',
                required: true,
                validation_regex: '^[a-zA-Z\\s]{2,100}$',
                validation_message: 'Please enter a valid name (letters and spaces only).',
                description: 'Enter your full legal name.',
            },
            {
                id: 'inspection-date',
                type: 'date',
                label: 'Inspection Date',
                required: true,
            },
            {
                id: 'area-safe',
                type: 'radio',
                label: 'Is the work area safe?',
                required: true,
                options: [
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                ],
            },
            {
                id: 'hazards-found',
                type: 'textarea',
                label: 'Identify Hazards',
                required: false,
                placeholder: 'List any hazards found...',
            },
            {
                id: 'priority',
                type: 'select',
                label: 'Remediation Priority',
                required: false,
                options: [
                    { label: 'Low', value: 'low' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'High', value: 'high' },
                    { label: 'Immediate Action Required', value: 'critical' },
                ],
            },
        ],
        logic_rules: [
            {
                id: 'show-hazards',
                name: 'Show hazards if unsafe',
                condition_type: 'all',
                conditions: [
                    { field_id: 'area-safe', operator: 'equals', value: 'no' },
                ],
                actions: [
                    { field_id: 'hazards-found', action: 'show' },
                    { field_id: 'hazards-found', action: 'require' },
                    { field_id: 'priority', action: 'show' },
                    { field_id: 'priority', action: 'require' },
                ],
            },
            {
                id: 'hide-hazards',
                name: 'Hide hazards if safe',
                condition_type: 'all',
                conditions: [
                    { field_id: 'area-safe', operator: 'equals', value: 'yes' },
                ],
                actions: [
                    { field_id: 'hazards-found', action: 'hide' },
                    { field_id: 'priority', action: 'hide' },
                ],
            },
        ],
    },
    {
        id: 'incident-report',
        title: 'Incident Report',
        description: 'Detailed report for workplace incidents or near-misses.',
        category: 'safety',
        fields: [
            {
                id: 'incident-type',
                type: 'select',
                label: 'Incident Type',
                required: true,
                options: [
                    { label: 'Near Miss', value: 'near_miss' },
                    { label: 'Minor Injury', value: 'minor' },
                    { label: 'Major Injury', value: 'major' },
                    { label: 'Property Damage', value: 'damage' },
                ],
            },
            {
                id: 'description',
                type: 'textarea',
                label: 'Incident Description',
                required: true,
                max_length: 500,
                description: 'Provide a clear, factual account of what happened (max 500 chars).',
            },
            {
                id: 'emergency-services',
                type: 'radio',
                label: 'Were emergency services called?',
                required: false,
                options: [
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                ],
            },
            {
                id: 'services-notified',
                type: 'checkbox',
                label: 'Services Notified',
                required: false,
                options: [
                    { label: 'Fire', value: 'fire' },
                    { label: 'Police', value: 'police' },
                    { label: 'Ambulance', value: 'ambulance' },
                ],
            },
        ],
        logic_rules: [
            {
                id: 'show-emergency',
                name: 'Show emergency options for major incidents',
                condition_type: 'any',
                conditions: [
                    { field_id: 'incident-type', operator: 'equals', value: 'major' },
                    { field_id: 'incident-type', operator: 'equals', value: 'damage' },
                ],
                actions: [
                    { field_id: 'emergency-services', action: 'show' },
                ],
            },
            {
                id: 'show-services',
                name: 'Show services list if called',
                condition_type: 'all',
                conditions: [
                    { field_id: 'emergency-services', operator: 'equals', value: 'yes' },
                ],
                actions: [
                    { field_id: 'services-notified', action: 'show' },
                    { field_id: 'services-notified', action: 'require' },
                ],
            },
        ],
    },
    {
        id: 'kitchen-sink',
        title: 'All-Field Types Preview (MVP) ',
        description: 'A demonstration form containing every available field type and basic logic.',
        category: 'general',
        fields: [
            {
                id: 'text-field',
                type: 'text',
                label: 'Short Text Input',
                required: true,
                placeholder: 'Enter text here...',
                validation_regex: '^[a-zA-Z\\s]{3,}$',
                validation_message: 'Must be at least 3 letters long.',
                description: 'Try entering less than 3 letters to see validation in action.',
            },
            {
                id: 'textarea-field',
                type: 'textarea',
                label: 'Long Text Input',
                required: false,
                placeholder: 'Enter long-form text here...',
            },
            {
                id: 'select-field',
                type: 'select',
                label: 'Dropdown Selection',
                required: true,
                options: [
                    { label: 'Option A', value: 'a' },
                    { label: 'Option B', value: 'b' },
                    { label: 'Option C', value: 'c' },
                ],
            },
            {
                id: 'radio-field',
                type: 'radio',
                label: 'Single Choice (Radio)',
                required: true,
                options: [
                    { label: 'First Choice', value: 'first' },
                    { label: 'Second Choice', value: 'second' },
                ],
            },
            {
                id: 'checkbox-field',
                type: 'checkbox',
                label: 'Multiple Choice (Checkbox)',
                required: false,
                options: [
                    { label: 'Item 1', value: '1' },
                    { label: 'Item 2', value: '2' },
                    { label: 'Item 3', value: '3' },
                ],
            },
            {
                id: 'date-field',
                type: 'date',
                label: 'Date Selection',
                required: true,
            },
        ],
        logic_rules: [
            {
                id: 'demonstration-rule',
                name: 'Conditional Question Example',
                condition_type: 'all',
                conditions: [
                    { field_id: 'radio-field', operator: 'equals', value: 'second' },
                ],
                actions: [
                    { field_id: 'textarea-field', action: 'show' },
                    { field_id: 'textarea-field', action: 'require' },
                ],
            },
        ],
    },
    {
        id: 'job-application',
        title: 'Job Application Form',
        description: 'Standard application form for new candidates.',
        category: 'recruitment',
        fields: [
            {
                id: 'full-name',
                type: 'text',
                label: 'Full Name',
                required: true,
                validation_regex: '^[a-zA-Z\\s]{2,100}$',
                validation_message: 'Full name must contain only letters and be at least 2 characters long.',
                description: 'Enter your legal full name (letters only).',
            },
            {
                id: 'email',
                type: 'email',
                label: 'Email Address',
                required: true,
                placeholder: 'email@example.com',
                validation_regex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
                validation_message: 'Please enter a valid email address (e.g., name@company.com).',
                description: 'Must be a valid email address.',
            },
            {
                id: 'position',
                type: 'select',
                label: 'Applying for Position',
                required: true,
                options: [
                    { label: 'Software Engineer', value: 'swe' },
                    { label: 'Product Manager', value: 'pm' },
                    { label: 'UI/UX Designer', value: 'designer' },
                    { label: 'Data Scientist', value: 'ds' },
                ],
            },
            {
                id: 'experience-years',
                type: 'radio',
                label: 'Years of Experience',
                required: true,
                options: [
                    { label: '0-2 years', value: 'junior' },
                    { label: '3-5 years', value: 'mid' },
                    { label: '5+ years', value: 'senior' },
                ],
            },
            {
                id: 'portfolio-url',
                type: 'text',
                label: 'Portfolio URL',
                required: false,
                placeholder: 'https://...',
                validation_regex: '^https?:\\/\\/[^\\s$.?#].[^\\s]*$',
                validation_message: 'Please enter a valid URL (starting with http:// or https://).',
                description: 'Must be a valid URL starting with http:// or https://',
            },
            {
                id: 'skills',
                type: 'checkbox',
                label: 'Technical Skills',
                required: false,
                options: [
                    { label: 'React', value: 'react' },
                    { label: 'TypeScript', value: 'ts' },
                    { label: 'Node.js', value: 'node' },
                    { label: 'Python', value: 'python' },
                ],
            },
        ],
        logic_rules: [
            {
                id: 'show-portfolio-designer',
                name: 'Require portfolio for designers',
                condition_type: 'all',
                conditions: [
                    { field_id: 'position', operator: 'equals', value: 'designer' },
                ],
                actions: [
                    { field_id: 'portfolio-url', action: 'show' },
                    { field_id: 'portfolio-url', action: 'require' },
                ],
            },
        ],
    },
    {
        id: 'customer-feedback',
        title: 'Customer Satisfaction Survey',
        description: 'Gather feedback from customers about their experience.',
        category: 'feedback',
        fields: [
            {
                id: 'satisfaction-level',
                type: 'radio',
                label: 'How satisfied are you with our service?',
                required: true,
                options: [
                    { label: 'Very Satisfied', value: '5' },
                    { label: 'Satisfied', value: '4' },
                    { label: 'Neutral', value: '3' },
                    { label: 'Unsatisfied', value: '2' },
                    { label: 'Very Unsatisfied', value: '1' },
                ],
            },
            {
                id: 'improvement-areas',
                type: 'checkbox',
                label: 'What could we improve?',
                required: false,
                options: [
                    { label: 'Speed', value: 'speed' },
                    { label: 'Quality', value: 'quality' },
                    { label: 'Support', value: 'support' },
                    { label: 'Price', value: 'price' },
                ],
            },
            {
                id: 'detailed-feedback',
                type: 'textarea',
                label: 'Additional Comments',
                required: false,
                placeholder: 'Tell us more...',
            },
            {
                id: 'contact-back',
                type: 'radio',
                label: 'Would you like us to follow up with you?',
                required: true,
                options: [
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                ],
            },
            {
                id: 'contact-info',
                type: 'phone',
                label: 'Contact Detail (Email or Phone)',
                required: false,
                validation_regex: '^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}|[\\d\\s+\\-()]{7,})$',
                validation_message: 'Please enter a valid email or a phone number (at least 7 digits).',
                description: 'Provide a valid email or phone number.',
            },
        ],
        logic_rules: [
            {
                id: 'show-contact-info',
                name: 'Show contact info if follow up requested',
                condition_type: 'all',
                conditions: [
                    { field_id: 'contact-back', operator: 'equals', value: 'yes' },
                ],
                actions: [
                    { field_id: 'contact-info', action: 'show' },
                    { field_id: 'contact-info', action: 'require' },
                ],
            },
            {
                id: 'show-improvement-on-low-score',
                name: 'Ask for improvement on low scores',
                condition_type: 'any',
                conditions: [
                    { field_id: 'satisfaction-level', operator: 'equals', value: '1' },
                    { field_id: 'satisfaction-level', operator: 'equals', value: '2' },
                ],
                actions: [
                    { field_id: 'improvement-areas', action: 'show' },
                    { field_id: 'improvement-areas', action: 'require' },
                ],
            },
        ],
    },
];

import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_na069lq';
const EMAILJS_TEMPLATE_ID = 'template_lg6yehq';  // Updated to correct template
const EMAILJS_PUBLIC_KEY = 'hVdUjDvT83Z91H7YU';

export const emailService = {
    // Initialize EmailJS (call this once when app starts)
    init: () => {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    },

    // Send task reminder email
    sendTaskReminderEmail: async (userEmail, userName, taskTitle, dueTime) => {
        try {
            const templateParams = {
                to_email: userEmail,
                to_name: userName,
                task_title: taskTitle,
                due_time: dueTime
            };

            const response = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams
            );

            console.log('Email sent successfully:', response);
            return response;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
};

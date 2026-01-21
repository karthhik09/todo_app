/**
 * Email Service
 * Handles email notifications using EmailJS
 */

import emailjs from '@emailjs/browser';

//EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_na069lq';
const EMAILJS_TEMPLATE_ID = 'template_lg6yehq';
const EMAILJS_PUBLIC_KEY = 'hVdUjDvT83Z91H7YU';

export const emailService = {
    //Initialize EmailJS and calls once when app starts
    init: () => {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        console.log('EmailJS initialized successfully');
    },

    //Send task reminder email
    sendTaskReminderEmail: async (userEmail, userName, taskTitle, dueTime) => {
        console.log('\nAttempting to send email...');
        console.log('To:', userEmail);
        console.log('User:', userName);
        console.log('Task:', taskTitle);
        console.log('Due Time:', dueTime);

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

            console.log('Email sent successfully!');
            console.log('Response:', response);
            return response;
        } catch (error) {
            console.error('Error sending email:', error);
            console.error('Error details:', error.text || error.message);
            throw error;
        }
    }
};

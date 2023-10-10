import nodemailer from 'nodemailer';
import { Job } from 'bull';


const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'sp241930@outlook.com',
    pass: 'pqudyvmdbitagqnb',
  },
});

const sendEmail = async (emailJob: Job) => {
  try {
    const { from, to, subject, text } = emailJob.data.payload.email_details;

    const mailDetails = {
      from,
      to,
      subject,
      text
    };

    await transporter.sendMail(mailDetails);

    await emailJob.moveToCompleted('done', true);
    console.log('Email sent successfully...');
  } catch (error) {
    await emailJob.moveToFailed({ message: 'Task processing failed..' });
    console.error(error);
  }
};


export default sendEmail;

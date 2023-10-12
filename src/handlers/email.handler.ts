import nodemailer from 'nodemailer';
import { Job } from 'bull';
import axios from 'axios';

const request = require("request");


const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'sp241930@outlook.com',
    pass: 'pqudyvmdbitagqnb',
  },
});

const sendEmail = async (emailJob: Job) => {
  try {
    // const { from, to, subject, text } = emailJob.data.payload.email_details;
    console.log("<<==========Started Email Service==========>>")

    const data = emailJob.data.payload.email_details;

    // const mailDetails = {
    //   from,
    //   to,
    //   subject,
    //   text
    // };

    // await transporter.sendMail(mailDetails);



    const options = {
      method: "POST",
      url: "https://xx423.api.infobip.com/email/3/send",
      headers: {
        Authorization: "Basic RVVST1A6RXVybzc4NjU0SW5kaWFAOTg=",
      },
      formData: {
        from: "EPortal <noreply@europassistance.in>",
        to: data.toEmail,
        bcc: "sgadge.extern@europ-assistance.in",
        subject: data.subject,
        html: data.body,
      },
    };

    // const emailResponse = await axios.post(options.url, options.formData, {headers: options.headers})
    request(options, function(error: any, response: any) {
      if (error) { throw new Error(error); }
      console.log("Email Response:",response.body);
    });


    await emailJob.moveToCompleted('done', true);
    console.log('Email sent successfully...');
  } catch (error) {
    await emailJob.moveToFailed({ message: 'Task processing failed..' });
    console.error(error);
  }
};


export default sendEmail;

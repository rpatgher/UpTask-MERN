import nodemailer from 'nodemailer';

export const emailRegistration = async (data) => {
    const { name, email, token } = data;

    const transport = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
    });

    const url = `${process.env.FRONTEND_URL_PROD}/confirm/${token}`;

    const info = await transport.sendMail({
        from: '"UpTask - Projects Manager" <accounts@uptask.com>',
        to: email,
        subject: 'UpTask - Confirm your account',
        text: 'Confirm your account in UpTask',
        html: `
            <h2>Hello: ${name}</h2>
            <p>Your account is almost ready. Please confirm your account.</p>
            <p><a href="${url}">Confirm account</a></p>
            <p>If you did not create this account, you can ignore this mail.</p>
        `
    });
}

export const emailResetPassword = async (data) => {
    const { name, email, token } = data;

    const transport = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
    });

    const url = `${process.env.FRONTEND_URL_PROD}/forgot-password/${token}`;

    const info = await transport.sendMail({
        from: '"UpTask - Projects Manager" <accounts@uptask.com>',
        to: email,
        subject: 'UpTask - Reset your password',
        text: 'Reset your password in UpTask and recover access to your account to continue working on your projects',
        html: `
            <h2>Hello: ${name}</h2>
            <p>Please follow the next instructions.</p>
            <p><a href="${url}">To reset your password, click here.</a></p>
            <p>If you did not made this request, you can ignore this mail.</p>
        `
    });
}
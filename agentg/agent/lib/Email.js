"use strict";
// All rights reserved by Cekvenich|INTUITION.DEV) |  Cekvenich, licensed under LGPL 3.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
const fetch = require('make-fetch-happen');
const terse_b_1 = require("terse-b/terse-b");
class Email {
    constructor() {
        this.log = new terse_b_1.TerseB(this.constructor.name);
    }
    send(emailjsService_id, emailjsTemplate_id, emailjsUser_id, to_name, to_email, from_name, reply_to, subject, body) {
        this.log.info('email_to: ', to_email);
        fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                service_id: emailjsService_id,
                template_id: emailjsTemplate_id,
                user_id: emailjsUser_id,
                template_params: {
                    to_name: to_name,
                    to_email: to_email,
                    from_name: from_name,
                    reply_to: reply_to,
                    subject: subject,
                    body: body
                }
            }) //json
        })
            .then(res => {
            this.log.info(res);
            console.log(res.statusText);
        })
            .catch(err => {
            this.log.warn('send mail error: ', err);
        });
    } //()
} //class
exports.Email = Email;

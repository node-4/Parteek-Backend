var nodemailer = require('nodemailer');

module.exports = {
    receiptGiven: async (firstName, middleName, lastName, designation, address1, email, delegatePassword, callback) => {
        let html = `<div>
                        <p style="margin-top:0.5pt; margin-bottom:0pt; font-size:9pt;">
                        <img src="https://res.cloudinary.com/djgrqoefp/image/upload/v1696926751/prateek/images/product/eanaifegyr8br0ytklhg.png" width="201" height="158" alt="" style="float: left; "><br><span style="font-family:Helvetica;">&nbsp;</span></p>
                        <p style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt; font-size:10pt;"><strong>THE</strong><strong><span style="letter-spacing:0.5pt;">&nbsp;</span></strong><strong>FERTILISER</strong><strong><span style="letter-spacing:0.15pt;">&nbsp;</span></strong><strong>ASSOCIATION</strong><strong><span style="letter-spacing:0.55pt;">&nbsp;</span></strong><strong>OF</strong><strong><span style="letter-spacing:0.5pt;">&nbsp;</span></strong><strong><span style="letter-spacing:-0.1pt;">INDIA</span></strong></p>
                        <p style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt; font-size:10pt;">FAI<span style="letter-spacing:-0.2pt;">&nbsp;</span><span style="letter-spacing:-0.1pt;">House,</span></p>
                        <p style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt; font-size:10pt;">10, Shaheed Jit Singh Marg, New Delhi - 110067, India</p>
                        <p style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt; font-size:10pt;">Telephone: +91- 46005204, 46005233 Fax: 91-11-26960052, 46005213</p>
                        <p style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt;"><a href="mailto:Email%3Asecy@faidelhi.org" style="text-decoration:none;"><span style="font-size:10pt; letter-spacing:-0.1pt; color:#1154cc;">Email:secy@faidelhi.org</span></a><span style="width:19.78pt; font-size:10pt; display:inline-block;">&nbsp;</span><span style="font-size:10pt;">Website:</span><span style="font-size:10pt; letter-spacing:0.5pt;">&nbsp;</span><a href="http://www.faidelhi.org/" style="text-decoration:none;"><span style="font-size:10pt; letter-spacing:-0.1pt; color:#1154cc;">www.faidelhi.org</span></a></p>
                    </div>
                    <p><br style="clear:both; mso-break-type:section-break;"></p>
                    <div>
                    <p style="margin-top:0pt; margin-bottom:0pt; font-size:7pt;"><strong>&nbsp;</strong></p>
                    <p style="margin-top:0.25pt; margin-bottom:0pt; font-size:6pt;"><strong>&nbsp;</strong></p>
                    <p style="margin-top:0.05pt; margin-bottom:0pt; font-size:9pt;"><strong><span style=">&nbsp; &nbsp; &nbsp;</span></strong><strong><span style=">${firstName}  ${middleName} ${lastName}</span></strong></p>
                    <p style="margin-top:0.05pt; margin-bottom:0pt; font-size:9pt;"><strong><span style=">&nbsp; &nbsp; &nbsp;</span></strong><strong><span style=">${designation}</span></strong></p>
                    <p style="margin-top:0.05pt; margin-bottom:0pt; font-size:9pt;"><strong><span style=">&nbsp; &nbsp; &nbsp;</span></strong><strong><span style=">${address1}</span></strong></p>
                </div>
                    <p><br style="clear:both; mso-break-type:section-break;"></p>
                    <div>
                        <p style="margin-top:0.35pt; margin-bottom:0pt; font-size:9.5pt;"><strong>&nbsp;</strong></p>
                        <p style="margin-top:4.75pt; margin-left:16.8pt; margin-bottom:0pt; font-size:9pt;">Dear <span style="letter-spacing:-0.1pt;">Delegate,</span></p>
                        <p style="margin-top:0pt; margin-bottom:0pt; font-size:8pt;">&nbsp;</p>
                        <h1 style="margin:0pt 141.95pt 0pt 146.55pt; text-align:center; font-size:9pt;"><u>FAI</u><u><span style="letter-spacing:-0.4pt;">&nbsp;</span></u><u>Annual</u><u><span style="letter-spacing:-0.05pt;">&nbsp;</span></u><u>Seminar</u><u><span style="letter-spacing:-0.05pt;">&nbsp;</span></u><u>2023</u><u><span style="letter-spacing:-0.05pt;">&nbsp;</span></u></h1>
                        <h1 style="margin:0pt 141.95pt 0pt 120.5pt; text-align:center; font-size:9pt;"><u><span style="letter-spacing:-0.05pt;">INNOVATIONS IN FERTILIZER AND AGRICULTURE SECTORS</span></u></h1>
                        <h1 style="margin:0pt 141.95pt 0pt 146.55pt; text-align:center; font-size:9pt;">06<span style="letter-spacing:-0.05pt;">&nbsp;</span>-<span style="letter-spacing:-0.05pt;">&nbsp;</span>08<span style="letter-spacing:-0.05pt;">&nbsp;</span>December <span style="letter-spacing:-0.2pt;">2023</span></h1>
                        <p style="margin-top:0.3pt; margin-bottom:0pt; font-size:8.5pt;"><strong>&nbsp;</strong></p>
                        <p style="margin:4.75pt 8.3pt 0pt 16.8pt; text-align:justify; line-height:103%; font-size:9pt;">We are pleased to confirm having enrolled you as a delegate for the FAI<span style="letter-spacing:-0.3pt;">&nbsp;</span>Annual Seminar 2023 on &quot;INNOVATIONS IN FERTILIZER AND AGRICULTURE SECTORS&quot; scheduled to be held during 06 to 08 December 2023 at Hotel Pullman and Novotel,<span style="letter-spacing:-0.45pt;">&nbsp;</span>Aerocity, New Delhi, India.<span style="letter-spacing:-0.1pt;">&nbsp;</span>The Registration Desk will be open for the delegates at the Pre-Function<span style="letter-spacing:-0.35pt;">&nbsp;</span>Area of Peacock Ball Room at Hotel Pullman and Novotel, Aerocity, New Delhi, India at the following hours:</p>
                        <p style="margin-top:0.05pt; margin-bottom:0pt; font-size:10pt;">&nbsp;</p>
                        <p style="margin-top:0.05pt; margin-left:19.2pt; margin-bottom:0pt; font-size:9pt;">Wednesday,<span style="letter-spacing:-0.4pt;">&nbsp;</span>06<span style="letter-spacing:-0.3pt;">&nbsp;</span>Dec<span style="letter-spacing:-0.3pt;">&nbsp;</span><span style="letter-spacing:-0.2pt;">2023</span><span style="width:43.63pt; display:inline-block;">&nbsp;</span><span style="letter-spacing:-0.5pt;">:</span><span style="width:17.6pt; display:inline-block;">&nbsp;</span>09:30<span style="letter-spacing:-0.1pt;">&nbsp;</span>- 17:00 <span style="letter-spacing:-0.2pt;">hrs.</span></p>
                        <p style="margin-top:0pt; margin-bottom:0pt; font-size:10pt;">&nbsp;</p>
                        <p style="margin-top:6.3pt; margin-left:19.2pt; margin-bottom:0pt; font-size:9pt;">Thursday,<span style="letter-spacing:-0.25pt;">&nbsp;</span>07<span style="letter-spacing:-0.25pt;">&nbsp;</span>Dec<span style="letter-spacing:-0.2pt;">&nbsp;2023</span><span style="width:53.64pt; display:inline-block;">&nbsp;</span><span style="letter-spacing:-0.5pt;">:</span><span style="width:17.6pt; display:inline-block;">&nbsp;</span>09:00<span style="letter-spacing:-0.1pt;">&nbsp;</span>- 17:00 <span style="letter-spacing:-0.2pt;">hrs.</span></p>
                        <p style="margin-top:0pt; margin-bottom:0pt; font-size:10pt;">&nbsp;</p>
                        <p style="margin-top:6.3pt; margin-left:19.2pt; margin-bottom:0pt; font-size:9pt;">Friday,<span style="letter-spacing:-0.25pt;">&nbsp;</span>08<span style="letter-spacing:-0.25pt;">&nbsp;</span>Dec<span style="letter-spacing:-0.2pt;">&nbsp;2023</span><span style="width:66.16pt; display:inline-block;">&nbsp;</span><span style="letter-spacing:-0.5pt;">:</span><span style="width:17.6pt; display:inline-block;">&nbsp;</span>09:00<span style="letter-spacing:-0.1pt;">&nbsp;</span>- 12:00 <span style="letter-spacing:-0.2pt;">hrs.</span></p>
                        <p style="margin-top:6.3pt; margin-left:19.2pt; margin-bottom:0pt; font-size:9pt;"><span style="letter-spacing:-0.2pt;">&nbsp;</span></p>
                        <p style="margin-top:6.3pt; margin-left:19.2pt; margin-bottom:0pt; font-size:9pt;"><span style="letter-spacing:-0.2pt;">In order to keep in touch with the latest updates of the Seminar we have created a Mobile App for the benefits of the delegates which will be available shortly. The credentials of the same are given below:</span> -</p>
                        <p style="margin-top:6.3pt; margin-left:19.2pt; margin-bottom:0pt; font-size:9pt;">&nbsp;</p>
                        <h1 style="margin-top:0.05pt; margin-left:16.8pt; margin-bottom:0pt; font-size:9pt;">Name<span style="letter-spacing:-0.1pt;">&nbsp;</span>of<span style="letter-spacing:-0.1pt;">&nbsp;</span>the<span style="letter-spacing:-0.05pt;">&nbsp;</span>Mobile<span style="letter-spacing:-0.1pt;">&nbsp;A</span>pp<span style="letter-spacing:-0.05pt;">:</span><span style="letter-spacing:-0.1pt;">&nbsp;</span>FAI<span style="letter-spacing:-0.05pt;">&nbsp;</span><span style="letter-spacing:-0.1pt;">Seminar 2023</span></h1>
                        <p style="margin-top:8pt; margin-left:16.8pt; margin-bottom:0pt; font-size:9pt;"><em>To</em><em><span style="letter-spacing:-0.1pt;">&nbsp;</span></em><em>be</em><em><span style="letter-spacing:-0.1pt;">&nbsp;</span></em><em>downloaded</em><em><span style="letter-spacing:-0.1pt;">&nbsp;</span></em><em>from</em><em><span style="letter-spacing:-0.05pt;">&nbsp;</span></em><em>Google</em><em><span style="letter-spacing:-0.1pt;">&nbsp;</span></em><em>Play</em><em><span style="letter-spacing:-0.1pt;">&nbsp;</span></em><em>Store</em><em><span style="letter-spacing:-0.1pt;">&nbsp;</span></em><em>and</em><em><span style="letter-spacing:-0.4pt;">&nbsp;</span></em><em>Apple</em><em><span style="letter-spacing:-0.45pt;">&nbsp;</span></em><em>App</em><em><span style="letter-spacing:-0.05pt;">&nbsp;</span></em><em><span style="letter-spacing:-0.1pt;">Store.</span></em></p>
                        <p style="margin-top:0pt; margin-bottom:0pt; font-size:10pt;"><em>&nbsp;</em></p>
                        <h1 style="margin:6.55pt 141.95pt 0pt 146.55pt; text-align:center; font-size:9pt;">Mobile<span style="letter-spacing:-0.35pt;">&nbsp;</span>App Login <span style="letter-spacing:-0.1pt;">Details</span></h1>
                        <p style="margin-top:0pt; margin-bottom:0pt; font-size:10pt;"><strong>&nbsp;</strong></p>
                        <p style="margin-top:7.15pt; margin-left:19.2pt; margin-bottom:0pt; font-size:9pt;">User <span style="letter-spacing:-0.25pt;">Id:&nbsp;</span><span style="letter-spacing:-0.1pt;">
                        </span><strong><span style="letter-spacing:-0.1pt;">${email}</span></strong></span></p>
                        <p style="margin-top:7.15pt; margin-left:19.2pt; margin-bottom:0pt; font-size:9pt;"><span style="letter-spacing:-0.1pt;">Password:</span> <span style="letter-spacing:-0.1pt;">
                        </span><strong><span style="letter-spacing:-0.1pt;">${delegatePassword}</span></strong></span></p>
                        <p style="margin-top:0.1pt; margin-bottom:0pt; font-size:10pt;">&nbsp;</p>
                        <p style="margin:0.05pt 8.3pt 0pt 16.8pt; line-height:103%; font-size:9pt;">In case you are unable to collect registration material personally, you can send a representative with an authorization letter to collect the material.</p>                        
                        <p style="margin:0.05pt 8.3pt 0pt 16.8pt; line-height:103%; font-size:9pt;">For any issues regarding the working of app, please contact us at faisk767@gmail.com.</p>
                        <p style="margin-top:0.05pt; margin-bottom:0pt; font-size:10.5pt;">&nbsp;</p>
                        <p style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt; font-size:9pt;">Thanking<span style="letter-spacing:-0.15pt;">&nbsp;</span><span style="letter-spacing:-0.2pt;">You,</span></p>
                        <p style="margin-top:0.3pt; margin-left:16.8pt; margin-bottom:0pt; font-size:9pt;"><span style="letter-spacing:-0.1pt;">Yours</span><span style="letter-spacing:-0.35pt;">&nbsp;</span><span style="letter-spacing:-0.1pt;">faithfully</span></p>
                        <p style="margin-top:3.25pt; margin-left:16.8pt; margin-bottom:0pt; font-size:9pt;">for<span style="letter-spacing:-0.15pt;">&nbsp;</span>The Fertiliser<span style="letter-spacing:-0.5pt;">&nbsp;</span>Association of <span style="letter-spacing:-0.1pt;">India,</span></p>
                        <p style="margin-top:0.5pt; margin-bottom:0pt; font-size:13.5pt;">&nbsp;</p>
                        <h1 style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt; font-size:9pt;">D. <span style="letter-spacing:-0.1pt;">Ramakrishnan</span></h1>
                        <p style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt; font-size:9pt;">Additional Director &amp; <span style="letter-spacing:-0.1pt;">Secretary</span></p>
                    </div>
                    <p style="bottom: 10px; right: 10px; position: absolute;"><a href="https://wordtohtml.net" target="_blank" style="font-size:11px; color: #d0d0d0;">t</a></p>`
        // const pdfBuffer = await html2pdf().from(html).outputPdf();

        const transporter = nodemailer.createTransport({
            host: 'faidelhi.mithiskyconnect.com',
            port: 587,
            auth: {
                user: "secy@faidelhi.org",
                pass: "SeCyF^ih0$",
            },
        }); const mailOptions = {
            from: "secy@faidelhi.org",
            to: email,
            cc: "acctt@faidelhi.org",
            subject: "Subject of the Email",
            text: "Text content of the email",
            html: html
        };
        let info = await transporter.sendMail(mailOptions);
        if (info) {
            return true;
        } else {
            return false;
        }
        // });
    },
    receiptNotGiven: async (firstName, middleName, lastName, designation, address1, email, delegatePassword, callback) => {
        let html = `<div>
                        <p style="margin-top:0.5pt; margin-bottom:0pt; font-size:9pt;">
                        <img src="https://res.cloudinary.com/djgrqoefp/image/upload/v1696926751/prateek/images/product/eanaifegyr8br0ytklhg.png" width="201" height="158" alt="" style="float: left; "><br><span style="font-family:Helvetica;">&nbsp;</span></p>
                        <p style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt; font-size:10pt;"><strong>THE</strong><strong><span style="letter-spacing:0.5pt;">&nbsp;</span></strong><strong>FERTILISER</strong><strong><span style="letter-spacing:0.15pt;">&nbsp;</span></strong><strong>ASSOCIATION</strong><strong><span style="letter-spacing:0.55pt;">&nbsp;</span></strong><strong>OF</strong><strong><span style="letter-spacing:0.5pt;">&nbsp;</span></strong><strong><span style="letter-spacing:-0.1pt;">INDIA</span></strong></p>
                        <p style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt; font-size:10pt;">FAI<span style="letter-spacing:-0.2pt;">&nbsp;</span><span style="letter-spacing:-0.1pt;">House,</span></p>
                        <p style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt; font-size:10pt;">10, Shaheed Jit Singh Marg, New Delhi - 110067, India</p>
                        <p style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt; font-size:10pt;">Telephone: +91- 46005204, 46005233 Fax: 91-11-26960052, 46005213</p>
                        <p style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt;"><a href="mailto:Email%3Asecy@faidelhi.org" style="text-decoration:none;"><span style="font-size:10pt; letter-spacing:-0.1pt; color:#1154cc;">Email:secy@faidelhi.org</span></a><span style="width:19.78pt; font-size:10pt; display:inline-block;">&nbsp;</span><span style="font-size:10pt;">Website:</span><span style="font-size:10pt; letter-spacing:0.5pt;">&nbsp;</span><a href="http://www.faidelhi.org/" style="text-decoration:none;"><span style="font-size:10pt; letter-spacing:-0.1pt; color:#1154cc;">www.faidelhi.org</span></a></p>
                    </div>
                    <p><br style="clear:both; mso-break-type:section-break;"></p>
                    <div>
                        <p style="margin-top:0pt; margin-bottom:0pt; font-size:7pt;"><strong>&nbsp;</strong></p>
                        <p style="margin-top:0.25pt; margin-bottom:0pt; font-size:6pt;"><strong>&nbsp;</strong></p>
                        <p style="margin-top:0.05pt; margin-bottom:0pt; font-size:9pt;"><strong><span style=">&nbsp; &nbsp; &nbsp;</span></strong><strong><span style=">${firstName}  ${middleName} ${lastName}</span></strong></p>
                        <p style="margin-top:0.05pt; margin-bottom:0pt; font-size:9pt;"><strong><span style=">&nbsp; &nbsp; &nbsp;</span></strong><strong><span style=">${designation}</span></strong></p>
                        <p style="margin-top:0.05pt; margin-bottom:0pt; font-size:9pt;"><strong><span style=">&nbsp; &nbsp; &nbsp;</span></strong><strong><span style=">${address1}</span></strong></p>
                    </div>
                    <p><br style="clear:both; mso-break-type:section-break;"></p>
                    <div>
                        <p style="margin-top:0.35pt; margin-bottom:0pt; font-size:9.5pt;"><strong>&nbsp;</strong></p>
                        <p style="margin-top:4.75pt; margin-left:16.8pt; margin-bottom:0pt; font-size:9pt;">Dear <span style="letter-spacing:-0.1pt;">Delegate,</span></p>
                        <p style="margin-top:0pt; margin-bottom:0pt; font-size:8pt;">&nbsp;</p>
                        <h1 style="margin:0pt 141.95pt 0pt 146.55pt; text-align:center; font-size:9pt;"><u>FAI</u><u><span style="letter-spacing:-0.4pt;">&nbsp;</span></u><u>Annual</u><u><span style="letter-spacing:-0.05pt;">&nbsp;</span></u><u>Seminar</u><u><span style="letter-spacing:-0.05pt;">&nbsp;</span></u><u>2023</u><u><span style="letter-spacing:-0.05pt;">&nbsp;</span></u></h1>
                        <h1 style="margin:0pt 141.95pt 0pt 120.5pt; text-align:center; font-size:9pt;"><u><span style="letter-spacing:-0.05pt;">INNOVATIONS IN FERTILIZER AND AGRICULTURE SECTORS</span></u></h1>
                        <h1 style="margin:0pt 141.95pt 0pt 146.55pt; text-align:center; font-size:9pt;">06<span style="letter-spacing:-0.05pt;">&nbsp;</span>-<span style="letter-spacing:-0.05pt;">&nbsp;</span>08<span style="letter-spacing:-0.05pt;">&nbsp;</span>December <span style="letter-spacing:-0.2pt;">2023</span></h1>
                        <p style="margin-top:0.3pt; margin-bottom:0pt; font-size:8.5pt;"><strong>&nbsp;</strong></p>
                        <p style="margin:4.75pt 8.3pt 0pt 16.8pt; text-align:justify; line-height:103%; font-size:9pt;">We are pleased to confirm having enrolled you as a delegate for the FAI<span style="letter-spacing:-0.3pt;">&nbsp;</span>Annual Seminar 2023 on &quot;INNOVATIONS IN FERTILIZER AND AGRICULTURE SECTORS&quot; scheduled to be held during 06 to 08 December 2023 at Hotel Pullman and Novotel,<span style="letter-spacing:-0.45pt;">&nbsp;</span>Aerocity, New Delhi, India.<span style="letter-spacing:-0.1pt;">&nbsp;</span>The Registration Desk will be open for the delegates at the Pre-Function<span style="letter-spacing:-0.35pt;">&nbsp;</span>Area of Peacock Ball Room at Hotel Pullman and Novotel, Aerocity, New Delhi, India at the following hours:</p>
                        <p style="margin-top:0.05pt; margin-bottom:0pt; font-size:10pt;">&nbsp;</p>
                        <p style="margin-top:0.05pt; margin-left:19.2pt; margin-bottom:0pt; font-size:9pt;">Wednesday,<span style="letter-spacing:-0.4pt;">&nbsp;</span>06<span style="letter-spacing:-0.3pt;">&nbsp;</span>Dec<span style="letter-spacing:-0.3pt;">&nbsp;</span><span style="letter-spacing:-0.2pt;">2023</span><span style="width:43.63pt; display:inline-block;">&nbsp;</span><span style="letter-spacing:-0.5pt;">:</span><span style="width:17.6pt; display:inline-block;">&nbsp;</span>09:30<span style="letter-spacing:-0.1pt;">&nbsp;</span>- 17:00 <span style="letter-spacing:-0.2pt;">hrs.</span></p>
                        <p style="margin-top:0pt; margin-bottom:0pt; font-size:10pt;">&nbsp;</p>
                        <p style="margin-top:6.3pt; margin-left:19.2pt; margin-bottom:0pt; font-size:9pt;">Thursday,<span style="letter-spacing:-0.25pt;">&nbsp;</span>07<span style="letter-spacing:-0.25pt;">&nbsp;</span>Dec<span style="letter-spacing:-0.2pt;">&nbsp;2023</span><span style="width:53.64pt; display:inline-block;">&nbsp;</span><span style="letter-spacing:-0.5pt;">:</span><span style="width:17.6pt; display:inline-block;">&nbsp;</span>09:00<span style="letter-spacing:-0.1pt;">&nbsp;</span>- 17:00 <span style="letter-spacing:-0.2pt;">hrs.</span></p>
                        <p style="margin-top:0pt; margin-bottom:0pt; font-size:10pt;">&nbsp;</p>
                        <p style="margin-top:6.3pt; margin-left:19.2pt; margin-bottom:0pt; font-size:9pt;">Friday,<span style="letter-spacing:-0.25pt;">&nbsp;</span>08<span style="letter-spacing:-0.25pt;">&nbsp;</span>Dec<span style="letter-spacing:-0.2pt;">&nbsp;2023</span><span style="width:66.16pt; display:inline-block;">&nbsp;</span><span style="letter-spacing:-0.5pt;">:</span><span style="width:17.6pt; display:inline-block;">&nbsp;</span>09:00<span style="letter-spacing:-0.1pt;">&nbsp;</span>- 12:00 <span style="letter-spacing:-0.2pt;">hrs.</span></p>
                        <p style="margin-top:6.3pt; margin-left:19.2pt; margin-bottom:0pt; font-size:9pt;"><span style="letter-spacing:-0.2pt;">&nbsp;</span></p>
                        <p style="margin-top:6.3pt; margin-left:19.2pt; margin-bottom:0pt; font-size:9pt;"><span style="letter-spacing:-0.2pt;">In order to keep in touch with the latest updates of the Seminar we have created a Mobile App for the benefits of the delegates which will be available shortly. The credentials of the same are given below:</span> -</p>
                        <p style="margin-top:6.3pt; margin-left:19.2pt; margin-bottom:0pt; font-size:9pt;">&nbsp;</p>
                        <h1 style="margin-top:0.05pt; margin-left:16.8pt; margin-bottom:0pt; font-size:9pt;">Name<span style="letter-spacing:-0.1pt;">&nbsp;</span>of<span style="letter-spacing:-0.1pt;">&nbsp;</span>the<span style="letter-spacing:-0.05pt;">&nbsp;</span>Mobile<span style="letter-spacing:-0.1pt;">&nbsp;A</span>pp<span style="letter-spacing:-0.05pt;">:</span><span style="letter-spacing:-0.1pt;">&nbsp;</span>FAI<span style="letter-spacing:-0.05pt;">&nbsp;</span><span style="letter-spacing:-0.1pt;">Seminar 2023</span></h1>
                        <p style="margin-top:8pt; margin-left:16.8pt; margin-bottom:0pt; font-size:9pt;"><em>To</em><em><span style="letter-spacing:-0.1pt;">&nbsp;</span></em><em>be</em><em><span style="letter-spacing:-0.1pt;">&nbsp;</span></em><em>downloaded</em><em><span style="letter-spacing:-0.1pt;">&nbsp;</span></em><em>from</em><em><span style="letter-spacing:-0.05pt;">&nbsp;</span></em><em>Google</em><em><span style="letter-spacing:-0.1pt;">&nbsp;</span></em><em>Play</em><em><span style="letter-spacing:-0.1pt;">&nbsp;</span></em><em>Store</em><em><span style="letter-spacing:-0.1pt;">&nbsp;</span></em><em>and</em><em><span style="letter-spacing:-0.4pt;">&nbsp;</span></em><em>Apple</em><em><span style="letter-spacing:-0.45pt;">&nbsp;</span></em><em>App</em><em><span style="letter-spacing:-0.05pt;">&nbsp;</span></em><em><span style="letter-spacing:-0.1pt;">Store.</span></em></p>
                        <p style="margin-top:0pt; margin-bottom:0pt; font-size:10pt;"><em>&nbsp;</em></p>
                        <h1 style="margin:6.55pt 141.95pt 0pt 146.55pt; text-align:center; font-size:9pt;">Mobile<span style="letter-spacing:-0.35pt;">&nbsp;</span>App Login <span style="letter-spacing:-0.1pt;">Details</span></h1>
                        <p style="margin-top:0pt; margin-bottom:0pt; font-size:10pt;"><strong>&nbsp;</strong></p>
                        <p style="margin-top:7.15pt; margin-left:19.2pt; margin-bottom:0pt; font-size:9pt;">User <span style="letter-spacing:-0.25pt;">Id:&nbsp;</span><span style="letter-spacing:-0.1pt;">
                        </span><strong><span style="letter-spacing:-0.1pt;">${email}</span></strong></span></p>
                        <p style="margin-top:7.15pt; margin-left:19.2pt; margin-bottom:0pt; font-size:9pt;"><span style="letter-spacing:-0.1pt;">Password:</span> <span style="letter-spacing:-0.1pt;">
                        </span><strong><span style="letter-spacing:-0.1pt;">${delegatePassword}</span></strong></span></p>
                        <p style="margin-top:0.1pt; margin-bottom:0pt; font-size:10pt;">&nbsp;</p>
                        <p style="margin:0.05pt 8.3pt 0pt 16.8pt; line-height:103%; font-size:9pt;">In case you are unable to collect registration material personally, you can send a representative with an authorization letter to collect the material.</p>
                        <div>
                        <p style="margin:0.05pt 8.3pt 0pt 16.8pt; line-height:103%; font-size:9pt;">&nbsp;</p>
                        <p style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt; font-size:7.5pt;">
                        <span style="letter-spacing:-0.1pt; color:#ff0000;">We</span>
                        <span style="letter-spacing:-0.1pt; color:#ff0000;">have</span>
                        <span style="letter-spacing:-0.1pt; color:#ff0000;">yet</span>
                        <span style="letter-spacing:-0.1pt; color:#ff0000;">to</span>
                        <span style="letter-spacing:-0.1pt; color:#ff0000;">receive</span>
                        <span style="letter-spacing:-0.1pt; color:#ff0000;">the</span>
                        <span style="letter-spacing:-0.1pt; color:#ff0000;">seminar</span>
                        <span style="letter-spacing:-0.1pt; color:#ff0000;">fee.</span>
                        <span style="letter-spacing:-0.1pt; color:#ff0000;">Kindly</span>
                        <span style="letter-spacing:-0.1pt; color:#ff0000;">expedite</span>
                        <span style="letter-spacing:-0.1pt; color:#ff0000;">the</span>
                        <span style="letter-spacing:-0.1pt; color:#ff0000;">same</span>
                        <p style="margin-top:0pt; margin-bottom:0pt; font-size:8pt;">&nbsp;</p>    
                        </div>
                        <p style="margin:0.05pt 8.3pt 0pt 16.8pt; line-height:103%; font-size:9pt;">For any issues regarding the working of app, please contact us at faisk767@gmail.com.</p>
                        <p style="margin-top:0.05pt; margin-bottom:0pt; font-size:10.5pt;">&nbsp;</p>
                        <p style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt; font-size:9pt;">Thanking<span style="letter-spacing:-0.15pt;">&nbsp;</span><span style="letter-spacing:-0.2pt;">You,</span></p>
                        <p style="margin-top:0.3pt; margin-left:16.8pt; margin-bottom:0pt; font-size:9pt;"><span style="letter-spacing:-0.1pt;">Yours</span><span style="letter-spacing:-0.35pt;">&nbsp;</span><span style="letter-spacing:-0.1pt;">faithfully</span></p>
                        <p style="margin-top:3.25pt; margin-left:16.8pt; margin-bottom:0pt; font-size:9pt;">for<span style="letter-spacing:-0.15pt;">&nbsp;</span>The Fertiliser<span style="letter-spacing:-0.5pt;">&nbsp;</span>Association of <span style="letter-spacing:-0.1pt;">India,</span></p>
                        <p style="margin-top:0.5pt; margin-bottom:0pt; font-size:13.5pt;">&nbsp;</p>
                        <h1 style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt; font-size:9pt;">D. <span style="letter-spacing:-0.1pt;">Ramakrishnan</span></h1>
                        <p style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt; font-size:9pt;">Additional Director &amp; <span style="letter-spacing:-0.1pt;">Secretary</span></p>
                    </div>
                    <p style="bottom: 10px; right: 10px; position: absolute;"><a href="https://wordtohtml.net" target="_blank" style="font-size:11px; color: #d0d0d0;">t</a></p>`

        const transporter = nodemailer.createTransport({
            host: 'faidelhi.mithiskyconnect.com',
            port: 587,
            auth: {
                user: "secy@faidelhi.org",
                pass: "SeCyF^ih0$",
            },
        }); const mailOptions = {
            from: "secy@faidelhi.org",
            to: email,
            cc: "acctt@faidelhi.org",
            subject: "Subject of the Email",
            text: "Text content of the email",
            html: html,
        };
        let info = await transporter.sendMail(mailOptions);
        if (info) {
            return true;
        } else {
            return false;
        }
    },
}
